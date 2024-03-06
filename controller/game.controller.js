const {
    createGame,
    getGames,
    pushGamePlayers,
    getGameByIdAndDelete,
    getMsgByGameIdAndDelete,
    getGameById,
    createMove,
    getResultGame,
    createFlee,
    getFlee,
    createTroops,
    nextRoundGame,
    setActiveGame,
    saveUpdatedGame,
    updateGameSettings,
    UserReadyGame,
    addMultipleCities
} = require('../queries/game.queries.js')
const { findSessionPerId } = require('../queries/session.queries')
const {
    findUserPerId,
    postHistory,
    getHistory,
    postUserGame
} = require('../queries/user.queries')
const {
    onlyOwnPawn,
    onlyAdjoining,
    onlyAdjoiningSupport,
    onlyAdjoiningConvey,
    onlySeaForFleet,
    onlyFreePlaces,
    onlyInMoveStatus,
    onlyNewTroopInCities,
    onlyOwnCities,
    onlyFreeCities,
    onlyLessPawnThanOwnedCities,
    onlyLandForTroops,
    onlyAttackCanMove,
    onlyConvoyForFleet,
    onlyTroopSupportInLand,
    onlyInAutumnResult
} = require('./modifier/game.modifier.js')
const {
    gameSetMove,
    gameSetResult
} = require('./modifier/game.battleProcess.js')
const { places } = require('../data/mapweb.js')
const { msgSetPrivacyAll } = require('../controller/message.controller.js')
const { startPositions } = require('../data/gameStartPositions.js')

/**
 * create a new game and push the first player
 * @res game
 */
exports.gameCreate = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const game = await createGame(username)
        await postUserGame(user._id, game._id)
        res.json(game)
    } catch (e) {
        throw e
    }
}

/**
 * return all the games.
 * @res games
 */
exports.gamesGet = async (req, res, next) => {
    try {
        const games = await getGames()
        res.json(games)
    } catch (e) {
        throw e
    }
}

/**
 * Add a new player and return the game.
 * If the player is already in the game, it's a getter for the game.
 * If the player isn't in the game and it's full, return false.
 * If the password is wrong return false.
 * @params  gameId: string
 * @res game | false
 */
exports.gameJoin = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const game = await pushGamePlayers(req.params.gameId, username)
        await postUserGame(user._id, req.params.gameId)
        res.json(game)
    } catch (e) {
        throw e
    }
}

/**
 * Update the settings.
 * @req gameId: string
 * @req settings: Settings
 * @res status(200)
 */
exports.gameUpdate = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const passwordUnique = await updateGameSettings(
            req.body.gameId,
            req.body.settings,
            username
        )
        res.json(passwordUnique)
    } catch (e) {
        throw e
    }
}

/**
 * Delete a game if the password is correct.
 * Return the game deleted or false if the pssword is wrong
 * @params gameId: string
 * @req password: string
 * @res game
 */
exports.gameDelete = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const game = await getGameByIdAndDelete(
            req.params.gameId,
            req.body.password,
            username
        )
        await getMsgByGameIdAndDelete(
            req.params.gameId,
            req.body.password,
            username
        )
        res.json(game)
    } catch (e) {
        throw e
    }
}

/**
 * Set a new move as attack, support or convey from a position to an other
 * @params gameId: string
 * @req from: number, to: number, for: number
 * @res status(200)
 */
exports.moveCreate = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const move = {
            by: username,
            from: req.body.from,
            to: req.body.to,
            for: req.body.for
        }
        let game = await getGameById(req.params.gameId)
        if (
            onlyOwnPawn(game, move) &&
            onlyAdjoiningSupport(move) &&
            onlyAdjoiningConvey(move) &&
            onlySeaForFleet(game, move) &&
            onlyLandForTroops(game, move) &&
            onlyAttackCanMove(move) &&
            onlyTroopSupportInLand(game, move) &&
            onlyConvoyForFleet(game, move)
        ) {
            game = await createMove(
                req.params.gameId,
                username,
                req.body.from,
                req.body.to,
                req.body.for
            )
            console.log({
                by: username,
                from: req.body.from,
                to: req.body.to,
                for: req.body.for
            })
            res.status(200).end()
        } else {
            if (!onlyOwnPawn(game, move)) res.status(301).end()
            if (!onlyAdjoiningSupport(move)) res.status(302).end()
            if (!onlyAdjoiningConvey(move)) res.status(303).end()
            if (!onlySeaForFleet(game, move)) res.status(304).end()
            if (!onlyLandForTroops(game, move)) res.status(305).end()
            if (!onlyAttackCanMove(move)) res.status(306).end()
            if (!onlyTroopSupportInLand(game, move)) res.status(307).end()
            if (!onlyConvoyForFleet(game, move)) res.status(308).end()
        }
    } catch (e) {
        throw e
    }
}

//SECURITY the round have to be finished first or the others could see your moves
/**
 * Get the newspaper
 * @params gameId: string
 * @res result
 */
exports.gameGetResult = async (req, res, next) => {
    try {
        const gameResult = await getResultGame(req.params.gameId)
        res.json(gameResult)
    } catch (e) {
        throw e
    }
}

/**
 * Set a new flee
 * @params gameId: string
 * @req from: number, to: number
 * @res status(200)
 */
exports.fleeCreate = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const game = await getGameById(req.params.gameId)
        const move = {
            by: username,
            from: req.body.from,
            to: req.body.to,
            for: 0
        }
        if (onlyFreePlaces(game, move)) {
            await createFlee(
                req.params.gameId,
                username,
                req.body.from,
                req.body.to
            )
            res.status(200).end()
        } else {
            if (!onlyFreePlaces(game, move)) res.status(301).end()
        }
    } catch (e) {
        throw e
    }
}

/**
 * get the flee moves at the end of the round
 * @params gameId: string
 * @res flee
 */
exports.fleeGet = async (req, res, next) => {
    try {
        const flee = await getFlee(req.params.gameId)
        res.json(flee)
    } catch (e) {
        throw e
    }
}

/**
 * Set a new troop
 * @params gameId: string, where: number
 * @res player informations
 */
exports.troopsCreate = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const game = await getGameById(req.params.gameId)
        if (
            onlyNewTroopInCities(req.params.where) &&
            onlyLessPawnThanOwnedCities(game, username) &&
            onlyOwnCities(game, username, req.params.where) &&
            onlyInAutumnResult(game) &&
            onlyFreeCities(game, username, req.params.where)
        ) {
            const player = await createTroops(
                req.params.gameId,
                username,
                req.params.where
            )
            res.json(player)
        } else {
            if (!onlyNewTroopInCities(req.params.where)) res.status(301).end()
            if (!onlyLessPawnThanOwnedCities(game, username))
                res.status(302).end()
            if (!onlyOwnCities(game, username, req.params.where))
                res.status(303).end()
            if (!onlyInAutumnResult(game)) res.status(304).end()
            if (!onlyFreeCities(game, username, req.params.where))
                res.status(305).end()
        }
    } catch (e) {
        throw e
    }
}

/**
 * delete a troop
 * @params gameId: string, where: number
 * @res player informations
 */
exports.troopsDelete = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const player = await createTroops(
            req.params.gameId,
            username,
            req.body.where
        )
        res.json(player)
    } catch (e) {
        throw e
    }
}

/**
 * set the next round as 'result', process the result, flee, canceled and players,
 * then set the new cities depending of the season.
 *
 * or set the next round as 'move' and init the moves as only wait, depending of
 * the current game state.
 * @params gameId: string
 * @res status(200)
 */
exports.gameNextRound = async (req, res, next) => {
    try {
        let game = await getGameById(req.params.gameId)
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
        await saveUpdatedGame(req.params.gameId, game)
        await msgSetPrivacyAll(req.params.gameId)
        res.status(200).end()
    } catch (e) {
        throw e
    }
}

/**
 * play/stop the game based on its current value
 * @params gameId: string
 * @res status(200)
 */
exports.gameSetActive = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        await setActiveGame(req.params.gameId, username)
        res.status(200).end()
    } catch (e) {
        throw e
    }
}

/**
 * update the research history of a User in a game
 * @params gameId: string
 * @req research: string, count: number
 * @res status(200)
 */
exports.historyPost = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        await postHistory(
            req.params.gameId,
            JSON.parse(session.session).passport.user,
            req.body.research,
            req.body.count
        )
        res.status(200).end()
    } catch (e) {
        throw e
    }
}

/**
 * return the user's reseach history in a game
 * @params gameId: string
 * @res status(200)
 */
exports.historyGet = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const researchHistory = await getHistory(
            req.params.gameId,
            JSON.parse(session.session).passport.user
        )
        res.json(researchHistory)
    } catch (e) {
        throw e
    }
}

/**
 * switch user's ready state in the game.
 * @params gameId : string
 * @req ready: boolean
 */
exports.gameUserReady = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const game = await UserReadyGame(
            req.params.gameId,
            username,
            req.body.ready
        )

        if (
            game.players.filter((player) => player.ready).length ==
            game.setting.nbrPlayer
        ) {
            await setActiveGame(req.params.gameId, username)
            //start game
            let startPosition = startPositions[game.players.length - 2]
            for (const i_player in game.players) {
                const randPos = Math.floor(
                    (game.players.length - i_player) * Math.random()
                )
                await addMultipleCities(
                    req.params.gameId,
                    game.players[i_player].username,
                    startPosition[randPos]
                )
                startPosition = startPosition.filter(
                    (posSet) => posSet != startPosition[randPos]
                )
            }
        }
        res.status(200).end()
    } catch (e) {
        throw e
    }
}
