var uuid = require('node-uuid');

var WascallyRabbit = function() {
    this.wascally = require('wascally');
    this.settings = require('./wascallyConfig').settings;
    this.appServiceName = "";
    this.server = require('os').hostname();
    this.subscribedQ = "";
};

WascallyRabbit.prototype.republish_withMsgCounter = function(msg) {
    var level1_count = msg.properties.headers.level1_retryCount;
    var level2_count = msg.properties.headers.level2_retryCount;
    var env = this.settings.connection;
    var messageID = uuid.v4();
    function continue_level2_retries() { return (level1_count >= env.level1_retries) && (level2_count <= env.level2_retries);}

    if (level1_count < env.level1_retries) {
        return this.wascally.publish('all-commands', {
            type: msg.type,
            body: msg.body,
            routingKey: this.subscribedQ,
            correlationId: msg.properties.correlationId,
            messageId: messageID,
            headers: {level1_retryCount: ++level1_count, level2_retryCount: level2_count}
        });
    } else if (continue_level2_retries()) {
        return this.wascally.publish('internal.delayExchange', {
            type: msg.type,
            body: msg.body,
            routingKey: this.subscribedQ,
            correlationId: msg.properties.correlationId,
            messageId: messageID,
            headers: {level1_retryCount: level1_count, level2_retryCount: ++level2_count}
        });
    } else {
        throw new Error('Message: '+ msg.properties.messageId +' - Error republishing');
    }
};

WascallyRabbit.prototype.publishObject = function(exchange, type, payload, key, requestID) {
    console.log("in publish", exchange, type, payload, key, requestID);
    var messageID = uuid.v4();
    return this.wascally.publish(exchange, {
        type: type,
        body: payload,
        routingKey: key,
        correlationId: requestID,
        messageId: messageID,
        headers: {level1_retryCount: 0, level2_retryCount: 0}
    });
};

WascallyRabbit.prototype.rabbitDispose = function(msg, err) {
    var level1_count = msg.properties.headers.level1_retryCount;
    var level2_count = msg.properties.headers.level2_retryCount;
    var env = this.settings.connection;
    function out_of_retries() {return (level1_count >= env.level1_retries) && (level2_count >= env.level2_retries);}

    try {
        if (err) {
            if (err.deadLetter === true || out_of_retries()) {
                console.log('Message: '+ msg.properties.messageId +' - Sent to dead letter que');
                msg.reject();
            } else {
                console.log('Message Retry #' + (level1_count + level2_count));
                this.republish_withMsgCounter(msg).then(function() {
                    console.log('Message: '+ msg.properties.messageId +' - Successful republish, msg acked');
                    msg.ack();
                }, function(err) {
                    console.log('Message: '+ msg.properties.messageId +' - Failed republish, msg nacked');
                    console.log(err);
                    msg.nack();
                });
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

WascallyRabbit.prototype.raiseErrorResponseEmailAndPersist = function(internalID, requestID, errorStatus, payload) {
    var server = this.server;
    var application = this.appServiceName;
    var message = require('./messageFactory').raiseErrorResponseEmailAndPersist(internalID, server, application, errorStatus, payload);
    console.log("setting arguments for bad request event");
    return this.publishObject('posapi.event.receivedBadApiRequest', 'posapi.event.receivedBadApiRequest', message, undefined, requestID);
};

WascallyRabbit.prototype.raiseNewDailySumEvent = function(internalID, requestID, payload) {
    var server = this.server;
    var application = this.appServiceName;
    var dailySumMessage = require('./messageFactory').raiseNewDailySumEvent(internalID, server, application, payload);
    console.log("setting arguments for Daily Sum event");
    return this.publishObject ('persistence.event.calculatedFinancialDailySummary', 'persistence.event.calculatedFinancialDailySummary', dailySumMessage, undefined, requestID);
};

WascallyRabbit.prototype.setQSubscription = function(nameOfQ) {
    var queArray = this.settings.queues.map(function(que){
        if (que.name === nameOfQ) {
            console.log("Subscribe to Q " + nameOfQ);
            que.subscribe = true;
        }
        return que
    });
    this.subscribedQ = nameOfQ;
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
    }, function(err) {
        console.log('Rejected: ' + err);
    });
};

// Used for payment endpoint -- deprecated
//WascallyRabbit.prototype.raiseNewPaymentEvent = function(internalID, payload) {
//    var server = this.server;
//    var application = this.appServiceName;
//    var paymentMessage = require('./messageFactory').raisePaymentEvent(internalID, server, application, payload);
//    console.log("setting arguments for payment event");
//    return this.publishObject('posapi.event.receivedCreatePaymentRequest', 'posapi.event.receivedCreatePaymentRequest', paymentMessage);
//};

module.exports = WascallyRabbit;



