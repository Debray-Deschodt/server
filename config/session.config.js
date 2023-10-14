const session = require('express-session')
const MongoStore = require('connect-mongo')
const cookieParser = require("cookie-parser")

const {app} = require('../app');

app.use(cookieParser('ZAErù*4opiu54dFG,nBxs;:!cv8VIuD54wsxc!;!@zuayu)1^o%8mj+b_r^!%=%@!gk^3$)mu#nu)9^!v-ok5zuv_e3t4i^clyu!p@=j&(3dku^nu^x3p&ubiz2+og-*$83j0894ezx232l1e-&c6tto$=@uyolz*tscj8z5j%ks@!01pqi$o85hz-'))
app.use(session({
    secret : 'ZAErù*4opiu54dFG,nBxs;:!cv8VIuD54wsxc!;!@zuayu)1^o%8mj+b_r^!%=%@!gk^3$)mu#nu)9^!v-ok5zuv_e3t4i^clyu!p@=j&(3dku^nu^x3p&ubiz2+og-*$83j0894ezx232l1e-&c6tto$=@uyolz*tscj8z5j%ks@!01pqi$o85hz-',
    resave: false,
    saveUninitialized: false,
    cookie : {
        httpOnly : true,
        maxAge : 60*60*24*12*1000
    },
    store : MongoStore.create({
        mongoUrl: 'mongodb+srv://admin:vz3409aTHKMEZcgO%3F%2FyPCT@uchronie.5j5gecp.mongodb.net/',
        ttl: 60*60*24*12
    }) 
}))
// 'mongodb+srv://admin:vz3409aTHKMEZcgO%3F%2FyPCT@uchronie.5j5gecp.mongodb.net/'