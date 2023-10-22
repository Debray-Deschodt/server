const express = require("express")
const router = express.Router()
const postIt = require('./postIt')
const cookies = require('./cookies')
const users = require('./users')
const auth = require('./auth')
const prealpha = require('./prealpha')
const admin = require('./admin')
const nickname = require('./nickname')
const bug = require('./bug')

router.use("/postit", postIt)
// router.use('/cookies', cookies)
router.use('/auth', auth)
router.use('/users', users)
router.use('/prealpha', prealpha)
router.use('/nickname', nickname)
router.use('/bug', bug)

router.use("/", (req,res)=>{
    res.status(404).end()
})


module.exports = router