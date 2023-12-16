const mongoose = require('mongoose')
const env = require('../environment/' + process.env.NODE_ENV)
const Game = require('../database/models/game.model')
const {
    gameSetMove,
    gameSetResult
} = require('../controller/modifier/game.battleProcess.js')
const { getGameById, saveUpdatedGame } = require('../queries/game.queries.js')

let minimumTime = 1000 * 60 * 5
const gameSettingsTime = [1000 * 60 * 15, 1000 * 60 * 5]

gameNextRound = async (gameId) => {
    try {
        let game = await getGameById(gameId)
        if (game.state.value == 'move') {
            console.log('result')
            game.state.value = 'result'
            game.state.nextState = Date.now() + gameSettingsTime[0]
            game = await gameSetResult(game)
        } else {
            console.log('move')
            game.state.value = 'move'
            game.state.season = !game.state.season
            game.state.nextState = Date.now() + gameSettingsTime[1]
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
        console.log(
            Math.floor(
                (Date.parse(game.state.nextState) - Date.now()) / (1000 * 60)
            ) +
                ':' +
                Math.floor(
                    ((Date.parse(game.state.nextState) - Date.now()) %
                        (1000 * 60)) /
                        1000
                )
        )
        if (
            Date.parse(game.state.nextState) - Date.now() > 0 &&
            Date.parse(game.state.nextState) - Date.now() <= deadLine
        ) {
            console.log("it's now !")
            deadLine = Date.parse(game.state.nextState) - Date.now()
            gameId = game._id
        } else if (Date.parse(game.state.nextState) - Date.now() <= 0) {
            deadLine = 0
            gameId = game._id
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
        console.log('schedule connected to db !')
        waitUntilDeadline()
    })
    .catch((e) => console.log(e))
