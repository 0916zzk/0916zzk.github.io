<template>
    <el-row>
        <el-col :span="24" class="hidden-sm-and-down">
            <el-menu :router="true" :default-active="activeIndex" mode="horizontal" :ellipsis="false"
                @select="handleSelect">
                <el-menu-item :disabled="true">
                    <img style="height: 50px;width:50px " src="@/assets/image/shuttle.png" alt="Element logo" />
                </el-menu-item>
                <el-menu-item index="/index">首页</el-menu-item>
                <el-menu-item index="/category">文章分类</el-menu-item>
                <el-menu-item index="/project">案例展示</el-menu-item>
                <el-menu-item index="/user" v-show="isLogin">个人信息</el-menu-item>
                <el-menu-item index="/chat" >聊天室</el-menu-item>
                <el-menu-item :disabled="true">
                    <el-input
                    v-model="searchContent"
                    style="width: 300px"
                    placeholder="Type something"
                    :prefix-icon="Search"
                    @keydown.enter="searchArticle"
                    />
                </el-menu-item>
                <component :is="Logincomponent"></component>
            </el-menu>
        </el-col>
        <el-col :span="24" class="hidden-md-and-up">
            <img style="display: block;height: 50px;width: 50px; margin:auto" src="@/assets/image/shuttle.png" alt="Element logo" />
        </el-col>
    </el-row>
    
</template>
<script setup>
import { ref } from 'vue';

const activeIndex = ref('/index');
import UserAvatar from "@/components/user/UserAvatar.vue";
import UserLogin from "@/components/user/UserLogin.vue";
import {onBeforeMount, computed,watch} from "vue"
import { useUserStore } from "@/stores/user"
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
const searchContent = ref("")
const userStore = useUserStore()
const isLogin = computed(() => !!userStore.Token)
const components = {
    UserAvatar,UserLogin
}
const Logincomponent = computed(()=>isLogin.value?components["UserAvatar"]:components["UserLogin"])
onBeforeMount(async () => { 
    if (userStore.Token) { 
        await userStore.getUserInfo(router)
    }
})

watch(route, (to) => { 
    activeIndex.value = to.path
}, {
    immediate:true
})
function searchArticle() { 
    let fullpath = route.fullPath
    if (!fullpath.includes("?")) { 
        fullpath += "?"
    }
    router.push(`${fullpath}&q=${searchContent.value}`)
    searchContent.value =""
}
</script>
<style lang="less"> 
.blog-page-header{
    height: 60px;
    padding: 0; 
    overflow:hidden;
    .blog-logo{
        width :50px;
        height: 50px;
    }  
}

 .el-menu{
    padding:0 30px;
}
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: 30px;
}
.el-menu--horizontal > .el-menu-item:nth-child(6){
    margin-right: auto;
    padding-right:30px;
}    
// .el-menu--horizontal>.el-menu-item:not(1){
//     font-size: 20px;
//     padding: 0 30px;
// }
</style>