import requestMap from "@/config/api.config"
import service from "./service"
import store from "store"
import encrty from "@/util/encrty"
import base from "@/config/base.config"
import { ElNotification } from 'element-plus'
const { TOKEN_NAME } = base

export default async function Http({ type, data }) {
    if (!(type in requestMap)) {
        throw new Error('API请求错误')
    }
    let { url, method, noMessage = false, rsaKey = false, rest = false, setToken = false } = requestMap[type]
    try {
        method = method.toLowerCase()
        //处理restfulAPI
        if (rest) {
            let restSymbol = url.match(/:(.*)$/)[1]
            url = url.replace(/:(.*)$/, data[restSymbol])
        }
        //加密
        if (rsaKey && data[rsaKey]) {
            data[rsaKey] = await encrty(data[rsaKey])
        }
        data = method === "get" ? { params: data } : data

        let result = await service[method](url, data)
        if (setToken) {
            let token = result.token;
            //本地存储token
            store.set(TOKEN_NAME, token)
            //pinia存储token
            // login(token)
            let uid = result.userId
            store.set('uid', uid)
        }
        return result
    } catch (e) {
        if (e.response) {
            if (noMessage) return Promise.reject(e);
            // message.danger(e.response.data.message)
            ElNotification({
                title: '请求错误',
                message: e.response.data.message,
                position: "top-right",
                type: 'error',
            })
        }
        return Promise.reject(e);
    }
} 
