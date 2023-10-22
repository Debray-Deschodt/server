const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bugSchema = schema({
    title : { type: String, required: true},
    text : {type: String, required: true},
    username : {type: String, required: true},
    ip:{type:String, required : true}
}) 

const Bug = mongoose.model("bug", bugSchema);

module.exports = Bug