const User = require('../database/models/user.model')

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