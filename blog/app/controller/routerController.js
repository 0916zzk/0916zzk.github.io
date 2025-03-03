import Http from "../module/http.js"
import Template from "./templateController"
import modalMap from "../config/modal.config.js"
import Router from "sme-router"
import util from "../util/util.js"
import store from "store"
import Editor from "../module/editor.js"
import Comment from "../module/comment.js"
import postAvatar from "../module/postAvatar.js"
import $ from "jquery"
import message from "../module/message.js"
import QS from 'qs'
import Packery from 'packery'
const tokenName = "ua_ZZTK"


const ROUTE_MAP = {
    index: {
        wrap: ".blog-content-wrap",
        templateName: "articles"//指定模板名称，默认为路由名称
    },
    article: {
        wrap: ".blog-content-wrap"
    },
    login: {
        wrap: ".blog-login"
    },
    category: {
        wrap: ".blog-content-wrap"
    },
    write: {
        wrap: ".blog-content-wrap"
    },
    search: {
        wrap: ".blog-content-wrap",
        templateName: "articles"//指定模板名称，默认为路由名称
    },
    userInfo: {
        wrap: ".blog-content-wrap",
    },
    slider: {
        wrap: ".blog-slider"
    },
    logout: {
        wrap: ".blog-login"
    },
    myProject: {
        wrap: ".blog-content-wrap",
    },
    shootGame: {
        wrap: ".blog-content-wrap",
    },
    media: {
        wrap: ".blog-content-wrap",
    },
    postAvatar: {
        wrap: ".blog-content-wrap",
    }
}
//根据请求路由改变渲染的DOM元素
function routeHandle(routerName) {
    if (ROUTE_MAP[routerName]['wrap']) {
        pageRouter['_mount'] = document.querySelector(ROUTE_MAP[routerName]['wrap'])
    }
}
const pageRouter = new Router('page')


pageRouter.route("*", (req, res, next) => {
    //前端路由进入同意需要配置routerName属性
    if (!req.body.routerName) {
        // 没有配置，则说明是外部请求，重定向到index页面
        pageRouter.go("/index", { routerName: "index" })
    }
})
pageRouter.use((req) => {
    let type = req.body.routerName
    //routerName用于指定模板名称，如果指定了模板名称则使用指定的模板，默认为路由名称
    req.routeName = ROUTE_MAP[type]["templateName"] || type
    new Template({ wrap: ".blog-toolbar", typeName: "toolbar", data: { list: [] } }).render()
})
pageRouter.route("/index", async (req, res, next) => {
    try {
        routeHandle("index")
        let data = {}
        let categoryId = req.body.categoryId
        if (categoryId) {
            data.query = QS.stringify({ category: categoryId })
        }
        let result = await Http({ type: req.routeName, data })
        result.categoryId = categoryId
        result.list.map((item) => {
            item.body = $(item.body).text()
        })
        let html = Template.render(req.routeName, result)
        res.render(html)
        pageRouter.go("/login", { routerName: "login" })
    } catch (e) {
        pageRouter.go("/login", { routerName: "login" })
    }
})
pageRouter.route("/article", async (req, res, next) => {
    try {
        routeHandle("article")
        let id = req.body.articleId
        let result = await Http({ type: req.routeName, data: { id } })
        let html = Template.render(req.routeName, result)
        res.render(html)
        //toolbar渲染
        new Template({
            wrap: ".blog-toolbar", typeName: "toolbar", data: {
                list: [
                    {
                        icon: 'heart-empty',
                        content: result.like_num
                    },
                    {
                        icon: 'eye-open',
                        content: result.hit_num
                    },
                    {
                        icon: 'edit',
                        content: result.comment_num
                    }
                ]
            }
        }).render()
        //评论功能
        new Comment({
            submitEle: ".blog-comment-submit",
            inputEle: ".blog-comment-input",
            callback: async function (data) {
                if (!data) {
                    return false
                }
                data.aid = id
                try {
                    await Http({ type: "postComment", data })
                    pageRouter.go("/")
                    pageRouter.go("/article", { routerName: "article", articleId: id })
                } catch (e) {
                    message.warning("请先登录...")

                }

            }
        })
    } catch (e) {
        pageRouter.go("/login", { routerName: "login" })
    }
})
pageRouter.route("/login", async (req, res, next) => {
    routeHandle("login")
    new Template({
        wrap: ".blog-toolbar", typeName: "toolbar", data: {
            list: [{
                route: 'write',
                content: '写文章',
                icon: 'edit'
            }]
        }
    }).render()
    try {
        //token校验登录
        let result = await Http({ type: "token" })
        res.render(Template.render(req.routeName, { isLogin: true, ...result }))
        // 渲染侧边栏
        routeHandle("slider")
        res.render(Template.render("slider", { isLogin: true, ...result }))
    } catch (e) {
        try {
            let data = req.body.data
            if (!data) {
                res.render(Template.render(req.routeName, { isLogin: false }))
                // 渲染侧边栏
                routeHandle("slider")
                res.render(Template.render("slider", { isLogin: false }))
                return
            }
            //验证登录信息
            let result = await Http({ type: "login", data })
            let html = Template.render(req.routeName, { isLogin: true, ...result })
            res.render(html)
            // 渲染侧边栏
            routeHandle("slider")
            res.render(Template.render("slider", { isLogin: true, ...result }))
        } catch (e) {
            res.render(Template.render(req.routeName, { isLogin: false }))
            // 渲染侧边栏
            routeHandle("slider")
            res.render(Template.render("slider", { isLogin: false }))
        }
    }

})
pageRouter.route("/write", async (req, res, next) => {
    let categoties
    try {
        let { list } = await Http({
            type: 'category', data: {
                query: QS.stringify({ uid: store.get('uid') })
            }
        })
        categoties = list
    } catch (e) {
        categoties = []
    }

    let categoryId = req.body.categoryId
    if (!categoryId) {
        //默认第一个分类被选中
        categoties[0].selected = true
    } else {
        //有指定分类，则指定分类被选中
        categoties.map(item => {
            if (item._id === categoryId) {
                item.selected = true
            }
        })
    }
    routeHandle("write")
    let html = Template.render(req.routeName, { categoties })
    res.render(html)
    new Editor("simple", async (data) => {
        try {
            if (!data) {
                return false
            }
            let result = await Http({ type: 'postArticle', data })
            pageRouter.go(`/article`, { routerName: 'article', articleId: result._id })
        } catch (e) {
            console.log(e);
        }
    })
})

pageRouter.route("/category", async (req, res, next) => {
    routeHandle("category")
    let uid = store.get("uid")
    if (!uid || uid === "undefined") {
        message.warning("请先登录...")
        pageRouter.go("/index", { routerName: "index" })
    }
    try {
        let { list } = await Http({
            type: 'category', data: {
                query: QS.stringify({ uid })
            }
        })
        list = list.map(item => {
            let len = item.aids.length
            item.col = Math.min((len + 1), 10)
            item.row = Math.min((len + 1), 10)
            return item
        })
        res.render(Template.render(req.routeName, { list }))
        new Packery('.blog-category', {
            gutter: 8
        })
    } catch (e) {
        console.log(e);
        pageRouter.go("/index", { routerName: "index" })
    }
})
pageRouter.route("/search", async (req, res, next) => {
    routeHandle("search")
    try {
        let result = await Http({ type: "search", data: req.body.data })
        res.render(Template.render(req.routeName, result))
        pageRouter.go("")
    } catch (e) {
        pageRouter.go("index", { routerName: "index" })

    }

})
pageRouter.route("/userInfo", async (req, res, next) => {
    routeHandle("userInfo")
    let data = modalMap["putUserInfo"]
    try {
        await Http({ type: "token" })
    } catch (e) {
        message.warning("请先登录...")
        pageRouter.go("/index", { routerName: "index" })
        $(".blog-nav-list [data-router=index]").addClass("active").siblings().removeClass("active")
        return
    }
    try {
        let userId = store.get("uid")
        let result = await Http({ type: "userInfo", data: { id: userId } })
        data.formData.map((item) => {
            let query = item.query
            if (result[query]) {
                item.value = result[query]
            }
            if (query === "username") {
                item.readonly = true
            }
        })
        res.render(Template.render(req.routeName, data))
    } catch (e) {
        message.danger("获取用户信息失败")
    }
})
pageRouter.route("/logout", (req, res) => {
    store.remove(tokenName)
    pageRouter.go("/index", { routerName: "index" })
})
pageRouter.route("/myProject", (req, res, next) => {
    routeHandle("myProject")
    res.render(Template.render("myProject"))
})
pageRouter.route("/shootGame", (req, res) => {
    routeHandle("shootGame")
    res.render(Template.render("shootGame"))
    var script = document.createElement('script');
    script.src = '/js/shootGame.js';
    document.body.appendChild(script);
})
pageRouter.route("/media", (req, res) => {
    routeHandle("media")
    res.render(Template.render("media"))
    //动态引入JS文件
    var script = document.createElement('script');
    script.src = '/js/media.js';
    document.body.appendChild(script);
})
pageRouter.route("/postAvatar", async (req, res) => {
    routeHandle("postAvatar")
    let result = await Http({ type: "token" })
    res.render(Template.render("postAvatar", { avatar: result.avatar }))
    new postAvatar({
        inputEle: ".blog-modify-input p", displayEle: ".blog-modify-avatar img", submitEle: ".blog-modify-submit",
        callback: async (data) => {
            try {
                let result = await Http({ type: "postAvatar", data })
                await Http({ type: "putAvatar", data: { avatar: result, id: store.get("uid") } })
                pageRouter.go("/index", { routerName: "index" })
            } catch (e) {
                message.danger("修改头像失败")
            }
        }
    })
})
export default pageRouter