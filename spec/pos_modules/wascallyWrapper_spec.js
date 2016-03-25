describe("Test 'wascallyWrapper' module & 'WascallyRabbit' Class Methods", function() {
    var WascallyRabbit = require('../../wascallyWrapper');
    var wascallyRabbit = new WascallyRabbit;
    var saveStateWascally = wascallyRabbit.wascally;

    describe("Check a new instance of the Class is provided when WascallyRabbit is called", function (){

        beforeEach(function() {
            firstWascallyRabbit = new WascallyRabbit;
            secondWascallyRabbit = new WascallyRabbit;
        });

        it("Should check two instances are not the same", function () {
            expect(firstWascallyRabbit !== secondWascallyRabbit).toBe(true);
        });
    });

    describe("Check republish_withMsgCounter method", function (){
        var msg;
        var testPublish;
        beforeEach(function() {
            testPublish = function (arg1, arg2) {return {arg1: arg1, arg2: arg2}};
            wascallyRabbit.wascally.publish = testPublish;
            spyOn(wascallyRabbit.wascally, 'publish').and.callThrough();
        });

        it("call publish with 'all-commands' when lvl1 retries have NOT exceeded the max set in settings and increments lvl1", function () {
            msg = {properties: {headers: {level1_retryCount: 10, level2_retryCount: 11}}};
            wascallyRabbit.settings.connection = {level1_retries: 20, level2_retries: 15};
            var testReturn = wascallyRabbit.republish_withMsgCounter(msg);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
            expect(testReturn.arg1).toBe('all-commands');
            expect(testReturn.arg2.headers.level1_retryCount).toBe(11);
        });

        it("call publish with 'internal.delayExchange' when lvl1 retries have exceeded the max set in settings and increments lvl2", function () {
            msg = {properties: {headers: {level1_retryCount: 10, level2_retryCount: 11}}};
            wascallyRabbit.settings.connection = {level1_retries: 9, level2_retries: 15};
            var testReturn = wascallyRabbit.republish_withMsgCounter(msg);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
            expect(testReturn.arg1).toBe('internal.delayExchange');
            expect(testReturn.arg2.headers.level2_retryCount).toBe(12);
        });
        it("throws an error when lvl1 and 2 retires exceed connection setttings - which could be caught by the calling code and dead lettered.", function () {
            msg = {properties: {headers: {level1_retryCount: 10, level2_retryCount: 10}}};
            wascallyRabbit.settings.connection = {level1_retries: 9, level2_retries: 9};
           try {
               wascallyRabbit.republish_withMsgCounter(msg);
           } catch (err) {
               expect(err.message).toBe('Message: undefined - Error republishing')
           }
        });
    });

    describe("Check publishObject method on a new instance of WascallyRabbit", function (){
        var testPublish;
        beforeEach(function() {
            testPublish = function (arg1, arg2) {return {arg1: arg1, arg2: arg2}};
            wascallyRabbit.wascally.publish = testPublish;
            spyOn(wascallyRabbit.wascally, 'publish').and.callThrough();
        });


        it("Should call publish and set retry headers to 0", function () {
            var testReturn = wascallyRabbit.publishObject('testExchange', 'testType', {}, 'testKey', 1);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
            expect(testReturn.arg2.headers.level2_retryCount).toBe(0);
            expect(testReturn.arg2.headers.level2_retryCount).toBe(0);
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

    describe("Check addLogEntry method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = saveStateWascally;
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

    describe("Check raiseNewVoidEvent method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = {};
        wascallyRabbit.wascally.publish = function() {};
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.raiseNewVoidEvent(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

    describe("Check raiseNewRefundEvent method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = {};
        wascallyRabbit.wascally.publish = function() {};
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.raiseNewRefundEvent(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

    describe("Check raiseNewPayloadAuditEvent method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = {};
        wascallyRabbit.wascally.publish = function() {};
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.raiseNewPayloadAuditEvent(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

    describe("Check raiseErrorResponseEmailAndPersist method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = {};
        wascallyRabbit.wascally.publish = function() {};
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.raiseErrorResponseEmailAndPersist(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

    describe("Check raiseNewDailySumEvent method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = {};
        wascallyRabbit.wascally.publish = function() {};
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.raiseNewDailySumEvent(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

    describe("Check calculateBatchTotals method on a new instance of WascallyRabbit", function (){
        wascallyRabbit.wascally = {};
        wascallyRabbit.wascally.publish = function() {};
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.calculateBatchTotals(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });
});