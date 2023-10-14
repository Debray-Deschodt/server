const express = require("express")
const router = express.Router()
const {sessionNew, sessionCreate, sessionDelete} = require('../controller/auth.controller')
const {ensureAuthenticated} = require('../config/security.config')

router.route('/')
    .get(ensureAuthenticated,sessionNew)
    .post(sessionCreate)
    .delete(ensureAuthenticated, sessionDelete)

module.exports = router