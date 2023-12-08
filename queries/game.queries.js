const Game = require('../database/models/game.model')

/**
 * create a new game and add the first player
 * @param {string} title
 * @param {string} description
 * @param {string} password
 * @param {string} username
 * @returns the new game
 */
exports.createGame = (title, description, password, username) => {
    try {
        const game = new Game({
            title: title,
            description: description,
            password: password,
            _players: [username],
            players: [
                {
                    username: username,
                    ready: false,
                    troops: [],
                    fleet: [],
                    cities: [],
                    message: []
                }
            ]
        })
        return game.save()
    } catch (e) {
        throw e
    }
}

/**
 *
 * @returns all the game
 */
exports.getGames = async () => {
    return Game.find({})
}

/**
 * add a new player to a game
 * @param {string} gameId
 * @param {string} password
 * @param {string} username
 * @returns the game with the new player array or FALSE if the game is already full and the player new or in case of wrong password.
 */
exports.pushGamePlayers = async (gameId, password, username) => {
    try {
        let game = await Game.findOne({ _id: gameId, password: password })
        if (game._players.length >= 7 || !game) {
            return false
        } else {
            if (!game._players.includes(username)) {
                game._players.push(username)
                game.players.push({
                    username: username,
                    ready: false,
                    troops: [],
                    fleet: [],
                    cities: [],
                    message: []
                })
                await Game.findOneAndUpdate({ _id: gameId }, game)
            }
            return game
        }
    } catch (e) {
        throw e
    }
}

/**
 * get a game with its id
 * @param {string} gameId
 * @returns the game
 */
exports.getGameById = async (gameId) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        return game
    } catch (e) {
        throw e
    }
}

/**
 * delete a game
 * @param {string} gameId
 * @returns the deleted game
 */
exports.getGameByIdAndDelete = async (gameId) => {
    try {
        const game = await Game.findOneAndDelete({
            _id: gameId,
            password: password
        })
        if (!game) {
            return false
        }
        return game
    } catch (e) {
        throw e
    }
}

//TODO convey => (from = to)
/**
 * set a new move as attack, support or convey from a position to an other
 * @param {string} gameId
 * @param {string} username
 * @param {number} from
 * @param {number} to
 * @param {number} _for  0 for attack, positive number support the number, negative number with decimals convey. -44.45 => convey 44 to 45
 * @returns the turn's move array
 */
exports.createMove = async (gameId, username, from, to, _for) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        game.move.push({ by: username, from: from, to: to, for: _for })
        const newGame = await Game.findOneAndUpdate({ _id: gameId }, game)
        return newGame.move
    } catch (e) {
        throw e
    }
}

/**
 * Get newspaper
 * @param {string} gameId
 * @returns turn's result
 */
exports.getResultGame = async (gameId) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        return game.result
    } catch (e) {
        throw e
    }
}

/**
 * Set a new flee
 * @param {string} gameId
 * @param {string} username
 * @param {number} from
 * @param {number} to
 * @returns the new flee array
 */
exports.createFlee = async (gameId, username, from, to) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        game.flee.push({ by: username, from: from, to: to })
        const newGame = await Game.findOneAndUpdate({ _id: gameId }, game)
        return newGame.flee
    } catch (e) {
        throw e
    }
}

/**
 * Get the end of turn list
 * @param {string} gameId
 * @param {string} username
 * @param {number} from
 * @param {number} to
 * @returns the flee array
 */
exports.getFlee = async (gameId, username, from, to) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        return game.flee
    } catch (e) {
        throw e
    }
}

/**
 * Set a new troop(+) or fleet(-) for <username>
 * @param { string } gameId
 * @param { string } username
 * @param { number } where positive for troops and negative for fleet
 * @returns player informations or false if the player doesn't exist.
 */
exports.createTroops = async (gameId, username, where) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        for (let i = 0; i < game._players.length; i++) {
            if (game.players[i].username == username) {
                if (where > 0) {
                    game.players[i].troops.push(where)
                } else {
                    game.players[i].fleet.push(-where)
                }
                await Game.findOneAndUpdate({ _id: gameId }, game)
                return game.players[i]
            }
        }
        return false
    } catch (e) {
        throw e
    }
}

/**
 * set the next round
 * @param {string} gameId
 * @returns the game state
 */
exports.nextRoundGame = async (gameId) => {
    try {
        let game = await Game.findOne({ _id: gameId })
        switch (game.state.value) {
            case 'move':
                game.state.value = 'result'
                game.flee = []
                game.result = []
                break
            case 'result':
                game.state.value = 'move'
                game.move = []
                game.state.season = !game.state.season
                if (game.state.season) {
                    game.state.year++
                }
                break
        }
        await Game.findOneAndUpdate({ _id: gameId }, game)
        return game.state
    } catch (e) {
        throw e
    }
}

/**
 * set game's round
 * @param {string} gameId
 * @param {string} value
 * @returns the game state
 */
exports.setRoundGame = async (gameId, value) => {
    try {
        const game = await Game.findOneAndUpdate({
            _id: gameId,
            $set: { 'state.value': value }
        })
        return game.state.value
    } catch (e) {
        throw e
    }
}

/**
 * set game's result
 * @param {string} gameId
 * @param {Array} result [ { by: string, from: number, to: number, for: number }, ... ]
 */
exports.setResultGame = async (gameId, result) => {
    try {
        const game = await Game.findOneAndUpdate({
            _id: gameId,
            $set: { result: result }
        })
    } catch (e) {
        throw e
    }
}

/**
 * play/stop switcher
 * @param {string} gameId
 * @param {string} username
 * @returns true if the game is curently playing
 */
exports.setActiveGame = async (gameId, username) => {
    try {
        let game = await Game.findOne({ _id: gameId })
        game.state.active = !game.state.active
        await Game.findOneAndUpdate({ _id: gameId }, game)
        return game.state.active
    } catch (e) {
        throw e
    }
}
