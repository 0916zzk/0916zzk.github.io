const path = require("path")
const config = {
    host: "127.0.0.1",
    port: "3001",
    userPath: path.join(process.cwd(), "./data/user.json"),
    publicKeyPath: path.join(process.cwd(), "./auth/public.cer"),
    privateKeyPath: path.join(process.cwd(), "./auth/private.cer"),
    uploadURL: "http://127.0.0.1:3001/",
    uploadPath: path.join(process.cwd(), "uploads"),
    fileMaxSize: 1 * 1024 * 1024
}

module.exports = config