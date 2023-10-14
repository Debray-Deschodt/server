const User = require('../database/models/user.model')
const {findSessionPerId} = require('../queries/session.queries')

exports.createUser = async (body) => {
    try {
        const hashedPassword = await User.hashPassword(body.password)
            const user = new User({
                local : {
                    email : body.email,
                    password : hashedPassword
                }
            })
            return user.save() 
    } catch(e){
        throw e;
    }
}

exports.findUserPerId = async (id) => {
    return User.findOne({'_id': id})
}

exports.findUserPerEmail = async (email) => {
    return User.findOne({'local.email': email})
}

exports.findUserPerSessionId = async (id) => {
    try{
        const session = await findSessionPerId(id)
        console.log(session)
        return User.findOne({'_id' : JSON.parse(session.session).passport.user})
    }catch(e){
        console.log(e)
    }
}