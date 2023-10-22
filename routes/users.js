const express = require("express")
const router = express.Router()
const {userCreate, userModify} = require('../controller/users.controller')
const {ensureAuthenticated} = require('../config/security.config')

router.route('/')
    .post(userCreate)
    .put(ensureAuthenticated, userModify)

module.exports = router