<template>
    <div>
        <h2 class="blog-chat-header">聊天室（{{ count }}）</h2>
        <el-divider />
    </div>
</template>
<script setup>
const { count } =  defineProps({
    count:Number
})
</script>
<style lang="less">
.blog-chat-header{
    text-align: center;
    padding: @white-space;
    font-size: 28px;
}
</style>