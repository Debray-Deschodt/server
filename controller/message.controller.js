const {
    createMsg,
    getPublicMsg,
    getMineMsg,
    setPrivacyMsg
} = require('../queries/message.queries')
const { findSessionPerId } = require('../queries/session.queries')
const { findUserPerId } = require('../queries/user.queries')
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

/**
 * Get all the user's private messages.
 * @params gameId: string
 * @res messages
 */
exports.msgGetMine = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const messages = await getMineMsg(req.params.gameId, username)
        res.json(messages)
    } catch (e) {
        throw e
    }
}

/**
 * Set a message's privacy to public.
 * @params gameId: string
 * @req msgIndex: number
 * @res status(200)
 */
exports.msgSetPrivacy = async (req, res, next) => {
    try {
        const session = await findSessionPerId(req.signedCookies['connect.sid'])
        const user = await findUserPerId(
            JSON.parse(session.session).passport.user
        )
        const username = user.local.email
        const message = await setPrivacyMsg(
            req.params.gameId,
            req.body.msgIndex,
            username
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
