const {createAdjective} = require('../../queries/nickname/adjective.queries.js')
const Adjectif = require('../../database/models/nickname/adjective.model')

exports.adjectiveCreate = async (req, res, next)=>{
     try{
        const adjective = await createAdjective({
            adjM:req.body.adjM.substring(0,1).toUpperCase() + req.body.adjM.substring(1,req.body.adjM.length).toLowerCase(),
            adjF:req.body.adjF.substring(0,1).toUpperCase() + req.body.adjF.substring(1,req.body.adjF.length).toLowerCase(),
        })
        res.end()
    } catch(e){
        res.json('déjà dans la liste')
        console.log(e)
    }
}

exports.adjectiveDelete = async (req, res, next)=>{
    try{
        await Adjectif.findOneAndDelete({adjM: req.body.adjM})
    }catch(e){
        console.log(e)
    }
        
    res.end()
}