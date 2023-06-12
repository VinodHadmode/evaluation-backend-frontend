const express = require("express")
const { auth } = require("../middleware/auth.middleware")
const { PostModel } = require("../models/post.model")


const postRouter = express.Router()

postRouter.post("/add", auth, async (req, res) => {
    try {
        const post = new PostModel(req.body)
        await post.save()
        res.status(200).json({ msg: "New post has been created!!" })

    } catch (error) {
        res.status(400).json({ err: error.message })
    }
})

postRouter.get("/", auth, async (req, res) => {
    const { title, min, max, userID, pageNum } = req.body
    const query = {userID: userID}
    if (title) {
        query.title = title
    }
    if (min && max) {
        query.$and = [
            { no_of_comments: { $gt: min } },
            { no_of_comments: { $lt: max } }
        ]
    }
    try {
        const posts = await PostModel.find(query).skip((pageNum-1)*3).limit(3)
        res.status(200).json({ allPosts: posts })

    } catch (error) {
        res.status(400).json({ err: error.message })
    }
})

postRouter.get("/top", auth, async (req, res) => {
    
    try {
        const posts = await PostModel.find(query).sort({"no_of_comments": 1}).skip((pageNum-1)*3).limit(3)
        res.status(200).json({ allPosts: posts })

    } catch (error) {
        res.status(400).json({ err: error.message })
    }
})

postRouter.patch("/update/:postID", auth, async (req, res) => {
    const { postID } = req.params
    try {
        const post = await PostModel.findOne({ _id: postID })
        const userIDinPostDoc = post.userID;
        const userIDinUserDoc = req.body.userID

        if (userIDinUserDoc === userIDinPostDoc) {
            await PostModel.findByIdAndUpdate({ _id: postID }, req.body)
            res.status(200).json({ msg: "Updated post!" })
        } else {
            res.status(400).json({ msg: "Not authorised" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


postRouter.delete("/update/:postID", auth, async (req, res) => {
    const { postID } = req.params
    try {
        const post = await PostModel.findOne({ _id: postID })
        const userIDinPostDoc = post.userID;
        const userIDinUserDoc = req.body.userID

        if (userIDinUserDoc === userIDinPostDoc) {
            await PostModel.findByIdAndDelete({ _id: postID })
            res.status(200).json({ msg: "deleted post!" })
        } else {
            res.status(400).json({ msg: "Not authorised" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


module.exports = {
    postRouter
}