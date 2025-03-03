<template>
    <el-card>
        <ChatHeader :count="userCount"/>
        <ChatContent :chat-list="chatList" ref="chatcontent"/>
        <ChatInput v-model:content="inputMsg" @sendMsg="sendMsg"/>
    </el-card>
</template>
<script setup>
import ChatHeader from "@/components/chat/ChatHeader.vue";
import ChatContent from "@/components/chat/ChatContent.vue"
import ChatInput from "@/components/chat/ChatInput.vue"
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { ElNotification } from 'element-plus'
import lodash from "@/util/lodsh"
import { useRouter } from "vue-router";
const router = useRouter()
const { formatDate } = lodash
import socket from "@/core/socket";
import { useUserStore } from "@/stores/user"
const chatcontent = ref(null)

function scrolltoBottom() { 
    let top = chatcontent.value.$refs.chatwrap.offsetHeight
    chatcontent.value.$refs.chatref.setScrollTop(top)
}
const userStore = useUserStore()
const inputMsg = ref("")
const userCount = ref(0)
//content type isMe time nickname avatar
const chatList = ref([])

const nickname = ref("")
const avatar = ref("")
onMounted(async () => { 
    await login()
    addChatListener()
})

//登录聊天室
async function login() {
    if (!(socket.server && socket.server.connected)) {
        socket.connectSocekt()
        if (userStore.Token) { 
            let userInfo = await userStore.getUserInfo()
            socket.server.emit("login", { uid: userInfo._id, nickname: userInfo.nickname, avatar:userInfo.avatar })
            socket.server.on("other login",async function () {
                userStore.logout(router)
                ElNotification({
                    title: '异地登录',
                    message: `您的帐号已在其他地方登录`,
                    position: "top-right",
                    type: 'error',
                })
                router.push("/index")
            })
        } else {
            socket.server.emit("login", {})
            onBeforeUnmount(() => { 
                //关闭页面后自动退出聊天室
                socket.server.close()
            })
        } 
    }
    socket.server.emit("enterChat")
}
//发送消息
async function sendMsg() { 
    let content = inputMsg.value
    if (!content.trim()) { 
        ElNotification({
            title: '发送失败',
            message: `不能发送空内容`,
            position: "top-right",
            type: 'warning',
        })
        return
    }
    inputMsg.value = ""
    chatList.value.push({
        nickname: nickname.value,
        avatar:avatar.value,
        content, isMe: true, type: "message",
        time:formatDate(new Date())
    })
    socket.server.emit("send", content)
    await nextTick()
    scrolltoBottom()
}
function addChatListener() { 
    //自己登陆聊天室
    socket.server.on("you enter", (name,ava) => {
        nickname.value = name
        avatar.value = ava
        ElNotification({
            title: '登录成功',
            message: `欢迎进入聊天室，${nickname.value}`,
            position: "top-right",
            type: 'success',
        })
    })
    //其他人登录聊天室
    socket.server.on("entered", (nickname,count) => {
        logAgent(nickname,count,true)
    })
    //其他人退出聊天室
    socket.server.on("logout", (nickname,count) => {
        logAgent(nickname,count,false)
    })
    function logAgent(nickname,count,isLogin) { 
        chatList.value.push({
            content: `${nickname}${isLogin?"上线啦":"退出聊天室"}` ,
            type: "action"
        })
        userCount.value=count
    }
    //接收其他人的消息
    socket.server.on("chat", async ({ message:content,nickname,avatar,time}) => {
        chatList.value.push({
            nickname,avatar,
            content, isMe: false, type: "message",
            time
        })
        await nextTick()
        scrolltoBottom()
    })
}

</script>
<style>
    
</style>