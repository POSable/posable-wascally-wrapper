describe("Test 'wascallyWrapper' module & 'WascallyRabbit' Class Methods", function() {
    var WascallyRabbit = require('../../wascallyWrapper');
    var wascallyRabbit = new WascallyRabbit;

    describe("Check addLogEntry method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = {};
        wascallyRabbit.wascally.publish = function() {};
        var logLevel = "info";
        var message = "This is a test of the emergency broadcast system, Beeeeeep.";
        var stack = "Here an error there an error, everywhere an error error.";

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.addLogEntry(logLevel, message, stack);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

    describe("Check raiseNewTransactionEvent method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = {};
        wascallyRabbit.wascally.publish = function() {};
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.raiseNewTransactionEvent(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

    describe("Check rabbitDispose", function (){
        var testMsg;
        beforeEach(function() {
            testMsg = { reject: function () {},
                        ack: function () {},
                        fields: {exhange: 'test'},
                        properties: {headers: {retryCount: 1}}};

            spyOn(testMsg, 'reject');
            spyOn(testMsg, 'ack');
        });

        it("should reject dead letter messages", function (){
            var err = {deadLetter: true};
            wascallyRabbit.rabbitDispose(testMsg, err);
            expect(testMsg.reject).toHaveBeenCalled();
        });

        it("should ack successful messages", function () {
            wascallyRabbit.rabbitDispose(testMsg);
            expect(testMsg.ack).toHaveBeenCalled();
        });

    });

    describe("Check republishWithMsgCounter", function () {
        var testMsg = {fields: {exchange: 'test'},
            properties: {headers: {retryCount: 1}}};
        wascallyRabbit.wascally.publish = function() {};

        beforeEach(function(){
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("should call wascally publish method", function () {
            wascallyRabbit.republishWithMsgCounter(testMsg);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

});