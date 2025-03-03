const createError = require("http-errors")
const FILE_TYPE = {
    "user": "user",
    "article": "article"
}
module.exports = async (req, res, next) => {
    let fileType = FILE_TYPE[req.params.classify]
    if (!fileType) {
        next(createError(400, "未知请求"))
    }
    req.fileType = fileType
    next()
}