const Animal = require('../../database/models/nickname/animal.model.js')
const Adjective = require('../../database/models/nickname/adjective.model.js')

exports.nicknameGet = async (req, res, next)=>{
    const animals = await Animal.find({})
    const adjectives = await Adjective.find({})
    res.json({animals: animals, adjectives: adjectives})
}

