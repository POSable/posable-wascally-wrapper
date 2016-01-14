var WascallyRabbit = function() {
    this.wascally = require('wascally');
    this.settings = require('./wascallyConfig').settings;
    this.appServiceName = "";
    this.server = require('os').hostname();
};

WascallyRabbit.prototype.republishWithMsgCounter = function(msg) {
    return this.wascally.publish(msg.fields.exchange, {
        type: msg.type,
        body: msg.body,
        routingKey: msg.key,
        correlationId: msg.correlationId,
        headers: {retryCount: ++msg.properties.headers.retryCount}
    });
};

WascallyRabbit.prototype.publishObject = function(exchange, type, payload, key, requestID) {
    console.log("in publish",exchange, type, payload, key, requestID);
    return this.wascally.publish(exchange, {
        type: type,
        body: payload,
        routingKey: key,
        correlationId: requestID,
        headers: {retryCount: 0}
    });
};

WascallyRabbit.prototype.rabbitDispose = function(msg, err) {
    var retrySuccess = function () { msg.ack(); };
    var retryAbort = function (err) {
        console.log(err);
        msg.nack();
    };
    try {
        if (err) {
            var msgCount = msg.properties.headers.retryCount;
            if (err.deadLetter === true || msgCount >= this.settings.connection.levelOne_retries) {
                console.log('Message sent to dead letter que');
                msg.reject();
            } else {
                console.log('Message republished: Retry #' + msgCount);
                this.republishWithMsgCounter(msg).then(retrySuccess(), retryAbort(err));
            }
        } else {
            console.log('Message acked');
            msg.ack();
        }
    } catch (err) {
        console.log('System Error in Rabbit Message Dispose');
        throw err;
    }
};

WascallyRabbit.prototype.addLogEntry = function(logLevel, message, stack) {
    var server = this.server;
    var application = this.appServiceName;
    var logEntryMessage = require('./messageFactory').newLogMessage(server, application, logLevel, message, stack);
    console.log("setting arguments for logging entry");
    return this.publishObject ('all-commands', 'logger.command.addLogEntry', logEntryMessage, 'service.logging', undefined);
};

WascallyRabbit.prototype.raiseNewTransactionEvent = function(internalID, requestID, payload) {
    var server = this.server;
    var application = this.appServiceName;
    var transactionMessage = require('./messageFactory').raiseTransactionEvent(internalID, server, application, payload);
    console.log("setting arguments for transaction event");
    return this.publishObject ('posapi.event.receivedCreateTransactionRequest', 'posapi.event.receivedCreateTransactionRequest', transactionMessage, undefined, requestID);
};
// Payment endpoint -- deprecated
//WascallyRabbit.prototype.raiseNewPaymentEvent = function(internalID, payload) {
//    var server = this.server;
//    var application = this.appServiceName;
//    var paymentMessage = require('./messageFactory').raisePaymentEvent(internalID, server, application, payload);
//    console.log("setting arguments for payment event");
//    return this.publishObject('posapi.event.receivedCreatePaymentRequest', 'posapi.event.receivedCreatePaymentRequest', paymentMessage);
//};

WascallyRabbit.prototype.raiseErrorResponseEmailAndPersist = function(internalID, payload) {
    var server = this.server;
    var application = this.appServiceName;
    var message = require('./messageFactory').raiseErrorResponseEmailAndPersist(internalID, server, application, payload);
    console.log("setting arguments for bad request event");
    return this.publishObject('posapi.event.receivedBadApiRequest', 'posapi.event.receivedBadApiRequest', message, undefined, undefined);
};

WascallyRabbit.prototype.raiseNewDailySumEvent = function(internalID, payload) {
    var server = this.server;
    var application = this.appServiceName;
    var dailySumMessage = require('./messageFactory').raiseNewDailySumEvent(internalID, server, application, payload);
    console.log("setting arguments for Daily Sum event");
    return this.publishObject ('persistence.event.calculatedFinancialDailySummary', 'persistence.event.calculatedFinancialDailySummary', dailySumMessage, undefined, undefined);
};

WascallyRabbit.prototype.setQSubscription = function(nameOfQ) {
    var queArray = this.settings.queues.map(function(que){
        if (que.name === nameOfQ) {
            console.log("Subscribe to Q " + nameOfQ);
            que.subscribe = true;
        }
        return que
    });
    this.settings.queues = queArray;
};

WascallyRabbit.prototype.setEnvConnectionValues = function(env) {
    this.settings.connection = env;
};

WascallyRabbit.prototype.setHandler = function (messageType, func) {
    console.log("Setting handler for message type " + messageType);
    this.wascally.handle(messageType, func);
    console.log("Handler setup successful");
};

WascallyRabbit.prototype.setup = function(name) {
    this.appServiceName = name;
    this.wascally.configure(this.settings).done(function () {
        console.log("Successful connection to RabbitMQ server");
    });
};

module.exports = WascallyRabbit;



