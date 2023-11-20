const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const logger = require('./helpers/logger')
//const limitRequest = require('./middlewares/limitRequest')

const server = require('http').Server(app)

app.use(compression())
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//app.use(limitRequest({}))

morgan.token('remote-addr', function (req, res) {
    const ffHeaderValue = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',')[0] : ''
    return ffHeaderValue || req.connection.remoteAddress
})
app.use(morgan('short'))
// api
app.use(require('./api'))

// start server
server.listen(config.get(config.network).port, '0.0.0.0', function () {
    const host = server.address().address
    const port = server.address().port
    logger.info('Server start at http://%s:%s', host, port)
})

module.exports = app
