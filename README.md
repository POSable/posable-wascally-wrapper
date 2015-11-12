cd into the top directory folder of your service. 

Use npm install git+ssh://git@github.com:POSable/posable-wascally-wrapper.git from command line.

You may need install wascally, npm install wascally.

##
Below is an example of how to use this Plugin.


console.log('Create Connection to Rabbit Server');
var wascallyRabbit = require('posable-wascally-wrapper')
var env = require('../lib/pos_modules/common').config(); //plugin ???
var func = function(msg) {console.log(msg)};
var messageType = 'posapi.event.receivedCreatePaymentRequest';  // how to name types 

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.externalIntegration');
wascallyRabbit.setHandler(messageType, func);
wascallyRabbit.setup();
