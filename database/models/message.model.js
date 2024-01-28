const mongoose = require('mongoose')
const schema = mongoose.Schema

const MessageSchema = schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    public: { type: Boolean, default: false },
    content: { type: String, default: '' },
    index: { type: Number, required: true },
    pinned: { type: Boolean, default: false },
    signature: { type: String, default: '' }
})

const Msg = mongoose.model('message', MessageSchema)
module.exports = Msg
