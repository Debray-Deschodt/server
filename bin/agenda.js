const mongoose = require('mongoose')
const env = require('../environment/' + process.env.NODE_ENV)
const Game = require('../database/models/game.model')
const {
    gameSetMove,
    gameSetResult
} = require('../controller/modifier/game.battleProcess.js')
const { getGameById, saveUpdatedGame } = require('../queries/game.queries.js')

let minimumTime = 1000 * 10

gameNextRound = async (gameId) => {
    try {
        let game = await getGameById(gameId)
        if (game.state.value == 'move') {
            game.state.value = 'result'
            game.state.nextState =
                Date.now() + game.setting.interRoundDuration * 1000
            game = await gameSetResult(game)
        } else {
            game.state.value = 'move'
            game.state.season = !game.state.season
            game.state.nextState =
                Date.now() + game.setting.roundDuration * 1000
            if (game.state.season) game.state.year++
            game = await gameSetMove(game)
        }
        await saveUpdatedGame(gameId, game)
    } catch (e) {
        throw e
    }
}

async function getDeadLine() {
    let deadLine = minimumTime
    let gameId = 0
    const games = await Game.find({})
    for (const game of games) {
        if (game.state.active) {
            if (
                Date.parse(game.state.nextState) - Date.now() > 0 &&
                Date.parse(game.state.nextState) - Date.now() <= deadLine
            ) {
                deadLine = Date.parse(game.state.nextState) - Date.now()
                gameId = game._id
            } else if (Date.parse(game.state.nextState) - Date.now() <= 0) {
                deadLine = 0
                gameId = game._id
            }
        }
    }
    return { deadLine: deadLine, gameId: gameId }
}

async function waitUntilDeadline() {
    const { deadLine, gameId } = await getDeadLine()
    setTimeout(async () => {
        if (gameId != 0) await gameNextRound(gameId)
        waitUntilDeadline()
    }, deadLine)
}

mongoose
    .connect(env.dbUrl)
    .then(() => {
        waitUntilDeadline()
    })
    .catch((e) => console.error(e))
