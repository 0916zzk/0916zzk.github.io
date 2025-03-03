<template lang="">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="articles.length!==0">
        <van-list
            v-model:loading="loading"
            :finished="true"
        >
            <MArticleItem v-for="article in articles" :key="article._id" :article="article"/>
        </van-list>
    </van-pull-refresh>
    <van-empty v-else image="error" description="暂无文章" />
</template>
<script setup>
import { inject, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const type = route.meta.type || "like"
const articles = ref([])
const axios = inject("axios")
getArticles()
async function getArticles() {
    try {
        let res =await axios({
            type: type + "Articles",
        })
        articles.value = res.list
        return res.total
    } catch (e) { 
        console.log(e);
    }
}
const refreshing = ref(false)
async function onRefresh() { 
    await getArticles()
    refreshing.value = false
}
</script>
<style lang="">
    
</style>