const mongoose = require("mongoose");
const schema = mongoose.Schema;

const adjectiveSchema = schema({
    adjM : { type: String, required: true, unique: true},
    adjF : {type: String, required: true}
}) 

const Adjectives = mongoose.model("adjective", adjectiveSchema);

module.exports = Adjectives