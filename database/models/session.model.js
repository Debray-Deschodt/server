const mongoose = require("mongoose");
const schema = mongoose.Schema;

const sessionSchema = schema({
  session : {type:String, required : true}
}) 
 
const Sessions = mongoose.model("session", sessionSchema);

module.exports = Sessions
