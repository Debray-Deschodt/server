const express = require("express")
const PostItsUp = require("../database/models/postItUp.model")
const PostIts = require("../database/models/postItFlat.model")
const router = express.Router()

router.route("/")
    .get((req,res) =>{
        console.log("here are your postit")
        PostIts.find({})
            .then(documents => res.json(documents))
            .catch(e => console.log(e))
    })
    .post((req,res) => {
        PostIts.countDocuments({})
                .then(index => {
                    const newPostIt = new PostIts(req.body)
                    newPostIt.index = index
                    const newPostItUp = new PostItsUp({top : newPostIt.top, left: newPostIt.left, index: newPostIt.index})
                    newPostIt.save().catch(e => console.log(e))
                    newPostItUp.save().catch(e => console.log(e))
                    Flatter(newPostItUp)
                    res.end()
                })
                .catch(e => console.log(e))
    })

function Flatter(newPostItUp){
    PostItsUp.find({}).then((documents) => {
        for(let i = 0; i < documents.length; i++){
            if(Math.abs(documents[i].left - newPostItUp.left) < 12 
            && Math.abs(documents[i].top - newPostItUp.top) < 12
            && documents[i].top < newPostItUp.top
            && documents[i].index != newPostItUp.index
            ){
                PostIts.findOneAndUpdate({index: documents[i].index}, {$set: {'flat': 1} })
                       .then(()=> PostItsUp.findOneAndDelete({index: documents[i].index}))
                       .catch((e)=> console.log(e))
            }
        }
    })
}

module.exports = router