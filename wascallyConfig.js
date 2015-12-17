var connection = {};

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
        },
        {
            name: 'posapi.event.receivedBadApiRequest',
            type: 'fanout',
            autoDelete: false
        },
        {
            name: 'persistence.event.calculatedFinancialDailySummary',
            type: 'fanout',
            autoDelete: false
        },
        {
            name: 'event.deadLetter',
            type: 'direct',
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
        },
        {
            name: 'service.email',
            autoDelete: false,
            subscribe: false //subscribeTo === 'email'
            //arguments: {'x-dead-letter-exchange': 'event.deadLetter'}
        },
        {
            name: 'service.deadLetter',
            autoDelete: false,
            subscribe: false //subscribeTo === 'deadLetter'

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
        },
        {
            exchange: 'posapi.event.receivedBadApiRequest',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedBadApiRequest',
            target: 'service.email',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedBadApiRequest',
            target: 'service.logging',
            keys: []
        },
        {
            exchange: 'persistence.event.calculatedFinancialDailySummary',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'persistence.event.calculatedFinancialDailySummary',
            target: 'service.externalIntegration',
            keys: []
        },
        {
            exchange: 'event.deadLetter',
            target: 'service.deadLetter',
            keys: [ 'service.deadLetter' ]
        }
    ]
};

module.exports = {
    settings: settings
};