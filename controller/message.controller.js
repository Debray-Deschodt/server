const {
    createMsg,
    getPublicMsg,
    getMineMsg,
    setPrivacyMsg
} = require('../queries/message.queries')

/**
 * Send a new message.
 * @params gameId: string
 * @req receiver: string, content: string
 * @res status(200)
 */
exports.msgCreate = async (req, res, next) => {
    try {
        const msg = await createMsg(
            req.params.gameId,
            req.body.receiver,
            req.body.content
        )
        res.status(200).end()
    } catch (e) {
        throw e
    }
}

//TODO protect it. Only own user
//TODO username doesn't need to be in body
/**
 * Get all the user's private messages.
 * @params gameId: string, username: string
 * @res messages
 */
exports.msgGetMine = async (req, res, next) => {
    try {
        const messages = await getMineMsg(
            req.params.gameId,
            req.params.username
        )
        res.json(messages)
    } catch (e) {
        throw e
    }
}

//TODO protect it. Only user = msg.to
/**
 * Set a message's privacy to public.
 * @params gameId: string
 * @req msgIndex: number
 * @res status(200)
 */
exports.msgSetPrivacy = async (req, res, next) => {
    try {
        const message = await setPrivacyMsg(
            req.params.gameId,
            req.body.msgIndex
        )
        res.status(200).end()
    } catch (e) {
        throw e
    }
}

/**
 * Get all the public messages in a game.
 * @params gameId: string
 * @res messages
 */
exports.msgGet = async (req, res, next) => {
    try {
        const messages = await getPublicMsg(req.params.gameId)
        res.json(messages)
    } catch (e) {
        throw e
    }
}
