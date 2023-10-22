const passport = require("passport")
const mongoose = require('mongoose')
const {findUserPerSessionId, findUserPerEmail} = require('../queries/user.queries')

exports.sessionNew = async (req, res, next)=>{
    try{
        const user = await findUserPerSessionId(req.signedCookies['connect.sid'])
        res.json({username : user.local.email, admin: user.local.admin, mail: user.local.mail})
        const date = new Date()
        date.setHours(date.getHours() + 2)
        console.log(user.local.email, date.toUTCString() )
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
                        const user = findUserPerEmail(req.body.email).then((document)=>{
                            // console.log(user)
                            res.json({username : document.local.email, admin: document.local.admin})
                        }).catch((e)=>console.log(e))
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