const passport = require("passport")

exports.sessionNew = (req, res, next)=>{
    res.end()
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
        res.json('you\'ve been deconnected')
    })
}