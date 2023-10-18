const {createAnimal} = require('../../queries/nickname/animal.queries.js')
const Animal = require('../../database/models/nickname/animal.model.js')

exports.animalCreate = async (req, res, next)=>{
     try{
        const animal = await createAnimal({
            name:req.body.name.substring(0,1).toUpperCase() + req.body.name.substring(1,req.body.name.length).toLowerCase(), 
            sex: req.body.sex
        })
        res.end()
    } catch(e){
        res.json('déjà dans la liste')
        console.log(e)
    }
}

exports.animalDelete = async (req, res, next)=>{
    await Animal.findOneAndDelete({name: req.body.name})
    res.end()
}