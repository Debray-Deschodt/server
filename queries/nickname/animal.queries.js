const Animal = require('../../database/models/nickname/animal.model')

exports.createAnimal = (body)=>{
    try {
            console.log(body)
            const animal = new Animal({
                    name : body.name,
                    sex : body.sex,
            })
            return animal.save() 
    } catch(e){
        throw e;
    }
}