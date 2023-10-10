const mongoose = require("mongoose");

 mongoose.connect("mongodb+srv://admin:vz3409aTHKMEZcgO%3F%2FyPCT@uchronie.5j5gecp.mongodb.net/")
 .then(() => console.log("connection db ok !"))
 .catch( e => console.log(e))
