describe("Test 'index' creates a DI container for 'posable-wascally-wrapper'", function() {
    it("Should call publish on an instance of wascally", function () {
       var wr = require('../../index');
        console.log(wr);
    });
});