const {createBug} = require('../queries/bug.queries.js')

exports.bugCreate = async (req, res, next)=>{
     try{
        console.log('controller')
        await createBug({...req.body, ip: req.ip})
        res.end()
    } catch(e){
        console.log(e)
    }
}