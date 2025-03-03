const express = require("express")
const { decrypt } = require("../core/utils/util")
const { getToken } = require("../core/getToen")
const assert = require("http-assert")
const User = require("../models/User")
const Article = require("../models/Article")
const Category = require("../models/Category")
const createError = require("http-errors")
let router = express.Router()
const errorMap = {
    email: "邮箱",
    username: "用户名"
}
router.post("/login", async (req, res, next) => {
    let { username, password } = req.body
    //用户密码为空
    try {
        if (!username || username.trim()?.length === 0 || !password || password?.trim().length === 0) {
            assert(false, 422, " 用户名密码不能为空")
        }
        let user = await User.findOne({ username }).select("+password")
        assert(user, 422, "用户不存在")
        let userPwd = user.password
        let validateKey = decrypt(decrypt(userPwd)) === decrypt(password)
        assert(validateKey, 422, "用户名或密码错误")
        let articleNum = (await Article.find({ author: user._id })).length
        let categoryNum = (await Category.find({ uid: user._id })).length
        //验证成功，签发JWT令牌
        let token = await getToken(user)
        res.status(200).json({
            message: "登陆成功",
            data: {
                userId: user._id,
                articleNum, categoryNum, avatar: user.avatar, nickname: user.nickname, desc: user.desc,
                token
            }
        })
    } catch (e) {
        next(e)
    }
})
router.post("/register", async (req, res, next) => {
    let { username, password } = req.body
    //用户密码为空
    try {
        if (!username || username.trim()?.length === 0 || !password || password?.trim().length === 0) {
            assert(false, 422, " 用户名密码不能为空")
        }
        let user = await User.create([req.body])
        //验证成功，签发JWT令牌
        let token = await getToken(user[0])

        res.status(200).json({
            message: "注册成功",
            data: {
                userId: user[0]._id,
                token
            }
        })
    } catch (e) {
        if (e.message.indexOf("duplicate key error") !== -1) {
            let key = Object.entries(e.keyPattern)[0][0]
            next(createError(422, `${errorMap[key] || key}不能重复`))
            return
        }
        let paramErrors = e.errors && Object.entries(e.errors).map(([key, value]) => {
            return value.message
        }).join(", ")
        next(createError(422, paramErrors))
    }
})

module.exports = {
    adminRouter: router
}