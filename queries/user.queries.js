const User = require('../database/models/user.model')

exports.createUser = async (body) => {
    try {
        console.log(body)
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

exports.findUserPerEmail = async (email) => {
    return User.findOne({'local.email': email})
}