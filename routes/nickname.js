const express = require("express")
const router = express.Router()
const {animalCreate, animalDelete} = require('../controller/nickname/animal.controller.js')
const {adjectiveCreate, adjectiveDelete} = require('../controller/nickname/adjective.controller.js')
const {nicknameGet} = require('../controller/nickname/nickname.controller.js')

router.route('/')
    .get(nicknameGet)

router.route('/animal')
    .post(animalCreate)
    .put(animalDelete)

router.route('/adjective')
    .post(adjectiveCreate)
    .put(adjectiveDelete)

module.exports = router