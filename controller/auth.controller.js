const passport = require("passport")
const mongoose = require('mongoose')
const {findUserPerSessionId} = require('../queries/user.queries')

exports.sessionNew = async (req, res, next)=>{
    try{
        const user = await findUserPerSessionId(req.signedCookies['connect.sid'])
        res.json(user.local.email)
        // console.log(user.local.email)
    }catch(e){
        console.log(e)
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