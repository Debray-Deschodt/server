const mongoose = require("mongoose");
const schema = mongoose.Schema;

const postItSchema = schema({
    top : {type: Number , required : true},
    left : {type: Number , required : true},
    index : {type:Number , required : true},
}) 
 
const PostItsUp = mongoose.model("postItUp", postItSchema)

module.exports = PostItsUp
