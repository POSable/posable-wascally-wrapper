var WascallyRabbit = function() {
    this.wascally = require('wascally');
    this.settings = require('./wascallyConfig').settings;
    this.appServiceName = "";
    this.server = require('os').hostname();
};

WascallyRabbit.prototype.publishObject = function(exchange, type, payload, key) {
    console.log("in publish");
    return this.wascally.publish(exchange, type, payload, key);
};

WascallyRabbit.prototype.addLogEntry = function(logLevel, message, stack) {
    var server = this.server;
    var application = this.appServiceName;
    var logEntryMessage = require('./messageFactory').newLogMessage(server, application, logLevel, message, stack);
    console.log("setting arguments for logging entry");
    return this.publishObject ('all-commands', 'logger.command.addLogEntry', logEntryMessage, 'service.logging');
};

WascallyRabbit.prototype.raiseNewTransactionEvent = function(payload) {
    var server = this.server;
    var application = this.appServiceName;
    var transactionMessage = require('./messageFactory').raiseTransactionEvent(server, application, payload);
    console.log("setting arguments for transaction event");
    return this.publishObject ('posapi.event.receivedCreateTransactionRequest', 'posapi.event.receivedCreateTransactionRequest', transactionMessage);
};

WascallyRabbit.prototype.raiseNewPaymentEvent = function(payload) {
    var server = this.server;
    var application = this.appServiceName;
    var paymentMessage = require('./messageFactory').raisePaymentEvent(server, application, payload);
    console.log("setting arguments for payment event");
    return this.publishObject('posapi.event.receivedCreatePaymentRequest', 'posapi.event.receivedCreatePaymentRequest', paymentMessage);
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
};

WascallyRabbit.prototype.setup = function(name) {
    this.appServiceName = name;
    this.wascally.configure(this.settings).done(function () {
        console.log("Successful connection to RabbitMQ server")
    });
};

module.exports = WascallyRabbit;
