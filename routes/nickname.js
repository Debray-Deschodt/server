const express = require("express")
const router = express.Router()
const {animalCreate, animalDelete} = require('../controller/nickname/animal.controller.js')
const {adjectiveCreate, adjectiveDelete} = require('../controller/nickname/adjective.controller.js')
const {nicknameGet} = require('../controller/nickname/nickname.controller.js')
const {ensureAuthenticated, ensureAdmin} = require('../config/security.config')

router.route('/')
    .get(nicknameGet)

router.route('/animal')
    .post(ensureAuthenticated, ensureAdmin, animalCreate)
    .put(ensureAuthenticated, ensureAdmin, animalDelete)

router.route('/adjective')
    .post(ensureAuthenticated, ensureAdmin, adjectiveCreate)
    .put(ensureAuthenticated, ensureAdmin, adjectiveDelete)

module.exports = router