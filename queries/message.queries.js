const Msg = require('../database/models/message.model')

/**
 * Send a new message
 * @param {string} gameId
 * @param {string} username as a receiver
 * @param {string} content
 * @returns the message
 */
exports.createMsg = async (gameId, username, content) => {
    try {
        const messages = await Msg.find({ from: gameId })
        const msg = new Msg({
            from: gameId,
            to: username,
            public: false,
            content: content,
            index: messages.length || 0
        })
        return msg.save()
    } catch (e) {
        throw e
    }
}

/**
 * get all the public message in the game
 * @param {string} gameId
 * @returns the public messages array
 */
exports.getPublicMsg = async (gameId) => {
    try {
        const messages = await Msg.find({ from: gameId, public: true })
        return messages
    } catch (e) {
        throw e
    }
}

/**
 * get all the private messages that haven't been pinned in the game
 * @param {string} gameId
 * @returns the private unpinned messages array
 */
exports.getPrivateUnpinnedMsg = async (gameId) => {
    try {
        const messages = await Msg.find({
            from: gameId,
            public: false,
            pinned: false
        })
        return messages
    } catch (e) {
        throw e
    }
}

/**
 * get all the user messages that are private
 * @param {string} gameId
 * @param {string} username
 * @returns the username's private messages array
 */
exports.getMineMsg = async (gameId, username) => {
    try {
        const messages = await Msg.find({
            from: gameId,
            to: username,
            public: false
        })
        return messages
    } catch (e) {
        throw e
    }
}

/**
 * set a message public
 * @param {string} gameId
 * @param {string} msgIndex
 * @param {string} username
 * @returns message
 */
exports.setPrivacyMsg = async (gameId, msgIndex, username) => {
    try {
        const msg = await Msg.findOne({ from: gameId, index: msgIndex })
        if (msg.to == username)
            await Msg.findOneAndUpdate(
                { _id: msg._id },
                { $set: { public: true } }
            )
        return msg
    } catch (e) {
        throw e
    }
}

/**
 * switch message's statut to pinned/unpinned.
 * @param {string} gameId
 * @param {string} msgIndex
 * @param {string} username
 * @returns message
 */
exports.setPinMsg = async (gameId, msgIndex, username) => {
    try {
        const msg = await Msg.findOne({ from: gameId, index: msgIndex })
        if (msg.to == username)
            if (msg.pinned) {
                await Msg.findOneAndUpdate(
                    { _id: msg._id },
                    { $set: { pinned: false } }
                )
            } else {
                await Msg.findOneAndUpdate(
                    { _id: msg._id },
                    { $set: { pinned: true } }
                )
            }
        return msg
    } catch (e) {
        throw e
    }
}
