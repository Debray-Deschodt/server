const Session = require('../database/models/session.model')

exports.findSessionPerId = async (id) => {
        return Session.findOne({_id: id})
}