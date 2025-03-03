const express = require("express")
const POPUL_MAP = require("../plugins/POPUL_MAP")
const Article = require("../models/Article")
const User = require("../models/User")
let router = express.Router()
router.get("/write", async (req, res, next) => {
    let { _id } = req.auth
    try {
        let populateParams = POPUL_MAP["Article"]
        let list = await Article.find({ author: _id }).populate(populateParams)
        res.status(200).json({
            message: "ok",
            data: {
                count: list.length,
                list
            }
        })
    } catch (e) {
        console.log(e);
        next(e)
    }
})
router.get("/like", async (req, res, next) => {
    let { _id } = req.auth
    try {
        let user = await User.findOne({ _id }).populate([
            {
                path: "like_articles",
                select: "title cover date hit_num comment_num like_num author body",
                populate: [
                    {
                        path: "category",
                        select: "name"
                    },
                    {
                        path: "author",
                        select: "nickname avatar "
                    }
                ]
            }
        ])
        let list = user.like_articles
        res.status(200).json({
            message: "ok",
            data: {
                count: list.length,
                list
            }
        })
    } catch (e) {
        console.log(e);
        next(e)
    }
})

module.exports = {
    myRouter: router
}