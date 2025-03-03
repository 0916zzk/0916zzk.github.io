<template lang="">
    <el-sub-menu>
        <template #title>请先登录..</template>
        <el-menu-item @click="refreshModal('login')">登录</el-menu-item>
        <el-menu-item @click="refreshModal('register')">注册</el-menu-item>
    </el-sub-menu>
</template>
<script setup>
import { useModalStore } from '@/stores/modal'

let { open } = useModalStore()
function refreshModal(type) { 
    open(type)
}
</script>
<style lang="">
    
</style>