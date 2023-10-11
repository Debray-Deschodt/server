const path = require("path")

module.exports = {
    dbUrl : 'mongodb+srv://admin:vz3409aTHKMEZcgO%3F%2FyPCT@uchronie.5j5gecp.mongodb.net/',
    cert : path.join(__dirname, '../ssl/cert.pem'),
    key : path.join(__dirname, '../ssl/key.pem') 
}