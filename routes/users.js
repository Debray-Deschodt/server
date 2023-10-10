const express = require("express")
const router = express.Router()
const {userCreate} = require('../controller/users.controller')


router.route('/')
    .post(userCreate)

module.exports = router