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
        internalID: arguments[0],
        server: arguments[1],
        application: arguments[2],
        data: arguments[3]
    }
};

var raisePaymentEvent = function() {
    return {
        internalID: arguments[0],
        server: arguments[1],
        application: arguments[2],
        data: arguments[3]
    }
};

var raiseErrorResponseEmailAndPersist = function() {
    return {
        internalID: arguments[0],
        server: arguments[1],
        application: arguments[2],
        error: arguments[3],
        data: arguments[4]
    }
};

var raiseNewDailySumEvent = function() {
    return {
        internalID: arguments[0],
        server: arguments[1],
        application: arguments[2],
        data: arguments[3]
    }
};

var calculateBatchTotals = function() {
    return {
        internalID: arguments[0],
        server: arguments[1],
        application: arguments[2],
        data: arguments[3]
    }
};

module.exports = {
    newLogMessage: newLogMessageObject,
    raisePaymentEvent: raisePaymentEvent,
    raiseTransactionEvent: raiseTransactionEvent,
    raiseErrorResponseEmailAndPersist: raiseErrorResponseEmailAndPersist,
    raiseNewDailySumEvent: raiseNewDailySumEvent,
    calculateBatchTotals: calculateBatchTotals
};