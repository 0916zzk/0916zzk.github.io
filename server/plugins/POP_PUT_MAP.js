module.exports = {
    "Article": {
        "revisable": ["title", "cover", "body"],
        "authField": "author"
    },
    "User": {
        "revisable": ["password", "email", "nickname", "desc", "avatar"],
        "authField": "_id"
    },
    "Comment": {
        "revisable": ["content"],
        "authField": "uid"
    },
    "Column": {
        "revisable": ["name"],
        "authField": "uid"
    }
}