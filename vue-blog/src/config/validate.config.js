
const rulesMap = {
    "username": [
        { required: true, message: "用户名必填", trigger: 'blur' },
        { pattern: /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{2,8}$/, message: "用户名格式：数字+字母，2-8位", trigger: 'blur' }
    ],
    "password": [
        { required: true, message: "密码必填", trigger: 'blur' },
        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{6,12}$/, message: "密码格式：数字+大写字母+小写字母，6-12位", trigger: 'blur' }
    ],
    "email": [
        { required: true, message: "邮箱必填", trigger: 'blur' },
        { type: "email", message: "请输入正确的邮箱", trigger: 'blur' }
    ],
    "nickname": [
        { required: true, message: "请输入你的昵称", trigger: 'blur' },
    ],

    "name": [
        { required: true, message: "分类不能为空", trigger: 'blur' },
    ],
    "desc": [
        { pattern: /^.{0,}$/, message: "简介不能为空", trigger: 'blur' },
    ],
    "avatar": [
        { required: true, message: "头像不能为空", trigger: 'blur' },
    ],
}
export default rulesMap