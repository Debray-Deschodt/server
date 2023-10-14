const passport = require("passport")
const {findUserPerId} = require('../queries/user.queries')
const {findSessionPerId} = require('../queries/session.queries')

exports.sessionNew = async (req, res, next)=>{
    try{
        const session = await findSessionPerId(req.signedCookies.connect.sid)
        // const user = await findUserPerId(req.signedCookies.connect.sid)
        res.json(session)
    }catch(e){
        console.log('Attention, echec de la récuperation d\'un utilisateur, les cookies d\'un client sont peut-être corrompu ou la base de donnée disfonctionnelle.')
        res.status(403).end()
    }
}

exports.sessionCreate = (req, res, next)=>{
    passport.authenticate('local', (err, user, info) => {
            if(err){
                next(err)
            }else if (!user){
                res.json({error: info.message})
            }else{
                req.login(user, (err)=>{
                    if(err){
                        next(err)
                    }else{
                        res.json(req.user.local.email)
                    }
                })
            }
        }
    )(req,res,next)
}

exports.sessionDelete = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        res.json('Vous avez été déconnecté')
    })
}