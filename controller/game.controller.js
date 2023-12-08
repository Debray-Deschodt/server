const {
    createGame,
    getGames,
    pushGamePlayers,
    getGameByIdAndDelete,
    getGameById,
    createMove,
    getResultGame,
    createFlee,
    getFlee,
    createTroops,
    nextRoundGame,
    setActiveGame
} = require('../queries/game.queries.js')

//TODO password can't be in clear
//TODO username should be known with cookies
/**
 * create a new game and push the first player
 * @req title: string, description: string, password: string, username: string
 * @res game
 */
exports.gameCreate = async (req, res, next) => {
    try {
        const game = await createGame(
            req.body.title,
            req.body.description,
            req.body.password,
            req.body.username
        )
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

//TODO the password can't be in clear
//TODO verify the username match the cookies
/**
 * Add a new player and return the game.
 * If the player is already in the game, it's a getter for the game.
 * If the player isn't in the game and it's full, return false.
 * If the password is wrong return false.
 * @params  gameId: string
 * @req username: string, password: string
 * @res game | false
 */
exports.gameJoin = async (req, res, next) => {
    try {
        const game = await pushGamePlayers(
            req.params.gameId,
            req.body.password,
            req.body.username
        )
        res.json(game)
    } catch (e) {
        throw e
    }
}

//TODO need modifier
exports.gameModifier = async (req, res, next) => {
    try {
        res.status(401).end()
    } catch (e) {
        throw e
    }
}

//TODO delete the msg associated to the game
//TODO protect it
/**
 * Delete a game if the password is correct.
 * Return the game deleted or false if the pssword is wrong
 * @params gameId: string
 * @req password: string
 * @res game
 */
exports.gameDelete = async (req, res, next) => {
    try {
        const game = await getGameByIdAndDelete(
            req.params.gameId,
            req.body.password
        )
        res.json(game)
    } catch (e) {
        throw e
    }
}

//TODO only one time per from
//TODO only from match username
/**
 * Set a new move as attack, support or convey from a position to an other
 * @params gameId: string
 * @req username: string, from: number, to: number, for: number
 * @res status(200)
 */
exports.moveCreate = async (req, res, next) => {
    try {
        const game = await createMove(
            req.params.gameId,
            req.body.username,
            req.body.from,
            req.body.to,
            req.body.for
        )
        res.status(200).end()
    } catch (e) {
        throw e
    }
}

//TODO the round have to be finished first or the others could see your moves
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

//TODO only fleeing paws
//TODO only to = freeZone
//TODO username
/**
 * Set a new flee
 * @params gameId: string
 * @req by: string, from: number, to: number
 * @res status(200)
 */
exports.fleeCreate = async (req, res, next) => {
    try {
        await createFlee(
            req.params.gameId,
            req.body.by,
            req.body.from,
            req.body.to
        )
        res.status(200).end()
    } catch (e) {
        throw e
    }
}

//TODO only if everyone fled
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

//TODO where have to be a city
//TODO cities.length = paws.length
//TODO username
/**
 * Set a new troop
 * @params gameId: string
 * @req username:string, where: number
 * @res player informations
 */
exports.TroopsCreate = async (req, res, next) => {
    try {
        const player = await createTroops(
            req.params.gameId,
            req.body.username,
            req.body.where
        )
        res.json(player)
    } catch (e) {
        throw e
    }
}

//TODO !IMPORTANT
const gameSetResult = async (move) => {
    try {
        return move
    } catch (e) {
        throw e
    }
}

/**
 * A dev middleware
 * @params gameId: string
 * @res status(200)
 */
exports.gameNextRound = async (req, res, next) => {
    try {
        const state = await nextRoundGame(req.params.gameId)
        // const game = await getGameById(req.params.gameId)
        // if (game.state.value == 'result') {
        //     const result = await gameSetResult(game.move)
        //     res.json(result)
        // }
        res.status(200).end()
    } catch (e) {
        throw e
    }
}

/**
 * play/stop the game based on its current value
 * @params gameId: string
 * @req username : string
 * @res status(200)
 */
exports.gameSetActive = async (req, res, next) => {
    try {
        await setActiveGame(req.params.gameId, req.body.username)
        res.status(200).end()
    } catch (e) {
        throw e
    }
}
