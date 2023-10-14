const mongoose = require("mongoose");
const schema = mongoose.Schema;

const postItSchema = schema({
  text : {type: String , required: false},
  color : {type: String ,required: true},
  top : {type: Number , required: true},
  left : {type: Number , required : true},
  index : {type:Number , required : true},
  flat : {type:Number , required : true},
  from : {type:String, requiered : true}
}) 
 
const PostIts = mongoose.model("postIt", postItSchema);

module.exports = PostIts
