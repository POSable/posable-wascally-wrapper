describe("Test 'wascallyWrapper' module & 'WascallyRabbit' Class Methods", function() {
    var WascallyRabbit = require('../../wascallyWrapper');

      describe("Check addLogEntry method on a new instance of WascallyRabbit", function (){
        var wascallyRabbit = new WascallyRabbit({publish: function(){}},{settings: {}});
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
        var wascallyRabbit = new WascallyRabbit({publish: function(){}},{settings: {}});
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.raiseNewTransactionEvent(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });

    describe("Check raiseNewPaymentEvent method on a new instance of WascallyRabbit", function (){
        var wascallyRabbit = new WascallyRabbit({publish: function(){}},{settings: {}});
        var payload = {};

        beforeEach(function() {
            spyOn(wascallyRabbit.wascally, 'publish');
        });

        it("Should call publish on an instance of wascally", function () {
            wascallyRabbit.raiseNewPaymentEvent(payload);
            expect(wascallyRabbit.wascally.publish).toHaveBeenCalled();
        });
    });
});