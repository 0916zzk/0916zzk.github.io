const express = require("express")
const assert = require("http-assert")
const Article = require("../models/Article")
let router = express.Router()
router.get("/", async (req, res, next) => {
    let { q = "" } = req.query
    let regExp = new RegExp(q, "i")
    try {
        let list = await Article.find({
            $or: [
                { title: regExp },
                { body: regExp }
            ]
        })
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
    searchRouter: router
}