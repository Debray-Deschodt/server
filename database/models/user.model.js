const mongoose = require("mongoose");
const bcrypt = require('bcrypt') 
const schema = mongoose.Schema;

const userSchema = schema({
  local : {
    email : { type: String, required: true, unique: true},
    password : { type: String, required: true},
    admin : {type: Boolean, required: true},
    mail : {type: String, required: false}
  } 
}) 
 
userSchema.statics.hashPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(8)
        return bcrypt.hash(password, salt)
    }catch(e){
        throw e
    }
}

userSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.local.password)
}

const Users = mongoose.model("user", userSchema);

module.exports = Users