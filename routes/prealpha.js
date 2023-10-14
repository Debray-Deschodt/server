const express = require("express")
const router = express.Router()
const {formGet, formCreate, formModify} = require('../controller/prealpha.controller')

router.route('/')
    .get(formGet)
    .post(formCreate)
    .put(formModify)

module.exports = router