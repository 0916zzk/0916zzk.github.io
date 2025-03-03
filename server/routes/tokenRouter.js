const express = require("express")
const createError = require("http-errors")
const assert = require("http-assert")
const User = require("../models/User")
const Article = require("../models/Article")
const Category = require("../models/Category")

let router = express.Router()

//创建资源
router.get("/", async (req, res, next) => {
    let { _id } = req.auth
    try {
        let item = await User.findById(_id)
        assert(item, 422, "请先登录")
        let articleNum = (await Article.find({ author: item._id })).length
        let categoryNum = (await Category.find({ uid: item._id })).length
        res.status(200).send({
            message: "ok",
            data: {
                articleNum, categoryNum,
                ...item["_doc"]
            }
        })
    } catch (e) {
        next(createError(e))
    }

})

exports.tokenRouter = router