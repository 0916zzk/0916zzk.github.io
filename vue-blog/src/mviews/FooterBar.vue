<template lang="">
    <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o" name="index">
            <router-link :to="{name:'mIndex'}">主页</router-link>
        </van-tabbar-item>
        <van-tabbar-item icon="search" name="category">
            <router-link :to="{name:'mCategory'}">分类</router-link>
        </van-tabbar-item>
        <van-tabbar-item icon="friends-o" name="user">
            <router-link :to="'/m/user/index'">我的</router-link>
        </van-tabbar-item>
    </van-tabbar>
</template>
<script setup>
import { useUserStore } from '@/stores/user';
import { ref, watch,onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const userStore = useUserStore()
const active = ref("index")
const route = useRoute()
const router = useRouter()
watch(route, (to) => {         
    active.value=to.path.match(/\/m\/(.+)(?=\/)?/)[1]
})

onBeforeMount(async () => { 
    if (userStore.Token) { 
        await userStore.getUserInfo(router)
    }
})
</script>
<style lang="">
    
</style>