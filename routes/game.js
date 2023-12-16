const express = require('express')
const router = express.Router()
const {
    gamesGet,
    gameCreate,
    gameJoin,
    gameModifier,
    gameDelete,
    moveCreate,
    gameGetResult,
    fleeCreate,
    fleeGet,
    troopsCreate,
    troopsDelete,
    gameNextRound,
    gameSetActive
} = require('../controller/game.controller')
const {
    msgGet,
    msgGetMine,
    msgCreate,
    msgSetPrivacy
} = require('../controller/message.controller')

router.route('/:gameId/nextRound').put(gameNextRound)

router.route('/:gameId/msg/paperbin').get(msgGet)
router.route('/:gameId/msg').get(msgGetMine).post(msgCreate).put(msgSetPrivacy)
router.route('/:gameId/move').post(moveCreate)
router.route('/:gameId/newspaper').get(gameGetResult)
router.route('/:gameId/flee').post(fleeCreate).get(fleeGet)
router.route('/:gameId/troop/:where').post(troopsCreate).delete(troopsDelete)
router.route('/:gameId/active').put(gameSetActive)
router.route('/:gameId/join').put(gameJoin)
router
    .route('/')
    .get(gamesGet)
    .post(gameCreate)
    .put(gameModifier)
    .delete(gameDelete)

module.exports = router
