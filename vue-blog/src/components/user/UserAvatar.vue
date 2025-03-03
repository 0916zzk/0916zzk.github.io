<template lang="">
    <el-menu-item :disabled="true">
        <el-avatar :size="50" :src="useInfo.avatar"  @error="errorHandler">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
        </el-avatar>
        <svg @click="logout" t="1729396310774" class="blog-user-logout" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2970"><path d="M709.12 500.8a41.92 41.92 0 0 0-12.48-29.76l-147.52-144a41.6 41.6 0 0 0-58.24 59.52l74.56 72.64H128A41.6 41.6 0 0 0 128 544h437.44l-74.56 72.64a41.92 41.92 0 0 0 0 58.88 41.6 41.6 0 0 0 58.88 0l147.52-144a41.28 41.28 0 0 0 11.84-30.72z" p-id="2971" fill="#1296db"></path><path d="M843.84 86.4H624a41.6 41.6 0 0 0 0 83.2h219.84a10.56 10.56 0 0 1 10.56 10.56v663.68a10.56 10.56 0 0 1-10.56 10.56H624a41.6 41.6 0 0 0 0 83.2h219.84a94.08 94.08 0 0 0 93.76-93.76V180.16a94.08 94.08 0 0 0-93.76-93.76z" p-id="2972" fill="#1296db"></path></svg>
    </el-menu-item>
</template>
<script setup>
import { useUserStore } from "@/stores/user"
import { computed } from "vue";
import { useRouter } from "vue-router";
const router =  useRouter()
const userStore = useUserStore()
const useInfo = computed(() => userStore.userInfo)
const errorHandler = () => true
function logout() { 
    userStore.logout(router)
}
</script>
<style lang="less">
.blog-user-logout{
    height: 40px;
    width: 40px;
    margin: @white-space;
    padding: 3px;
    border: 1px solid #ccc;
    &:hover{
        transform: scale(1.2);
    }

}
</style>