export default {
    "login": [
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
    "register": [
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
            label: "邮箱",
            query: "email",
            type: "email",
            placeholder: "绑定邮箱"
        }
    ],
    postCategory: [
        {
            label: "名称",
            query: "name",
            type: "text",
            placeholder: "请输入分类名称"
        }
    ],
    putUserInfo: [
        {
            label: "用户名",
            query: "username",
            type: "text",
            placeholder: "请输入用户名...",
            readonly: true
        },
        {
            label: "头像",
            query: "avatar",
            upload: true
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
    ]
}