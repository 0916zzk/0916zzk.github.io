<template>
    <div>
        <div class="blog-m-user">
            <van-card @click="handleClick" :style="{'margin-bottom':'10px'}">
                <template #title>
                    <h3 class="blog-m-article-title">{{user.nickname||"点击登录..."}}</h3>
                </template>
                <template #desc>
                    <p class="blog-m-article-body">{{isLogin?`账号：${user.username}`:``}}</p>
                </template>
                <template #thumb>
                    <van-image
                    width="100%"
                    height="100%"
                    :src="user.avatar"
                    />
                </template>
                <template #num>
                   {{ isLogin?"点击修改信息":'' }}
                </template>
            </van-card>
            <router-view></router-view>
        </div>
    </div>
</template>
<script setup>
import { useUserStore } from '@/stores/user';
import { computed} from 'vue';
import bus from "@/util/bus"
import { storeToRefs } from 'pinia';
const userStore = useUserStore()
const isLogin = computed(() => { 
    return !!userStore.Token
})

const { userInfo:user} = storeToRefs(userStore)

function handleClick() { 
    if (!isLogin.value) {
        bus.emit("showDialog", "login")
    } else { 
        bus.emit("showDialog", "putUserInfo")
    }
}
</script>
<style lang="less">
// .blog-m-user{
//     height:100%;
//     background-color:white;
// }
</style>
