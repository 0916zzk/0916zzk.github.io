<template lang="">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="articles.length!==0">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <MArticleItem v-for="article in articles" :key="article._id" :article="article"/>
        </van-list>
    </van-pull-refresh>
    <van-empty v-else image="error" description="暂无文章" />

</template>
<script setup>
import MArticleItem from '@/components/m/MArticleItem.vue';
import { inject, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import lodsh from '@/util/lodsh';
import QS from "qs"
const {categoryId } = defineProps({
    categoryId:String
})
const { isEmpty } = lodsh
const route = useRoute()
const q = ref(route.query?.q)
const axios = inject("axios")
const size = ref(7)
const page = ref(1)
const articles = ref([])
onBeforeMount(() => { 
    getArticles()
})
watch(route, (() => { 
    page.value = 1
    articles.value = []
    getArticles()
}))
const refreshing = ref(false)
async function onRefresh() { 
    articles.value = []
    page.value = 1
    await getArticles()
    refreshing.value = false
}
const loading = ref(false)
const finished = ref(false)
async function onLoad() { 
    let total = await getArticles()
    loading.value=false
    if ((page.value - 1)* size.value > total) { 
        finished.value = true
    }
}
async function getArticles() {
    let data = {}
    //stringify序列化不会将undefined转化到字符串中
    if (q.value) { 
        data.q = q.value
    }
    if (categoryId) {
        data.category = categoryId
    }
    let query = isEmpty(data) ? undefined : QS.stringify(data)
    data = {query}
    try {
        let res =await axios({
            type: "articles",
            data: {
                size:size.value,
                page: page.value++,
                ...data
            }
        })
        articles.value.push(...res.list)
        return res.total
        
    } catch (e) { 
        console.log(e);
    }
}
</script>
<style lang="less">
.van-pull-refresh{
    overflow-y:auto;
}
</style>