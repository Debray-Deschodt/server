const Game = require('../database/models/game.model')

exports.createGame = (body)=>{
    try {
        const game = new Game({
                players: [body.username],
        })
        return game.save() 
    } catch(e){
        throw e;
    }
}

exports.getGame = async () => {
        return Game.find({})
}

exports.pushGamePlayers = async (id, username) => {
    try{
        const game = await Game.findOne({_id : id})
        if(!game.players.includes(username)){
            game.players.push(username)
            await Game.findOneAndUpdate({_id:id}, game)
        }
        return game
    }catch(e){
        console.log(e)
    }
}

exports.getGameById = async (id) => {
    try{
        const game = await Game.findOne({id : id})
        return game
    }catch(e){
        throw e
    }
}