const express = require("express")
const router = express.Router()
const {ensureAuthenticated} = require('../config/security.config')
const {adminRendering} = require('../controller/admin.controller')

router.route('/')
    .get(adminRendering)

module.exports = router