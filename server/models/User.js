const mongoose = require("mongoose")
const { encrypt, decrypt } = require("../core/utils/util")
const assert = require("http-assert")

let schema = new mongoose.Schema({
    username: {
        required: [true, '用户名必填'],
        type: String,
        validate: {
            validator(val) {
                return /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{2,8}$/.test(val)
            },
            message: "用户名必须为 数字+字母 2-8位"
        },
        //唯一
        unique: true
    },
    password: {
        type: String,
        select: false,
        validate: {
            validator(val) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{6,12}$/.test(decrypt(decrypt(val)))
            },
            message: "密码必须为数字+字母 6-12位"
        },
        required: [true, "密码必填"],
        set(val) {
            //触发器 setter 写入password时触发 写入数据 => encrypt(源数据)
            return encrypt(val)
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (val) {
                return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val)
            },
            message: "请输入合法邮箱地址"
        },
        unique: true
    },
    avatar: {
        type: String, //URL,
        default: "http://127.0.0.1:3001/user/avatar_default-1729229212078.png"
    },

    nickname: {
        type: String,
        validate: {
            validator: function (val) {
                return /^[0-9a-zA-Z\u0391-\uFFE5\[\]]{1,8}$/.test(val)
            },
            message: "昵称可包含 数字/英文/汉字 1-8位"
        },
        default: "[空白]"
    },
    desc: {
        type: String,
    },
    like_articles: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Article"
        }
    ],
})
module.exports = mongoose.model('User', schema)
