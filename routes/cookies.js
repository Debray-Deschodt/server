const express = require("express")
const router = express.Router()

router.route('/')
    .post((req,res)=>{
        res.cookie('music', req.body.music)
        res.cookie('fx', req.body.fx)
        res.end()
    })

module.exports = router

// .get((req,res)=>{
//         res.cookie('register2', 'test', {
//             signed: true
//         })
//         res.clearCookie('register2')
//         console.log(req.signedCookies)
//         res.end()
//     })