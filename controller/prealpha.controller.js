const passport = require("passport")
const mongoose = require('mongoose')
const FormRegister = require('../database/models/formRegisterPreAlpha')
const {findUserPerSessionId, modifyUserMail} = require('../queries/user.queries')

exports.formCreate = async (req, res, next)=>{
    try {
        const form = await FormRegister.findOne({username : req.body.username})
        if(form){
            console.log('Il semble qu\'un client veut publier un second formulaire d\'inscription')
            res.json('Vous ne pouvez publier qu\'un seul document')
        }else{
            const re = /[a-zA-Z0-9-\.]+@[a-zA-Z-]+\.[a-zA-Z]{1,6}/
            const newForm = new FormRegister({
                text: req.body.text,
                username: req.body.username,
                ip: req.ip
            })
            await modifyUserMail(req.body.username, re.exec(req.body.text)[0])
            newForm.save().catch(e => console.log(e))
            
            res.json('Le formulaire à bien été envoyé ')
        }
    }catch(e){
        console.log(e)
    }
}

exports.formModify = async (req, res, next)=>{
    const user = await findUserPerSessionId(req.signedCookies['connect.sid'])
    try{
        await FormRegister.findOneAndUpdate({username : req.body.username}, {$set: {text: req.body.text} })
        const re = /[a-zA-Z0-9-\.]+@[a-zA-Z-]+\.[a-zA-Z]{1,6}/
        await modifyUserMail(req.body.username, re.exec(req.body.text)[0])
        res.json('Le formulaire à bien été modifié')
    }catch(e){
        console.log(e)
    }
}

exports.formGet = async (req, res, next)=>{
    try {
        const user = await findUserPerSessionId(req.signedCookies['connect.sid'])
        const form = await FormRegister.findOne({username : user.local.email})
        if(form){
            res.json(form.text)
        }else{
            res.json('')
        }
    }catch(e){
        console.log(e)
    }
}
