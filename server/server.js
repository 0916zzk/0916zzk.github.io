const http = require('http')
const express = require('express')
const createError = require("http-errors")
const path = require("path")
const cors = require("cors")
const logger = require("morgan")
const { expressjwt: jwt } = require("express-jwt");
const { port, fileMaxSize } = require("./config")
const { getPublicKey } = require("./core/utils/key")
//初始化数据库
require("./plugins/db")
//创建websocket服务
require("./socket")

/*router Begin*/
const { adminRouter } = require("./routes/adminRouter")
const { keyRouter } = require("./routes/keyRouter")
const { uploadRouter } = require("./routes/uploadRouter")
const { searchRouter } = require("./routes/searchRouter")
const { myRouter } = require("./routes/myRouter")
const { tokenRouter } = require("./routes/tokenRouter")
const { likeRouter } = require("./routes/articleLike")
/*router End*/
//资源路由
const { busRouter } = require("./routes/busRouter")

//中间件
const resource = require("./middleware/resource")

let app = express()
app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded())
app.use(cors({
    "origin": true, //true 设置为 req.origin.url
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //容许跨域的请求方式
    "allowedHeaders": "x-requested-with,Authorization,token, content-type", //跨域请求头
    "preflightContinue": false, // 是否通过next() 传递options请求 给后续中间件 
    "maxAge": 1728000, //options预验结果缓存时间 20天
    "credentials": true, //携带cookie跨域
    "optionsSuccessStatus": 200 //options 请求返回状态码
}))
//访问静态文件
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
//jwt登录鉴权
app.use(jwt({ secret: getPublicKey(), algorithms: ["RS256"] }).unless({
    //排除不需要鉴权的页面
    path: [
        { url: /^\/api\/rest\/comments.*/, methods: ['GET'] },
        { url: /^\/api\/rest\/categories.*/, methods: ['GET'] },
        { url: /^\/api\/rest\/articles.*/, methods: ['GET'] },
        { url: '/api/rest/keys', methods: ['GET'] },
        { url: '/admin/login' },
        { url: '/admin/register' },
        { url: '/keys' },
        { url: '/article/search', methods: ['GET'] },
    ]
}))


//资源路由
app.use("/api/rest/:resource", resource, busRouter)

//登陆注册
app.use("/admin", adminRouter)


//获取公钥
app.use("/keys", keyRouter)

//上传文件
app.use("/upload", uploadRouter)

//搜索文章
app.use("/article/search", searchRouter)

//搜索文章
app.use("/my", myRouter)

//鉴权接口
app.use("/token", tokenRouter)

//文章点赞接口
app.use("/article/like", likeRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
})


const ERROR_CODE_MAP = {
    "invalid_token": {
        status: 403,
        message: "请先登录..."
    },
    "LIMIT_FILE_SIZE": {
        status: 400,
        message: `文件大小不得超过${fileMaxSize}bytes`
    }
}
// error handler
app.use(function (err, req, res, next) {
    if (err.code && err.code in ERROR_CODE_MAP) {
        const { status, message } = ERROR_CODE_MAP[err.code]
        res.status(status).send({ message });
        return
    }
    res.status(err.status || 500).send({
        message: err.message
    });
});

http.createServer(app).listen(port, () => {
    console.log(`${port}端口 http服务启动`)
})