const express = require("express")
const multer = require("multer")
const path = require("path")
const url = require("url")
const fs = require("fs")
const createError = require("http-errors")
const { uploadPath, uploadURL, fileMaxSize } = require("../config")
const validateUpload = require("../middleware/validateUpload")
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let fileType = req.fileType
        const filePath = path.join(uploadPath, fileType)
        fs.existsSync(filePath) || fs.mkdirSync(filePath)
        cb(null, filePath)
    },
    filename: function (req, file, cb) {
        const { ext, name } = path.parse(file.originalname)
        cb(null, name + '-' + Date.now() + ext)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        //限制上传文件大小
        fileSize: fileMaxSize
    }
})
router.post("/:classify", validateUpload, upload.single("file"), async (req, res, next) => {
    if (!req.file) {
        next(createError(400, "没有提交文件"))
        return
    }

    let { destination, filename } = req.file
    let fp = path.parse(destination).base

    res.status(200).json({
        message: "ok",
        data: url.resolve(uploadURL, path.join(fp, filename))
    })
})
module.exports = {
    uploadRouter: router
}