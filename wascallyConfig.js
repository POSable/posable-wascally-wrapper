//var env = process.env.ENV_VARIABLE || 'development';
//console.log('Environment =', env);
var connection = {};

//var connDevelopemnt = {
//    user: 'david.xesllc@gmail.com',
//    pass: 'deavtdc021076',
//    server: ['52.89.7.38'],
//    port: 5672,
//    vhost: 'dave_dev'
//};
//var connProduction = {
//    user: 'guest',
//    pass: 'guest',
//    server: ['52.89.7.38'],
//    port: 5672,
//    vhost: '%2f'
//};
//
//if (env) connection = connProduction;
//if (env === 'development') connection = connDevelopemnt;

var settings = {

    connection: connection,

    // define the exchanges
    exchanges: [
        {
            name: 'all-commands',
            type: 'direct',
            autoDelete: false
        },
        {
            name: 'posapi.event.receivedCreatePaymentRequest',
            type: 'fanout',
            autoDelete: false
        },
        {
            name: 'posapi.event.receivedCreateTransactionRequest',
            type: 'fanout',
            autoDelete: false
        }
    ],

    // setup the queues, only subscribing to the one this service
    // will consume messages from
    queues: [
        {
            name: 'service.posapi',
            autoDelete: false,
            subscribe: false //subscribeTo === 'posapi'
        },
        {
            name: 'service.logging',
            autoDelete: false,
            subscribe: false //subscribeTo === 'logging'
        },
        {
            name: 'service.persistence',
            autoDelete: false,
            subscribe: false //subscribeTo === 'persistence'
        },
        {
            name: 'service.externalIntegration',
            autoDelete: false,
            subscribe: false //subscribeTo === 'externalIntegration'
        }
    ],

    // binds exchanges and queues to one another
    bindings: [
        {
            exchange: 'all-commands',
            target: 'service.posapi',
            keys: [ 'service.posapi' ]
        },
        {
            exchange: 'all-commands',
            target: 'service.logging',
            keys: [ 'service.logging' ]
        },
        {
            exchange: 'all-commands',
            target: 'service.persistence',
            keys: [ 'service.persistence' ]
        },
        {
            exchange: 'all-commands',
            target: 'service.externalIntegration',
            keys: [ 'service.externalIntegration' ]
        },
        {
            exchange: 'posapi.event.receivedCreatePaymentRequest',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreatePaymentRequest',
            target: 'service.externalIntegration',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreateTransactionRequest',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreateTransactionRequest',
            target: 'service.externalIntegration',
            keys: []
        }
    ]
};

module.exports = {
    settings: settings
};