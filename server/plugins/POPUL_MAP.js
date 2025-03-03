module.exports = {
    "Article": [
        {
            path: "author",
            select: "avatar nickname"
        },
        {
            path: "comments",
            select: "content date uid",
            populate: {
                path: "uid",
                select: "nickname avatar "
            }
        },
        {
            path: "category",
            select: "name"
        }
    ],
    "Category": [
        {
            path: "aids",
            select: "title cover date hit_num comment_num like_num author"
        }
    ],
    "Comment": [

    ]
} 