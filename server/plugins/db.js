const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/db_blog", {})

let db = mongoose.connection
db.on('error', function (err) {
    console.log(err)
})
db.on('open', function (err) {
    console.dir('mongodb://127.0.0.1:27017/blog is open')
})

exports.mongoose = mongoose