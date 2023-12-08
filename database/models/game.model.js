const mongoose = require('mongoose')
const schema = mongoose.Schema

const gameSchema = schema({
    title: { type: String, default: 'Nouvelle Partie' },
    description: { type: String, default: 'Pas de description' },
    password: { type: String, default: '' },
    _players: [{ type: String, required: true }],
    players: [
        {
            username: { type: String, default: '' },
            ready: { type: Boolean, default: false },
            troops: { type: Array, default: [] },
            fleet: { type: Array, default: [] },
            cities: { type: Array, default: [] },
            msg: { type: Array, default: [] }
        }
    ],
    setting: { roundDuration: { type: String, default: 'short' } }, //short , long
    state: {
        value: { type: String, default: 'move' }, // move, flee, newtroops
        year: { type: String, default: 0 },
        season: { type: Boolean, default: true }, //true -> spring, false -> autumn
        active: { type: Boolean, default: false },
        nextState: { type: Date, default: 0 }
    },
    move: [
        {
            by: { type: String, required: true },
            from: { type: Number, required: true },
            to: { type: Number, required: true },
            for: { type: Number, default: 0 } // 0 attack, 44 support, -44.45 convey
        }
    ],
    result: [
        {
            by: { type: String, required: true },
            from: { type: Number, required: true },
            to: { type: Number, required: true },
            for: { type: Number, default: 0 }
        }
    ],
    flee: [
        {
            by: { type: String, required: true },
            from: { type: Number, required: true },
            to: { type: Number, required: true }
        }
    ]
})

const Game = mongoose.model('game', gameSchema)

module.exports = Game
