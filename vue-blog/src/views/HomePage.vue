<template>
    <el-container class="blog-page">
        <el-header class="blog-page-header">
            <BaseHeader />
        </el-header>
        <el-container class="blog-page-wrap">
            <el-row>
                <el-col :span="2" class="blog-circle-menu" >
                    <CircleMenu :menuBtns="menuBtns" v-if="menuBtns.length>0"/>
                </el-col>
                <el-col :xs="22" :sm="22" :md="14" :lg="14" :xl="12" style="height: 100%;">
                    <el-main class="blog-page-main" style="height: 100%;">
                        <transition class="animate__animated animate__fadeIn">
                            <router-view  v-if="isViewShow"> </router-view>
                        </transition>
                    </el-main>
                </el-col>
                <el-col :span="8" class="hidden-sm-and-down" >
                    <el-aside class="blog-page-aside">
                        <BaseAside />
                    </el-aside>
                </el-col>
            </el-row>
        </el-container>
        <!-- <el-footer class="blog-page-footer">footer</el-footer> -->
    </el-container>
    <BaseModal />
</template>
<script setup>
import BaseModal from "@/components/base/BaseModal.vue";
import BaseHeader from "@/components/base/BaseHeader.vue";
import BaseAside from "@/components/base/BaseAside.vue";
import CircleMenu from "@/components/menu/CircleMenu.vue";
import menuConfig from "@/config/menu.config";
import { useRoute } from "vue-router";
import { watch,ref, nextTick } from "vue";
const route = useRoute()
let menuBtns = ref([])
const isViewShow = ref(true)
watch(route, (to) => {
    //渲染菜单按钮
    menuBtns.value = menuConfig[to.name] ?? []
    //强制刷新页面
    refreshView()
}, { immediate: true })
async function refreshView() { 
    isViewShow.value = false;
    await nextTick()
    isViewShow.value = true;
}
</script>
<style lang="less">
.blog-page{
    background-color: #F5F7FA;
}
.blog-page-header{
    background-color: white;
}
.blog-circle-menu{
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
}
.blog-page-wrap{
    height: 80vh;
    padding-top: 10px;
}
    
.blog-page-footer{
    height: 10vh;
}
    
.blog-page-main{
    padding: 0;
}
.blog-page-aside{
    margin: 0 auto;
}
    
</style>