const Adjective = require('../../database/models/nickname/adjective.model')

exports.createAdjective = (body)=>{
    try {
            const adjective = new Adjective({
                    adjM : body.adjM,
                    adjF : body.adjF,
            })
            return adjective.save() 
    } catch(e){
        throw e;
    }
}