import { ref, } from 'vue'
import { defineStore } from 'pinia'
import store from 'store'
import base from "@/config/base.config"
import http from "@/api/http"
import { ElNotification } from 'element-plus'
import socket from '@/core/socket'
import loadsh from "@/util/lodsh"
const { isMobile } = loadsh


const { TOKEN_NAME } = base
export const useUserStore = defineStore('user', () => {
    const Token = ref(store.get(TOKEN_NAME) || "")
    let firstLogin = true
    const userInfo = ref({})
    async function getUserInfo(router) {
        let result = await http({ type: "token" })
        userInfo.value = result
        if (firstLogin) {
            // 建立socket连接
            socket.connectSocekt()
            socket.server.emit("login", { uid: userInfo.value._id, nickname: userInfo.value.nickname, avatar: userInfo.value.avatar })
            socket.server.on("other login", function () {
                logout(router)
                ElNotification({
                    title: '异地登录',
                    message: `您的帐号已在其他地方登录`,
                    position: "top-right",
                    type: 'error',
                })
            })
            firstLogin = false
        }
        return result
    }
    async function login(token, router) {
        Token.value = token
        try {
            let result = await getUserInfo(router)
            ElNotification({
                title: '登录成功',
                message: `欢迎回来，${result.nickname ?? "未知用户"}`,
                position: "top-right",
                type: 'success',
            })
            !isMobile() && router.push("/index")
        } catch (e) {
            ElNotification({
                title: '登录失败',
                message: `${e.message}`,
                position: "top-right",
                type: 'error',
            })
        }


    }
    function logout(router) {
        store.remove(TOKEN_NAME)
        ElNotification({
            title: '退出成功',
            message: `下次光临，${userInfo.value.nickname ?? "未知用户"}`,
            position: "top-right",
            type: 'success',
        })
        socket.server.close()
        firstLogin = true
        Token.value = ""
        userInfo.value = {}
        !isMobile() && router.push("/index")

    }
    return { Token, userInfo, login, logout, getUserInfo }
})
