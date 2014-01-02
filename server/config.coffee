americano = require 'americano'

module.exports =

    common:
        set:
            'view engine': 'jade'
            views: './server/views'
        use: [
            americano.static __dirname + '/../client/public', maxAge: 86400000
            americano.bodyParser keepExtensions: true
            americano.logger 'dev'
            americano.errorHandler
                dumpExceptions: true
                showStack: true
        ]
    development: [
        americano.logger 'dev'
    ]

    production: [
        americano.logger 'short'
    ]

    plugins: [
        'americano-cozy'
    ]
