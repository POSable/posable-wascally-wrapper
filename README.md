Use npm install git+ssh(or https)://[the git repo]

##
Below is an example of how to use this Plugin.


console.log('Create Connection to Rabbit Server');
var wascallyRabbit = require('wascallyRabbit')
var env = require('../lib/pos_modules/common').config(); //plugin ???
var func = function(msg) {console.log(msg)};
var messageType = 'posapi.event.receivedCreatePaymentRequest';  // how to name types 

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.externalIntegration');
wascallyRabbit.setHandler(messageType, func);
wascallyRabbit.setup();
