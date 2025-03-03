import axios from "axios"
import JSEncrypt from "jsencrypt"
import store from "store"
import message from "./message"

const BASE_URL = "http://127.0.0.1:3001"
const PUBKEY_NAME = "ua_pubKey"
const ToKEN_NAME = "ua_ZZTK"
async function encrty(str) {
    let key = store.get(PUBKEY_NAME)
    try {
        if (!key || key === 'undefined') {
            let result = await instance.get('/keys')
            key = result.pubKey
            // key = key.replace(/\. +/g, '')
            // key = key.replace(/[\r\n]/g, '')
            store.set(PUBKEY_NAME, key)
        }
        let encrypt = new JSEncrypt()
        encrypt.setPublicKey(key)
        //加密密码
        return encrypt.encrypt(str);
    } catch (e) {
        console.log(e)
    }
}

let timer;
const requestMap = {
    "login": {
        url: `/admin/login`,
        method: "post",
        rsaKey: "password",
        setToken: true
    },
    "register": {
        url: `/admin/register`,
        method: "post",
        rsaKey: "password",
        setToken: true
    },
    "articles": {
        url: "/api/rest/articles",
        method: "get"
    },
    "article": {
        url: "/api/rest/articles/:id",
        rest: true,
        method: "get"
    },
    "token": {
        url: "/token",
        method: "get",
        noMessage: true
    },
    "postArticle": {
        url: "/api/rest/articles",
        method: "post"
    },
    "category": {
        url: "/api/rest/categories",
        method: "get"
    },
    "postCategory": {
        url: "/api/rest/categories",
        method: "post"
    },
    "postComment": {
        url: "/api/rest/comments",
        method: "post",
        noMessage: true
    },
    "search": {
        url: "/article/search",
        method: "get",
        noMessage: true
    },
    "userInfo": {
        url: "/api/rest/users/:id",
        method: "get",
        rest: true
    },
    "putUserInfo": {
        url: "/api/rest/users/:id",
        method: "put",
        rest: true
    },
    "postAvatar": {
        url: "/upload/user",
        method: "post"
    },
    "putAvatar": {
        url: "/api/rest/users/:id",
        method: "put",
        rest: true
    }

}
axios.defaults.baseURL = BASE_URL
let instance = axios.create()
//request拦截器
instance.interceptors.request.use(async (config) => {
    //添加token验证
    let token = store.get(ToKEN_NAME)
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
// response拦截器
instance.interceptors.response.use((response) => {
    let result = response.data
    return result?.data;
}, function (error) {
    return Promise.reject(error);
});
export default async function Http({ type, data }) {
    if (!type in requestMap) {
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
        if (rsaKey && data[rsaKey]) {
            data[rsaKey] = await encrty(data[rsaKey])
        }
        data = method === "get" ? { params: data } : data

        let result = await instance[method](url, data)
        if (setToken) {
            let token = result.token;
            //本地存储token
            store.set(ToKEN_NAME, token)
            let uid = result.userId
            store.set('uid', uid)
        }
        return result
    } catch (e) {
        if (e.response) {
            if (noMessage) return Promise.reject(e);
            message.danger(e.response.data.message)
        }
        return Promise.reject(e);
    }
} 
