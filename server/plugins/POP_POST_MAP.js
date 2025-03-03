const User = require("../models/User")
const Article = require("../models/Article")
const Comment = require("../models/Comment")
const Category = require("../models/Category")
module.exports = {
    "Article": {
        "_model": Category,
        "_ref": "category",
        options: function (value) {
            return {
                $push: {
                    "aids": value
                }
            }
        }
    },
    "Comment": {
        "_model": Article,
        "_ref": "aid",
        options: function (value) {
            return {
                $push: {
                    "comments": value
                },
                $inc: {
                    "comment_num": 1
                }
            }
        }
    }
}