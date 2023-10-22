const express = require("express")
const router = express.Router()
const {ensureAuthenticated} = require('../config/security.config')
const {bugCreate} = require('../controller/bug.controller.js')

router.route('/')
    .post(bugCreate)

module.exports = router