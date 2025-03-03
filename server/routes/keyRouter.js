const express = require("express")
const Key = require("../models/Key")
const assert = require("http-assert")
let router = express.Router()
router.get("/", async (req, res, next) => {
    try {
        let key = await Key.findOne()
        assert(key, 422, "无法获取key键")
        res.status(200).send({
            message: "ok",
            data: {
                pubKey: key.content
            }
        })
    } catch (e) {
        next(e)
    }
})
module.exports = {
    keyRouter: router
}