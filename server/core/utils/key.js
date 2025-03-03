const fs = require("fs")
const { privateKeyPath, publicKeyPath } = require('../../config');
function getPublicKey() {
    return fs.readFileSync(publicKeyPath, 'utf8');
}
function getPrivateKey() {
    return fs.readFileSync(privateKeyPath, 'utf8');
}
module.exports = {
    getPublicKey, getPrivateKey
}