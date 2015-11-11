var WascallyRabbit = function() {
    this.wascally = require('wascally');
    this.settings = require('./wascallyConfig').settings;
};

WascallyRabbit.prototype.publishObject = function(exchange, type, payload, key) {
    console.log("in publish");
    this.wascally.publish(exchange, type, payload, key);
};

WascallyRabbit.prototype.addLogEntry = function(payload) {
    console.log("setting arguments for logging entry");
    this.publishObject ('all-commands', 'logger.command.addLogEntry', payload, 'service.logging');
};

WascallyRabbit.prototype.raiseNewTransactionEvent = function(payload) {
    console.log("setting arguments for transaction event");
    this.publishObject ('posapi.event.receivedCreateTransactionRequest', 'posapi.event.receivedCreateTransactionRequest', payload);
};

WascallyRabbit.prototype.raiseNewPaymentEvent = function(payload) {
    console.log("setting arguments for payment event");
    this.publishObject('posapi.event.receivedCreatePaymentRequest', 'posapi.event.receivedCreatePaymentRequest', payload);
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

WascallyRabbit.prototype.setup = function() {
    this.wascally.configure(this.settings).done(function () {
        console.log("Successful connection to RabbitMQ server")
    });
};

module.exports = WascallyRabbit;
