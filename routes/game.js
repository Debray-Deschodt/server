const express = require("express")
const router = express.Router()
const {gameGet, gameCreate, gameJoin, gameModifier, gameDelete} = require('../controller/game.controller.js')

router.route('/join')
    .put(gameJoin)

router.route('/')
    .get(gameGet)
    .post(gameCreate)
    .put(gameModifier)
    .delete(gameDelete)

module.exports = router
