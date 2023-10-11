const mongoose = require("mongoose");
const env = require('../environment/'+ process.env.NODE_ENV)

 mongoose.connect(env.dbUrl)
 .then(() => console.log("connection db ok !"))
 .catch( e => console.log(e))
