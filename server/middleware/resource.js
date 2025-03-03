const inflection = require("inflection")
module.exports = async function (req, res, next) {
    //users => User
    const modelName = inflection.classify(req.params.resource)
    req.Model = require(`../models/${modelName}`)
    next()
}