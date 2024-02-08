const express = require('express')
const app = express()
require('./database')
const path = require('path')
const morgan = require('morgan')

exports.app = app
require('./config/session.config')
require('./config/passport.config')

const router = require('./routes')
const { ensureAuthenticated } = require('./config/security.config')

app.use(express.static(path.join(__dirname, 'client-build')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.use(router)

module.exports = app
