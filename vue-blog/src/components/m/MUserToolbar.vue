<template lang="">
    <div>
        <van-cell title="点赞列表" is-link to="/m/user/like"/>
        <van-cell title="我的文章" is-link to="/m/user/write"/>
        <van-button type="primary" plain  block class="blog-m-logout" v-if="isLogin" @click="userStore.logout">退出登录</van-button>
    </div>
</template>
<script setup>
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const userStore = useUserStore()
const isLogin = computed(() => userStore.Token)

</script>
<style lang="less">
.blog-m-logout{
    margin-top: 10px;
}
</style>