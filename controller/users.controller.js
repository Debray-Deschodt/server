const {createUser} = require('../queries/user.queries')

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