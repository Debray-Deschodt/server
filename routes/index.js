const express = require("express")
const router = express.Router()
const postIt = require('./postIt')
const cookies = require('./cookies')
const users = require('./users')
const auth = require('./auth')

router.use("/postit", postIt)
router.use('/cookies', cookies)
router.use('/auth', auth)
router.use('/users', users)

router.use("/", (req,res)=>{
    console.log("welcome on the index")
    res.end()
})


module.exports = router