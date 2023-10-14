const mongoose = require("mongoose");
const schema = mongoose.Schema;

const formSchema = schema({
  text : {type: String , required: true},
  username : {type: String, required: true},
  ip: {type: String, required: true}
}) 
 
const FormRegister = mongoose.model("formRegister", formSchema);

module.exports = FormRegister
