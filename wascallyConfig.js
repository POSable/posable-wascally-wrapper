var connection = {};

var settings = {

    connection: connection,

    // define the exchanges
    exchanges: [
        {
            name: 'all-commands',
            type: 'direct',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'internal.delayExchange',
            type: 'fanout',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'posapi.event.receivedCreatePaymentRequest',
            type: 'fanout',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'posapi.event.receivedCreateTransactionRequest',
            type: 'fanout',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'posapi.event.receivedCreateVoidRequest',
            type: 'fanout',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'posapi.event.receivedCreateRefundRequest',
            type: 'fanout',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'posapi.event.receivedBadApiRequest',
            type: 'fanout',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'persistence.event.calculatedFinancialDailySummary',
            type: 'fanout',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'posapi.event.receivedCreatePayloadAudit',
            type: 'fanout',
            autoDelete: false,
            persistent: true
        },
        {
            name: 'event.deadLetter',
            type: 'direct',
            autoDelete: false,
            persistent: true
        }
    ],
    // setup the queues, only subscribing to the one this service
    // will consume messages from
    queues: [
        {
            name: 'service.posapi',
            autoDelete: false,
            subscribe: false, //subscribeTo === 'posapi'
            limit: 500
        },
        {
            name: 'internal.delayQ',
            autoDelete: false,
            subscribe: false,
            limit: 500
        },
        {
            name: 'service.logging',
            autoDelete: false,
            subscribe: false, //subscribeTo === 'logging'
            limit: 500
        },
        {
            name: 'service.persistence',
            autoDelete: false,
            subscribe: false, //subscribeTo === 'persistence'
            limit: 500
        },
        {
            name: 'service.externalIntegration',
            autoDelete: false,
            subscribe: false, //subscribeTo === 'externalIntegration'
            limit: 500
        },
        {
            name: 'service.email',
            autoDelete: false,
            subscribe: false, //subscribeTo === 'email'
            limit: 500
        },
        {
            name: 'service.deadLetter',
            autoDelete: false,
            subscribe: false, //subscribeTo === 'deadLetter'
            limit: 500
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
            exchange: 'internal.delayExchange',
            target: 'internal.delayQ',
            keys: []
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
            exchange: 'posapi.event.receivedCreateVoidRequest',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreateRefundRequest',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreatePayloadAudit',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreateTransactionRequest',
            target: 'service.externalIntegration',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreateVoidRequest',
            target: 'service.externalIntegration',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreateRefundRequest',
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