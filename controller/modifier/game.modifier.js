const { places } = require('../../data/mapweb.js')

/**
 * Certify that the player have a pawn at this place.
 * @notice made for moveCreate
 * @param {Game} game
 * @param {Object} move by: string, from: number, to: number, for: number
 */
exports.onlyOwnPawn = (game, move) => {
    for (let i = 0; i < game._players.length; i++) {
        if (
            game._players[i] == move.by &&
            (game.players[i].troops.includes(move.from) ||
                game.players[i].fleet.includes(move.from))
        ) {
            return true
        }
    }
    return false
}

/**
 * Certify that the land are adjoining.
 * @notice made for moveCreate
 * @param {Object} move by: string, from: number, to: number, for: number
 * @returns
 */
exports.onlyAdjoining = (move) => {
    const to = parseInt(move.to)
    if (
        places[move.from].linkedLand.includes(to) ||
        places[move.from].linkedSea.includes(to) ||
        move.from == move.to
    ) {
        return true
    }
    return false
}

/**
 * Certify that moves only support adjoining land.
 * @notice made for moveCreate
 * @param {Object} move by: string, from: number, to: number, for: number
 * @returns
 */
exports.onlyAdjoiningSupport = (move) => {
    if (move.for > 0) {
        const supportTo = move.for * 100 - Math.floor(move.for) * 100
        if (
            places[move.from].linkedLand.includes(supportTo) ||
            places[move.from].linkedSea.includes(supportTo)
        ) {
            return true
        }
        return false
    }
    return true
}

/**
 * Certify that moves only convey adjoining land.
 * @notice made for moveCreate
 * @param {Object} move by: string, from: number, to: number, for: number
 * @returns
 */
exports.onlyAdjoiningConvey = (move) => {
    if (move.for < 0) {
        conveyFrom = Math.floor(-move.for)
        console.log(conveyFrom)
        if (places[move.from].linkedLand.includes(conveyFrom)) {
            return true
        }
        return false
    }
    return true
}

/**
 * Certify that only fleet can go in the ocean
 * @notice made for moveCreate
 * @param {Game} game
 * @param {Object} move by: string, from: number, to: number, for: number
 * @returns
 */
exports.onlySeaForFleet = (game, move) => {
    const from = parseInt(move.from)
    for (let i = 0; i < game._players.length; i++) {
        if (game.players[i].troops.includes(from) && !places[move.to].land) {
            return false
        }
    }
    return true
}

/**
 * Certify that fleet can't go inside the land
 * @param {Object} move by: string, from: number, to: number, for: number
 * @returns
 */
exports.onlyLandForTroops = (game, move) => {
    const player = game.players.find((_player) => _player.username == move.by)
    if (player.fleet.includes(move.from)) {
        if (places[move.to].linkedSea[0] == undefined) {
            return false
        } else {
            return true
        }
    }
    return true
}

/**
 * Certify that the place is free
 * @notice made for fleeCreate
 * @param {Game} game
 * @param {Object} move by: string, from: number, to: number, for: number
 */
exports.onlyFreePlaces = (game, move) => {
    let occupatedPlaces = []
    for (const player of game.players) {
        occupatedPlaces.push(player.troops)
        occupatedPlaces.push(player.fleet)
    }
    occupatedPlaces = occupatedPlaces.flat()
    if (occupatedPlaces.includes(move.to)) {
        return false
    }
    return true
}

//TODO only if the game.status.value = 'move'
/**
 * Certify that the Game is in 'move' mode.
 * @notice made for fleeGet
 * @param {Game} game
 */
exports.onlyInMoveStatus = (game) => {
    return true
}

/**
 * Certify that the new troop is created in a city.
 * @notice Made for troopsCreate
 * @param {number} where
 */
exports.onlyNewTroopInCities = (where) => {
    if (places[Math.abs(where)].city) return true
    return false
}

/**
 * Certify that the city is owned by the user.
 * @notice Made for troopsCreate
 * @param {Game} game
 * @param {string} username
 * @param {number} where
 */
exports.onlyOwnCities = (game, username, where) => {
    const i_player = game._players.findIndex(
        (_username) => _username == username
    )
    if (game.players[i_player].cities.includes(Math.abs(where))) return true
    return false
}

//TODO onlyFreeCities
/**
 * Certify that there is no pawn on the city.
 * @notice Made for troopsCreate
 * @param {Game} game
 * @param {string} username
 * @param {number} where
 */
exports.onlyFreeCities = (game, username, where) => {}

//TODO cities.length = paws.length.
/**
 * Certify that the user doesn't have more pawn than onwed cities.
 * @notice Made for troopsCreate
 * @param {Game} game
 */
exports.onlyLessPawnThanOwnedCities = (game) => {
    return true
}

/**
 * Certify that convoy and support don't move.
 * @param {Object} move by: string, from: number, to: number, for: number
 */
exports.onlyAttackCanMove = (move) => {
    if (move.for != 0 && move.from != move.to) return false
    return true
}

/**
 * Certify that troops can't support an attack at sea.
 * @param {Object} move by: string, from: number, to: number, for: number
 * @returns
 */
exports.onlyTroopSupportInLand = (game, move) => {
    if (move.for > 0) {
        let troop = true
        const supportTo = move.for * 100 - Math.floor(move.for) * 100
        for (const player of game.players) {
            if (player.fleet.includes(move.from)) troop = false
        }
        if (troop && !places[supportTo].land) {
            return false
        }
    }
    return true
}

/**
 * Certify that troops can't convoy.
 * @param {Object} move by: string, from: number, to: number, for: number
 * @returns
 */
exports.onlyConvoyForFleet = (game, move) => {
    if (move.for < 0) {
        let troop = true
        const supportTo = move.for * 100 - Math.floor(move.for) * 100
        for (const player of game.players) {
            if (player.fleet.includes(move.from)) troop = false
        }
        if (troop) {
            return false
        }
    }
    return true
}
