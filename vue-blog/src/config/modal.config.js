export default {
    "login": {
        title: '登录',
        formType: "login",
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
        needUpdate: true,
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
        btns: [
            {
                targetName: 'confirm',
                name: '确认修改',
                isSubmit: true,
            }
        ]
    }
}