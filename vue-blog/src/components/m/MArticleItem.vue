<template lang="">
    <router-link class="blog-m-article-item" :to="{name:'mArticle',params:{id:article._id}}">
        <van-card>
            <template #title>
                <h3 class="blog-m-article-title">{{article.title}}</h3>
            </template>
            <template #desc>
                <p class="blog-m-article-body">{{content}}</p>
            </template>
            <template #thumb>
                <van-image
                width="100%"
                height="100%"
                :src="article.cover"
                />
            </template>
            <template #tags>
                <van-tag plain type="primary">{{article.category.name}}</van-tag>
            </template>
            <template #price>
                <span class="blog-m-tool-like"><van-icon name="good-job-o" />{{article.like_num}}</span>
                <span class="blog-m-tool-comment"><van-icon name="chat-o" />{{article.comment_num}}</span>
                <span><van-icon name="label-o" />{{article.hit_num}}</span>
            </template>
            <template #num>
                <span><van-icon name="user-o" />{{article.author.nickname}}</span>
            </template>
        </van-card>
    </router-link>
     

</template>
<script setup>
import { computed } from 'vue';

const { article } = defineProps({
    article:Object
})
const content = computed(() => { 
    return article.body.replace(/<[^<>]+>/g,"")
})
</script>
<style lang="less">
.blog-m-article-item .van-card{
    background-color: white;
    margin: 5px;
}
.blog-m-article-title{
    font-size: 1.18em;
}
.blog-m-article-body{
    text-indent: 1em;
    // 超出3行显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;/*省略几行写几*/
    -webkit-box-orient: vertical;
    margin: 10px 0;
    color: @font-normal-color;
}
.blog-m-tool-like,.blog-m-tool-comment{
    margin-right: 5px
}
</style>