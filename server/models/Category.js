const mongoose = require("mongoose")
const { formatDate } = require("../core/utils/util")
let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    //更新日期
    date: {
        type: mongoose.SchemaTypes.Date,
        default: Date.now,
        get(val) {
            return formatDate(new Date(val), "yyyy-MM-dd hh:mm:ss")
        }
    },
    //文章 ids
    aids: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Article"
    }],
    //创建该类别的用户ID
    uid: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    }
})
schema.set('toJSON', { getters: true });
module.exports = mongoose.model('Category', schema)