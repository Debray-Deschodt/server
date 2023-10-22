const Bug = require('../database/models/bug.model')

exports.createBug = (body)=>{
    try {
        console.log(body)

            const bug = new Bug({
                    title : body.title,
                    text : body.text,
                    username: body.username,
                    ip: body.ip
            })
            return bug.save() 
    } catch(e){
        throw e;
    }
}