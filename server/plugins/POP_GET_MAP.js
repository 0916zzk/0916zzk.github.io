const User = require("../models/User")
const Article = require("../models/Article")
const Comment = require("../models/Comment")
const Category = require("../models/Category")
module.exports = {
    "Article": {
        options: {
            $inc: {
                "hit_num": 1
            }
        }
    },
}