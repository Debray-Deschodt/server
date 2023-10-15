const passport = require("passport")
const mongoose = require('mongoose')
const FormRegister = require('../database/models/formRegisterPreAlpha')
const {findUserPerSessionId} = require('../queries/user.queries')

exports.formCreate = async (req, res, next)=>{
    try {
        const form = await FormRegister.findOne({username : req.body.username})
        if(form){
            console.log('Il semble qu\'un client veut publier un second formulaire d\'inscription')
            res.json('Vous ne pouvez publier qu\'un seul document')
        }else{
            const newForm = new FormRegister({
                text: req.body.text,
                username: req.body.username,
                ip: req.ip
            })
            newForm.save().catch(e => console.log(e))
            res.json('Le formulaire à bien été envoyé ')
        }
    }catch(e){
        console.log(e)
    }
}

exports.formModify = async (req, res, next)=>{
    const user = await findUserPerSessionId(req.signedCookies['connect.sid'])
    FormRegister.findOneAndUpdate({username : req.body.username}, {$set: {text: req.body.text} }).then(()=>{
        res.json('Le formulaire à bien été modifié')
    }).catch((e)=>{
        console.log(e)
        res.json('vous devez dans un premier temps écrire un formulaire avant de le modifier.')
    })
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
