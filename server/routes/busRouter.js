const express = require("express")
const createError = require("http-errors")
const assert = require("http-assert")
const { pagination } = require("../core/utils/util")
const POPUL_MAP = require("../plugins/POPUL_MAP")
const POST_MAP = require("../plugins/POP_POST_MAP")
const GET_MAP = require("../plugins/POP_GET_MAP")
const PUT_MAP = require("../plugins/POP_PUT_MAP")
const AUTH_MAP = require("../plugins/AUTH_MAP")
const User = require("../models/User")
const Article = require("../models/Article")
const Comment = require("../models/Comment")
const Category = require("../models/Category")
const qs = require("qs")
let router = express.Router()

//创建资源
router.post("/", async (req, res, next) => {
    try {
        let modelName = req.Model.modelName
        if (modelName in AUTH_MAP) {
            req.body[AUTH_MAP[modelName]] = req.auth._id
        }
        const model = await req.Model.create([req.body])
        if (modelName in POST_MAP) {
            let { _model, _ref, options } = POST_MAP[modelName]
            let refId = req.body[_ref]
            assert(refId, "422", `${_ref}必填`)
            await _model.findByIdAndUpdate(refId, options(model[0]._id))
        }

        res.status(200).send({
            message: "ok",
            data: {
                _id: model[0]._id
            }
        })
    } catch (e) {
        console.log(e);

        if (e.message.indexOf("duplicate key error") !== -1) {
            let key = Object.entries(e.keyPattern)[0][0]
            next(createError(422, `${key}不能重复`))
            return
        }
        let paramErrors = e.errors && Object.entries(e.errors).map(([key, value]) => {
            return value.message
        }).join(", ")
        next(createError(422, paramErrors))
    }
})
//更新资源
router.put('/:id', async (req, res, next) => {
    let { _id } = req.auth
    try {
        const modelName = req.Model.modelName
        let { revisable, authField } = PUT_MAP[modelName] || {}
        //查看当前用户是否有权限修改
        let item = await req.Model.findById(req.params.id)
        assert(item, 404, "资源不存在")
        assert.equal(item?.[authField], _id, 403, "权限不足")
        //筛选可修改信息
        let data = req.body
        let isEmpty = true
        data = Object.fromEntries(Object.entries(data).filter(([key, value]) => {
            if (revisable.includes(key)) {
                isEmpty = false
                return true
            }
            return false
        }))
        assert(!isEmpty, 400, "无可修改项")
        const model = await req.Model.findByIdAndUpdate(req.params.id, data)
        res.status(200).send({
            message: "ok",
            data: model
        })
    } catch (e) {
        next(e)
    }
})

//删除资源
router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id)
    res.status(200).send({
        message: 'ok'
    })
})

//查单条数据的详细信息
router.get("/:id", async (req, res, next) => {

    try {
        let _id = req.params.id
        //populate 数据填充
        let populateParams = POPUL_MAP[req.Model.modelName] || []
        const data = await req.Model.findById(_id).populate(populateParams).exec()
        assert(data, 422, "无法查询详细信息")
        //获取信息的附加操作
        let modelName = req.Model.modelName
        if (modelName in GET_MAP) {
            let { options } = GET_MAP[modelName]
            await req.Model.findByIdAndUpdate(_id, options)
        }
        res.status(200).send({
            message: "ok",
            data
        })
    } catch (e) {
        next(e)
    }
})
//查数据列表
//分页查询
router.get("/", async (req, res, next) => {
    let { options = {}, page = 1, size = 100, query = {}, dis = 8 } = req.query
    try {
        //条件查询
        if (typeof query === 'string') {
            query = qs.parse(query)
        }
        let populate = POPUL_MAP[req.Model.modelName] || []
        let q = "";
        if ("q" in query) {
            q = query.q
            delete query.q
        }
        console.log(query);
        if (q) {
            let regExp = new RegExp(q, "i")
            query = Object.assign(query,{
                $or: [
                    { title: regExp },
                    { body: regExp },
                    { name: regExp }
                ]
            })
        }

        const { count, list, total } = await pagination({ model: req.Model, size, page, populate, options, query, dis })


        res.status(200).send({
            message: 'ok',
            data: {
                count, list, total
            }
        })
    } catch (e) {
        console.log(e);
        next(createError(422, "请求数据失败"))
    }
})

exports.busRouter = router