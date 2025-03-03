export default {
    "login": {
        url: `/admin/login`,
        method: "post",
        rsaKey: "password",
        setToken: true
    },
    "register": {
        url: `/admin/register`,
        method: "post",
        rsaKey: "password",
        setToken: true
    },
    "articles": {
        url: "/api/rest/articles",
        method: "get"
    },
    "article": {
        url: "/api/rest/articles/:id",
        rest: true,
        method: "get"
    },
    "token": {
        url: "/token",
        method: "get",
        noMessage: true
    },
    "postArticle": {
        url: "/api/rest/articles",
        method: "post"
    },
    "category": {
        url: "/api/rest/categories",
        method: "get"
    },
    "postCategory": {
        url: "/api/rest/categories",
        method: "post"
    },
    "postComment": {
        url: "/api/rest/comments",
        method: "post",
        noMessage: true
    },
    "putUserInfo": {
        url: "/api/rest/users/:id",
        method: "put",
        rest: true
    },
    "postAvatar": {
        url: "/upload/user",
        method: "post"
    },
    "putAvatar": {
        url: "/api/rest/users/:id",
        method: "put",
        rest: true
    },
    "incLike": {
        url: "/article/like/inc/:id",
        method: "put",
        rest: true
    },
    "decLike": {
        url: "/article/like/dec/:id",
        method: "put",
        rest: true
    },
    "likeArticles": {
        url: "/my/like",
        method: "get",
    },
    "writeArticles": {
        url: "/my/write",
        method: "get",
    }
}