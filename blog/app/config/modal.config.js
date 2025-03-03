export default {
    "login": {
        title: '登录',
        formType: "login",
        formData: [
            {
                label: "用户名",
                query: "username",
                type: "text",
                placeholder: "用户名: 2-8位 字母数字"
            },
            {
                label: "密码",
                query: "password",
                type: "password",
                placeholder: "密码: 6-12位 最少包含一位(数字/大小写字母)"
            }
        ],
        btns: [
            {
                targetName: 'close',
                name: '取消'
            },
            {
                targetName: 'confirm',
                name: '提交',
                isSubmit: true
            }
        ]
    },
    "register": {
        title: '注册',
        formType: "register",
        formData: [
            {
                label: "用户名",
                query: "username",
                type: "text",
                placeholder: "用户名: 2-8位 字母数字"
            },
            {
                label: "密码",
                query: "password",
                type: "password",
                placeholder: "密码: 6-12位 最少包含一位(数字/大小写字母)"
            },
            {
                label: "确认密码",
                query: "repassword",
                type: "password",
                placeholder: "重新输入密码"
            },
            {
                label: "邮箱",
                query: "email",
                type: "email",
                placeholder: "绑定邮箱"
            }
        ],
        btns: [
            {
                targetName: 'close',
                name: '取消'
            },
            {
                targetName: 'confirm',
                name: '提交',
                isSubmit: true
            }
        ]
    },
    postCategory: {
        title: '添加分类',
        formType: "postCategory",
        formData: [
            {
                label: "名称",
                query: "name",
                type: "text",
                placeholder: "请输入分类名称"
            }
        ],
        btns: [
            {
                targetName: 'close',
                name: '取消'
            },
            {
                targetName: 'confirm',
                name: '提交',
                isSubmit: true
            }
        ]
    },
    putUserInfo: {
        title: '用户信息',
        formType: "putUserInfo",
        formData: [
            {
                label: "用户名",
                query: "username",
                type: "text",
                placeholder: "请输入用户名..."
            },
            {
                label: "昵称",
                query: "nickname",
                type: "text",
                placeholder: "请输入昵称"
            },
            {
                label: "邮箱",
                query: "email",
                type: "text",
                placeholder: "请输入邮箱"
            },
            {
                label: "个性签名",
                query: "desc",
                type: "text",
                placeholder: "请输入你的个性签名"
            },
        ],
        btns: [
            {
                targetName: 'confirm',
                name: '确认修改',
                isSubmit: true,
            }
        ]
    }
}