import axios from "axios"
import store from "store"
import base from "@/config/base.config"
const { TOKEN_NAME } = base
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
let service = axios.create()
//request拦截器
service.interceptors.request.use(async (config) => {
    //添加token验证
    let token = store.get(TOKEN_NAME)
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
// response拦截器
service.interceptors.response.use((response) => {
    let result = response.data
    return result?.data;
}, function (error) {
    return Promise.reject(error);
});
export default service