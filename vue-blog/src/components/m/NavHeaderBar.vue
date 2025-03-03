<template>
<van-nav-bar :title="title" left-text="返回" left-arrow @click-left="router.go(-1)">
    <template >
        <van-icon name="search" size="18" />
    </template>
    <template #right v-if="button">
        <van-button plain type="primary" size="small" @click="handleClick">
            <van-icon name="more-o"/>  评论
        </van-button>  
    </template>
</van-nav-bar>
</template>
<script setup>
import bus from "@/util/bus" 
import { useRouter } from "vue-router";
const router = useRouter()
const { title,button,handler} = defineProps({
    title: String,
    button: Boolean,
    handler:String
})

function handleClick() {
    bus.emit(handler)
}
</script>
<style lang="">
    
</style>