import http from "@/api/http"
export default {
    install: (app) => {
        // 注入一个全局可用的 $translate() 方法
        app.provide('axios', http)
    }
}