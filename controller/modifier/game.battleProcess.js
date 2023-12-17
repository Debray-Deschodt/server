const { onlyAdjoining } = require('./game.modifier')
const { places } = require('../../data/mapweb')

//TODO process ErasedTroops
/**
 * Sometimes fleeing troops can be nowhere. so they are erased until the next year.
 * @param process
 * @returns
 */
function processErasedTroops(process) {
    return process
}

/**
 * When someone attack, he is not in the battle on his 'from'. So he can loose his own battle and finish on the place
 * of an other winner. So he have to flee.
 *
 * remark : at this point only move that won can be considered as an attack. indeed processWinner should be run before.
 * @param process
 */
function processFleeingLoosers(process) {
    for (const canceled of process.canceled) {
        for (const attack of process.attack) {
            if (attack.to == canceled.from) {
                process.flee.push(canceled)
            }
        }
    }
    return process
}

/**
 * Determine who are canceled and fleeing.
 * @param process
 * @returns
 */
function processWinners(process) {
    let attack = process.attack

    while (attack.length != 0) {
        const battleTo = attack[0].to
        let battle = process.attack.filter((move) => move.to == attack[0].to)
        attack = attack.filter((move) => move.to != battle[0].to)
        let defender = process.wait.filter((move) => move.from == battle[0].to)
        if (
            process.canceled.find((move) => move == defender[0]) == undefined &&
            defender
        ) {
            battle.push(defender) //add the waiting pound in the battle that have not been canceled.
            battle.flat()
            console.log('defender is : ' + defender[0].from)
        }
        console.log('pounds engaged : ' + battle.length)
        let winners = []
        let maxCount = 0

        for (const mainCharacter of battle) {
            let count = 0
            for (const opponent of battle) {
                if (mainCharacter == opponent) count++
            }
            if (count > maxCount) {
                maxCount = count
                winners = [mainCharacter]
            } else if (count == maxCount) winners.push(mainCharacter)
        }

        if (winners.length == maxCount) {
            console.log('battle winned by : ' + winners[0].from)
            let loosers = battle.filter((move) => move != winners[0])
            loosers = loosers.filter((move, i) => loosers.indexOf(move) === i) //no duplicate no strength
            for (const looser of loosers) {
                let i_move = process.move.findIndex((move) => move == looser)
                process.move[i_move].to = process.move[i_move].from
                if (looser.from == battle[0].to) {
                    process.flee.push(looser)
                } else {
                    process.canceled.push(looser)
                }
            }
        } else {
            console.log('tous perdu.')
            let loosers = battle.filter((move, i) => battle.indexOf(move) === i)
            for (const looser of loosers) {
                let i_move = process.move.findIndex((move) => move == looser)
                if (looser.from != battleTo) {
                    process.canceled.push(looser)
                    console.log(looser.from, battleTo)
                    process.move[i_move].to = process.move[i_move].from
                }
            }
        }
    }
    return process
}

/**
 * Supports add the attack they are suported, duplicating it
 * should use {var unique = arr.filter((x, i) => arr.indexOf(x) === i)} for erasing the duplicated one in the future.
 * @param process
 * @returns
 */
function processAttackStrength(process) {
    for (const support of process.support) {
        const supportFrom = Math.floor(support.for)
        const supportTo = Math.round(support.for * 100 - supportFrom * 100)
        const leader = process.move.find(
            (move) => move.from == supportFrom && move.to == supportTo
        )
        if (leader) process.move.push(leader)
    }
    return process
}

/**
 * Attack needing a convoy that have been aborted are aborted
 * @param process
 */
function AbortAttack(process) {
    for (const attack of process.attack) {
        let legal = true
        if (!onlyAdjoining(attack)) {
            legal = false
            for (const convoy of process.convoy) {
                const convoyFrom = Math.floor(Math.abs(convoy.for))
                const convoyTo = Math.round(
                    Math.abs(convoy.for) * 100 - convoyFrom * 100
                )
                if (convoyFrom == attack.from && convoyTo == attack.to) {
                    legal = true
                }
            }
        }
        if (!legal) {
            console.log('need a convoy')
            const i_move = process.move.findIndex((move) => move == attack)
            process.move[i_move].to = attack.from
            process.canceled.push(process.move[i_move])
        }
    }
    return process
}

/**
 * convoy canceled by an attack are modified to a wait
 * @param process
 * @returns
 */
function AbortConvoy(process) {
    let convoyAborted = []
    for (const convoy of process.convoy) {
        for (const attack of process.attack) {
            if (attack.to == convoy.from) {
                convoyAborted.push(convoy)
            }
        }
    }
    if (convoyAborted.length > 0) {
        process.canceled.push(convoyAborted)
        process.canceled.flat()
    }

    for (const convoy of convoyAborted) {
        let i_move = process.move.findIndex((move) => move == convoy)
        process.move[i_move].for = 0
    }
    return process
}

/**
 * supports canceled by an attack are modified to a wait
 * @param process
 */
function AbortSupport(process) {
    let supportAborted = []
    for (const support of process.support) {
        for (const attack of process.attack) {
            if (attack.to == support.from) {
                supportAborted.push(support)
            }
        }
    }
    if (supportAborted.length > 0) {
        process.canceled.push(supportAborted)
        process.canceled.flat()
    }
    for (const support of supportAborted) {
        let i_move = process.move.findIndex((move) => move == support)
        process.move[i_move].to = process.move[i_move].from
        process.move[i_move].for = 0
    }
    return process
}

/**
 * Process the result
 * @param {Game} game
 * @returns {Game} game
 */
exports.gameSetResult = (game) => {
    let process = {
        move: JSON.parse(JSON.stringify(game.move)),
        flee: [],
        canceled: [],
        erased: [],
        get attack() {
            return this.move.filter(
                (move) => move.for == 0 && move.from != move.to
            )
        },
        get support() {
            return this.move.filter((move) => move.for > 0)
        },
        get wait() {
            return this.move.filter(
                (move) => move.for == 0 && move.from == move.to
            )
        },
        get convoy() {
            return this.move.filter((move) => move.for < 0)
        }
    }

    process = AbortSupport(process)
    process = AbortConvoy(process)
    process = AbortAttack(process)
    process = processAttackStrength(process)
    process = processWinners(process)
    process = processFleeingLoosers(process)
    process = processErasedTroops(process)

    // set game.players.troops/fleet
    for (const move of process.move) {
        const i_player = game._players.findIndex(
            (username) => username == move.by
        )
        const i_troop = game.players[i_player].troops.findIndex(
            (pos) => pos == move.from
        )
        if (i_troop != -1) {
            game.players[i_player].troops[i_troop] = move.to
        } else {
            const i_fleet = game.players[i_player].fleet.findIndex(
                (pos) => pos == move.from
            )
            game.players[i_player].fleet[i_fleet] = move.to
        }
    }

    for (const i_erased in process.erased) {
        const move = process.erased[i_erased]
        const i_player = game._players.findIndex(
            (username) => username == move.by
        )
        if (
            game.players[i_player].troops.findIndex(
                (pos) => pos == move.from
            ) != -1
        ) {
            game.players[i_player].troops = game.players[
                i_player
            ].troops.filter((pos) => pos == move.from)
        } else {
            game.players[i_player].fleet = game.players[i_player].fleet.filter(
                (pos) => pos == move.from
            )
        }
    }

    //set cities
    if (game.state.season == false) {
        for (const player of game.players) {
            const i_player = game.players.findIndex((x) => x == player)
            for (const troop of player.troops) {
                if (
                    places[troop].city &&
                    player.cities.find((city) => city == troop) == undefined
                ) {
                    for (const i2_player in game.players) {
                        game.players[i2_player].cities = game.players[
                            i2_player
                        ].cities.filter((place) => place != troop)
                    }
                    game.players[i_player].cities.push(troop)
                }
            }

            for (const fleet of player.fleet) {
                if (
                    places[fleet].city &&
                    player.cities.find((city) => city == fleet) == undefined
                ) {
                    for (const i2_player in game.players) {
                        game.players[i2_player].cities = game.players[
                            i2_player
                        ].cities.filter((place) => place != fleet)
                    }
                    game.players[i_player].cities.push(fleet)
                }
            }
        }
    }

    game.result = process.move.filter(
        (move, i) => process.move.indexOf(move) === i
    )
    game.flee = process.flee
    game.canceled = process.canceled
    game.erased = process.erased
    return game
}

/**
 * Initiate a move array from the owned pawns.
 *
 * update game.players[].troops/fleet in consequeses of game.flee and game.players[].cities.length
 * @param {Game} game
 * @returns move
 */
exports.gameSetMove = (game) => {
    //flee result
    if (game.flee.length != 0) {
        for (const flee of game.flee) {
            i_player = game._players.findIndex(
                (username) => username == flee.by
            )
            const i_troop = game.players[i_player].troops.findIndex(
                (pos) => pos == flee.from
            )
            if (i_troop != -1) {
                game.players[i_player].troops[i_troop] = flee.to
            } else {
                const i_fleet = game.players[i_player].fleet.findIndex(
                    (pos) => pos == flee.from
                )
                game.players[i_player].fleet[i_troop] = flee.to
            }
        }
    }

    //troop
    for (const player of game.players) {
        const i_player = game.players.findIndex((x) => x == player)
        if (player.cities.length < player.troops.length + player.fleet.length) {
            if (player.fleet.length > 0) {
                game.players[i_player].fleet.pop()
            } else {
                game.players[i_player].troops.pop()
            }
        }
    }

    //init
    game.move = []
    for (let i = 0; i < game._players.length; i++) {
        for (let j = 0; j < game.players[i].troops.length; j++) {
            game.move.push({
                by: game.players[i].username,
                from: game.players[i].troops[j],
                to: game.players[i].troops[j],
                for: 0
            })
        }
        for (let j = 0; j < game.players[i].fleet.length; j++) {
            game.move.push({
                by: game.players[i].username,
                from: game.players[i].fleet[j],
                to: game.players[i].fleet[j],
                for: 0
            })
        }
    }
    return game
}
