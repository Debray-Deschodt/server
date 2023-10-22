const {createUser, modifyUserUsername, modifyUserMail} = require('../queries/user.queries')

exports.userCreate = async (req, res, next)=>{
    try{
        const body = req.body;
        const user = await createUser(body)
        res.end()
    } catch(e){
        console.log(e)
        res.json({error : 'Il y a déjà quelqu\'un qui s\'appelle comme toi'})
    }
}

exports.userModify = async (req, res, next)=>{
    try{
        console.log(req.body.newMail)
        if(req.body.newMail != ''){
            await modifyUserMail(req.body.username, req.body.newMail)
        }
        if(req.body.newUsername != ''){
            await modifyUserUsername(req.body.username, req.body.newUsername)
        }
        res.end()
    } catch(e){
        console.log(e)
    }
}
