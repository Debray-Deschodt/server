const Game = require('../database/models/game.model')

/**
 * create a new game and add the first player
 * @param {string} username
 * @returns the new game
 */
exports.createGame = async (username) => {
    try {
        const passwordTemp = Math.floor(9999 * Math.random())
        let game = new Game({
            title: '',
            description: '',
            password: passwordTemp,
            _players: [username],
            players: [
                {
                    username: username,
                    ready: false,
                    troops: [],
                    fleet: [],
                    cities: [],
                    msg: []
                }
            ]
        })
        game.password = game._id + ''
        game = await game.save()
        return game
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
exports.pushGamePlayers = async (gameId, username) => {
    try {
        let game = await Game.findOne({ _id: gameId })
        if (
            game._players.length < game.setting.nbrPlayer &&
            game &&
            !game._players.includes(username)
        ) {
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
 * @param {string} username
 * @returns the deleted game
 */
exports.getGameByIdAndDelete = async (gameId, password, username) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        if (game._players[0] == username) {
            await Game.findOneAndDelete({
                _id: gameId,
                password: password
            })
        }
        if (!game) {
            return false
        }
        return game
    } catch (e) {
        throw e
    }
}

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
        let game = await Game.findOne({ _id: gameId })
        const i_move = game.move.findIndex((move) => move.from == from)
        game.move[i_move] = { by: username, from: from, to: to, for: _for }
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
 * @returns the game updated or false if the pound wasn't fleeing
 */
exports.createFlee = async (gameId, username, from, to) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        const i_flee = game.flee.findIndex(
            (move) => move.by == username && move.from == from
        )
        if (i_flee != -1) {
            game.flee[i_flee] = { by: username, from: from, to: to, for: 0 }
            const newGame = await Game.findOneAndUpdate({ _id: gameId }, game)
            return newGame
        } else {
            return false
        }
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
                    game.players[i].troops.push(Math.abs(where))
                    game.players[i].newTroops.push(Math.abs(where))
                } else {
                    game.players[i].fleet.push(Math.abs(where))
                    game.players[i].newFleet.push(Math.abs(where))
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
        if (game.state.value == 'move') {
            game.state.value = 'result'
            game.flee = []
            game.canceled = []
            game.erased = []
        } else {
            game.state.value = 'move'
            if (!game.state.season) game.state.year++
            game.state.season = !game.state.season
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
        if (game._players.includes(username)) {
            game.state.active = !game.state.active
            await Game.findOneAndUpdate({ _id: gameId }, game)
        }
        return game.state.active
    } catch (e) {
        throw e
    }
}

/**
 * Update a game to game value.
 * @param {string} gameId
 * @param {Game} game
 */
exports.saveUpdatedGame = async (gameId, game) => {
    try {
        await Game.findOneAndUpdate({ _id: gameId }, game)
    } catch (e) {
        throw e
    }
}

/**
 * Update the settings.
 * @param {Game} gameId
 * @param {title, description, password, settings} settings
 * @param {string} username
 * @returns
 */
exports.updateGameSettings = async (gameId, settings, username) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        const gameBypassword = await Game.find({ password: settings.password })
        if (
            username == game._players[0] &&
            gameBypassword.filter((_game) => _game._id != gameId).length == 0
        ) {
            let newGame = JSON.parse(JSON.stringify(game))
            newGame.title = settings.title
            newGame.description = settings.description
            newGame.password = settings.password
            newGame.setting.roundDuration = settings.roundDuration
            newGame.setting.interRoundDuration = settings.interRoundDuration
            newGame.setting.nbrPlayer = settings.nbrPlayer
            await Game.findOneAndUpdate({ _id: gameId }, newGame)
            return true
        } else {
            return false
        }
    } catch (e) {
        throw e
    }
}

/**
 * switch user's ready state in the game.
 * @param {string} gameId
 * @param {string} username
 * @param {boolean} ready
 * @returns
 */
exports.UserReadyGame = async (gameId, username, ready) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        const i_players = game._players.findIndex(
            (_username) => _username == username
        )
        let players = game.players
        players[i_players].ready = ready
        const newGame = await Game.findOneAndUpdate(
            { _id: gameId },
            { $set: { players: players } },
            { new: true }
        )
        return newGame
    } catch (e) {
        throw e
    }
}

/**
 * add multiple cities to a player in a game.
 * @param {string} gameId
 * @param {string} username
 * @param {number[]} ready
 * @returns the new game.
 */
exports.addMultipleCities = async (gameId, username, startPosition) => {
    try {
        const game = await Game.findOne({ _id: gameId })
        const i_players = game._players.findIndex(
            (_username) => _username == username
        )
        let players = game.players
        for (const pos of startPosition) {
            players[i_players].cities.push(pos)
        }
        const newGame = await Game.findOneAndUpdate(
            { _id: gameId },
            { $set: { players: players } },
            { new: true }
        )
        return newGame
    } catch (e) {
        throw e
    }
}
