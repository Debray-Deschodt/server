const Session = require('../database/models/session.model')

exports.findSessionPerId = async (id) => {
    try{
        const session = await Session.findOne({'_id': id})
        console.log('session pas trouvé' + id)
        return session
    }catch(e){
        console.log(e)
    }
}