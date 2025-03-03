const mongoose = require("mongoose")
const { uploadURL } = require("../config")
const { formatDate } = require("../core/utils/util")
let schema = new mongoose.Schema({
    title: {
        type: String,
        default: "默认标题"
    },
    //封面图
    cover: {
        type: String, //URL
        default: `${uploadURL}article/default_cover.jpg`
    },
    //文章内容
    body: {
        type: String, // URIencode(HTMLCode)
        required: true,
        set(val) {
            //存入数据库中的是译码后的数据
            try {
                let decodeContent = decodeURIComponent(val).replaceAll("\"", "'")
                return decodeContent
            } catch {
                return val.replaceAll("\"", "'")
            }
        }
    },
    //更新日期
    date: {
        type: mongoose.SchemaTypes.Date,
        default: Date.now,
        get(val) {
            return formatDate(new Date(val), "yyyy-MM-dd")
        }
    },
    //点击量
    hit_num: {
        type: Number,
        default: 0
    },
    //评论数量
    comment_num: {
        type: Number,
        default: 0
    },
    //喜欢 点赞
    like_num: {
        type: Number,
        default: 0
    },
    like_users: {
        type: Array,
        default: []
    },
    //作者
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        require: true
    },
    //评论集合
    comments: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Comment"
        }
    ],
    //分类
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
        default: "66f816751b0a117861076ca9"
    },
})
schema.set('toJSON', { getters: true });
module.exports = mongoose.model('Article', schema)