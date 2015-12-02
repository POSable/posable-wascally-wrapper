var newLogMessageObject = function() {
    return {
        server: arguments[0],
        application: arguments[1],
        logLevel: arguments[2],
        message: arguments[3],
        stack: arguments[4]
    }
};

var raiseTransactionEvent = function() {
    return {
        server: arguments[0],
        application: arguments[1],
        data: arguments[2]
    }
};

var raisePaymentEvent = function() {
    return {
        server: arguments[0],
        application: arguments[1],
        data: arguments[2]
    }
};

var raiseErrorResponseEmailAndPersist = function() {
    return {
        server: arguments[0],
        application: arguments[1],
        data: arguments[2]
    }
};

module.exports = {
    newLogMessage: newLogMessageObject,
    raisePaymentEvent: raisePaymentEvent,
    raiseTransactionEvent: raiseTransactionEvent,
    raiseErrorResponseEmailAndPersist: raiseErrorResponseEmailAndPersist
};