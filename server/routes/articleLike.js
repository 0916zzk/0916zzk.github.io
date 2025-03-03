const express = require("express")
const assert = require("http-assert")
const Article = require("../models/Article")
const User = require("../models/User")
let router = express.Router()
router.put("/inc/:id", async (req, res, next) => {
    let { _id: userid } = req.auth
    let id = req.params.id
    try {
        let article = await Article.findById(id)
        let likeUsers = article.like_users
        console.log(likeUsers, userid);

        assert(!likeUsers.includes(userid), 422, "不能重复点赞")
        let model = await Article.findByIdAndUpdate(id, { $inc: { like_num: 1 }, $push: { like_users: userid } })
        await User.findByIdAndUpdate(userid, { $push: { like_articles: id } })
        res.status(200).json({
            message: "ok",
            data: {
                count: model.like_num
            }
        })
    } catch (e) {
        console.log(e);
        next(e)
    }
})
router.put("/dec/:id", async (req, res, next) => {
    let { _id: userid } = req.auth
    let id = req.params.id
    try {
        let article = await Article.findById(id)
        let likeUsers = article.like_users
        assert(likeUsers.includes(userid), 422, "你未点赞该文章")
        let model = await Article.findByIdAndUpdate(id, { $inc: { like_num: -1 }, $pull: { like_users: userid } })
        await User.findByIdAndUpdate(userid, { $pull: { like_articles: id } })
        res.status(200).json({
            message: "ok",
            data: {
                count: model.like_num
            }
        })
    } catch (e) {
        console.log(e);
        next(e)
    }
})

module.exports = {
    likeRouter: router
}