const User = require('../database/models/user.model')
const { findSessionPerId } = require('../queries/session.queries')

exports.createUser = async (body) => {
    try {
        const hashedPassword = await User.hashPassword(body.password)
        const user = new User({
            local: {
                email: body.email,
                password: hashedPassword,
                admin: false
            }
        })
        return user.save()
    } catch (e) {
        throw e
    }
}

exports.modifyUserUsername = async (username, newUsername) => {
    try {
        await User.findOneAndUpdate(
            { 'local.email': username },
            { $set: { 'local.email': newUsername } }
        )
    } catch (e) {
        console.log(e)
    }
}

exports.modifyUserMail = async (username, mail) => {
    try {
        await User.findOneAndUpdate(
            { 'local.email': username },
            { $set: { 'local.mail': mail } }
        )
    } catch (e) {
        console.log(e)
    }
}

exports.findUserPerId = async (id) => {
    return User.findOne({ _id: id })
}

exports.findUserPerEmail = async (email) => {
    return await User.findOne({ 'local.email': email })
}

exports.findUserPerSessionId = async (id) => {
    try {
        const session = await findSessionPerId(id)
        return User.findOne({ _id: JSON.parse(session.session).passport.user })
    } catch (e) {
        console.log(e)
    }
}

/**
 * update the research history of a User in a game.
 * @param {string} gameId
 * @param {string} userId
 * @param {string} research
 */
exports.postHistory = async (gameId, userId, research, count) => {
    const user = await User.findOne({ _id: userId })
    const i_researchHistory = user.local.researchHistory.findIndex(
        (history) => history.game == gameId
    )
    if (i_researchHistory == -1) {
        user.local.researchHistory.push({
            game: gameId,
            researchHistory: [research],
            counts: [count]
        })
    } else {
        user.local.researchHistory[i_researchHistory].researchHistory.push(
            research
        )
        user.local.researchHistory[i_researchHistory].counts.push(count)
    }
    await User.findOneAndUpdate({ _id: userId }, user)
}

/**
 * return the user's research history in a game.
 * @param {string} gameId
 * @param {string} userId
 * @returns
 */
exports.getHistory = async (gameId, userId) => {
    const user = await User.findOne({ _id: userId })
    const i_researchHistory = user.local.researchHistory.findIndex(
        (history) => history.game == gameId
    )
    if (i_researchHistory == -1) {
        return false
    } else {
        return user.local.researchHistory[i_researchHistory]
    }
}
