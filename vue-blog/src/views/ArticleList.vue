<template lang="">
    <el-empty description="暂无文章..." v-if="articles.length===0">
        <el-button type="primary" @click="$router.push(`/write?categoryid=${categoryId}`)">去写一篇...</el-button>
    </el-empty>
    <el-scrollbar height="80vh" @scroll="throttle_loadMore" ref="scrollWrap" v-else>
        <div ref="scrollAll">
            <el-card class="blog-content-item"
                v-for="item in articles"
                :key="item._id">
                <router-link :to="`/article/${item._id}`">
                    <ArticleItem :article="item" />
                </router-link>
            </el-card>
        </div>
    </el-scrollbar>
</template>
<script setup>
import ArticleItem from '@/components/card/ArticleItem.vue';
import { inject, ref } from 'vue';
import loadsh from "@/util/lodsh"
import { useRoute } from 'vue-router';
import QS from "qs"
// import bus from "@/util/bus"
const { throttle,isEmpty}=loadsh
const axios= inject("axios")
const articles = ref([])
const page = ref(1)
const size = ref(2)
const loading = ref(true)


const route = useRoute()
const categoryId = ref(route.query?.categoryId)
const q = ref(route.query?.q)
getArticles()

const scrollAll= ref(null)
const scrollWrap = ref(null)
const throttle_loadMore = throttle(loadMore, 50)
async function loadMore(offset) {    
    //加载文章的过程中，不能重触发
    if (loading.value === false) { 
        //滑动到底部
        if (scrollAll.value.clientHeight - offset.scrollTop- 10 <= scrollWrap.value.wrapRef.clientHeight) { 
            loading.value = true
            //获取文章后，将loading置为false
            getArticles()
        }
        
    }
}
async function getArticles() { 
    let data = {}
    //stringify序列化不会将undefined转化到字符串中
    if (q.value) { 
        data.q = q.value
    }
    if (categoryId.value) {
        data.category = categoryId.value
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
        let total = res.total
        if (page.value * size.value > total) return 
        loading.value=false
    } catch (e) { 
        console.log(e);
    }
}
// function searchArticle(query) { 
//     q.value=query
//     articles.value = []
//     page.value=1
//     getArticles(q)
// }
// onMounted(() => { 
//     bus.on("searchArticle",searchArticle)
// })
// onUnmounted(() => { 
//     bus.off("searchArticle",searchArticle)
// })
</script>
<style lang="less">
.blog-content-item{
    margin-bottom:10px;
}
    
</style>