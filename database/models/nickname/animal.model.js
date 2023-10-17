const mongoose = require("mongoose");
const schema = mongoose.Schema;

const animalSchema = schema({
    name : { type: String, required: true, unique: true},
    sex : {type: Boolean, required: true}
}) 

const Animals = mongoose.model("animal", animalSchema);

module.exports = Animals