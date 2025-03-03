<template>
    <div>
        <van-sticky :offset-top="0">
             <component :is="navMap[navType]" :title="title" :button="button" :handler="handler"></component>
        </van-sticky>
        <router-view class="blog-m-main" v-if="viewShow"></router-view>
        <FooterBar/>
        <MBaseDialog/>
    </div>
</template>
<script setup>
import NavSearchBar from '@/components/m/NavSearchBar.vue';
import NavHeaderBar from '@/components/m/NavHeaderBar.vue';
import MBaseDialog from '@/components/m/MBaseDialog.vue';
import { nextTick, ref,watch } from 'vue';
import FooterBar from './FooterBar.vue';
import { useRoute } from 'vue-router';
const navMap = ref({NavSearchBar,NavHeaderBar})
const navType = ref("")
const title = ref("主页")
const button = ref(false)
const handler = ref("")
const route = useRoute()
const viewShow = ref(true)
watch(route, async (to) => { 
    title.value = to.meta.title || ""
    navType.value = to.meta.navType || "NavHeaderBar"
    button.value = to.meta.button || false
    handler.value = to.meta.handler || ""
    viewShow.value = false
    await nextTick()
    viewShow.value=true
}, {
    immediate:true
})
</script>
<style lang="less">
.blog-m-main{
    height: calc(100vh - 96px);
    background-color: #ebf0f7;
    overflow-y: auto;
}
.van-nav-bar{
    background-color: #ebf0f7
}
</style>