const {findSessionPerId} = require('../queries/session.queries')
const {findUserPerId} = require('../queries/user.queries')

exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }else{
        res.status(403).json('Veuillez vous authentifier')
    }
}

exports.ensureAdmin = async(req, res, next) => {
    let admin = false
    try{
        const session = await findSessionPerId(req.signedCookies['connect.sid']) 
        const user = await findUserPerId(JSON.parse(session.session).passport.user)
        if(user.local.admin){
        next()
        }else{
        res.status(403)
        }
    }catch(e){
        console.log(e)
        res.status(403)
    }
}
