const { getPrivateKey } = require('../core/utils/key')
const jwt = require('jsonwebtoken') //token生成包  JWT
module.exports = {
    async getToken(userInfo) {
        let { username, _id } = userInfo
        let privateKey = await getPrivateKey()
        let token = jwt.sign({ username, _id, exp: ~~((Date.now() / 1000) + 24 * 3600 * 3) }, privateKey, { algorithm: 'RS256' });
        return token
    }
}