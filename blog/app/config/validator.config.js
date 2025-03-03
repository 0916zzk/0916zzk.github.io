const formDataMap = {
    register: ["username", "password", "repassword", "email"],
    login: ["username", "password"],
    postCategory: ["name"],
    putUserInfo: ["nickname", "email", "desc"]
}
const rulesMap = {
    "username": {
        rules: "required|regexp_username",
        regexp_username: /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{2,8}$/,
        display: "用户名格式：数字+字母，2-8位"
    },
    "password": {
        rules: "required|regexp_pwd",
        regexp_pwd: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{6,12}$/,
        display: "密码格式：数字+大写字母+小写字母，6-12位"
    },
    "repassword": {
        rules: "required|same(password)",
        display: "密码不一致",
    },
    "email": {
        rules: "required|regexp_email",
        regexp_email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
        display: "请输入正确的邮箱"
    },
    "nickname": {
        rules: "required",
        display: "请输入你的昵称"
    },
    "name": {
        rules: "required",
        display: "分类不能为空"
    },
    "desc": {
        rules: "regexp_desc",
        regexp_desc: /^.+$/,
    }
}
export {
    formDataMap, rulesMap
}