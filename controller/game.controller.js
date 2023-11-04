const {createGame, getGame, pushGamePlayers} = require('../queries/game.queries.js')

exports.gameCreate = async (req, res, next)=>{
     try{
        console.log(req.body)
        await createGame(req.body)
        res.end()
    } catch(e){
        console.log(e)
    }
}

exports.gameGet = async (req, res, next)=>{
     try{
        const games = await getGame()
        let gamesInClientInterface = []
        for(let i = 0; i< games.length; i++){
            gamesInClientInterface.push({
                title: games[i].title,
                description: games[i].description,
                players: games[i].players.length,
                id: games[i]._id
            })
        }
        res.json(gamesInClientInterface)
    } catch(e){
        throw e
    }
}

exports.gameJoin = async (req, res, next)=>{
     try{
        const game = await pushGamePlayers(req.body.id, req.body.username)
        res.json(game)
    } catch(e){
        throw e
    }
}

exports.gameModifier = async (req, res, next)=>{
     try{
        res.end()
    } catch(e){
        console.log(e)
    }
}
exports.gameDelete = async (req, res, next)=>{
     try{
        res.end()
    } catch(e){
        console.log(e)
    }
}