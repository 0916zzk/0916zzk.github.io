const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { formatDate } = require("./core/utils/util")
const app = express();
const socketServer = createServer(app);
const io = new Server(socketServer, { /* options */ });

const avatarDefaultPath = "http://127.0.0.1:3001/user/avatar_default-1729229212078.png"
const userList = {}
io.on("connection", (socket) => {
    socket.on("login", function ({ uid = "", nickname = "", avatar = avatarDefaultPath }) {
        let isUser = !!uid
        //登录用户使用uid作为唯一标识，游客使用socket.id作为唯一标识
        let lable = isUser ? uid : socket.id
        if (userList[lable]) {
            //异地登陆，强制退出
            userList[lable].socket.emit("other login", "异地登陆")
            userList[lable].socket.disconnect(true)
            delete userList[lable]
        }
        socket.lable = lable
        socket.nickname = isUser ? nickname : `游客${socket.id}`
        socket.avatar = isUser ? avatar : avatarDefaultPath
        userList[lable] = {
            socket
        }
    })
    //登录
    socket.on("enterChat", function () {
        socket.emit("you enter", socket.nickname, socket.avatar)
        io.sockets.emit("entered", socket.nickname, Object.entries(userList).length)
    })
    //退出
    socket.on("disconnect", function () {
        let lable = socket.lable
        if (!userList[lable]) {
            socket.emit("empty", "您未登录...")
            return
        }
        delete userList[lable]
        io.sockets.emit("logout", socket.nickname, Object.entries(userList).length)
    })
    //聊天
    socket.on("send", function (message = "") {
        let time = formatDate(new Date())
        socket.broadcast.emit("chat", {
            message,
            nickname: socket.nickname,
            avatar: socket.avatar,
            time
        })
    })
});

socketServer.listen(8888, function () {
    console.log("8888端口,socketServer服务启动")
});
module.exports = socketServer