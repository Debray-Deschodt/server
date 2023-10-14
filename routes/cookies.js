const express = require("express")
const router = express.Router()

router.route('/')
    .get((req,res)=>{
        // res.cookie('register2', 'test', {
        //     signed: true
        // })
        // res.clearCookie('register2')
        console.log(req.signedCookies)
        res.end()
    })

module.exports = router