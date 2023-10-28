const mongoose = require("mongoose");
const schema = mongoose.Schema;

const gameSchema = schema({
    title : { type: String, default: 'Nouvelle Partie'},
    players : { type: Array, required: true},
    description : {type: String, default: 'Pas de description'},
    password : {type: String, default:''}
}) 

const Game = mongoose.model("game", gameSchema);

module.exports = Game