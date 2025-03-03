<template lang="">
   <van-card>
            <template #title>
                <h3 class="blog-m-article-title">{{article.author?.nickname}}</h3>
            </template>
            <template #desc>
                <p class="blog-m-article-body">{{article.date}}</p>
            </template>
            <template #thumb>
                <van-image
                round
                width="100%"
                height="100%"
                :src="article.author?.avatar"
                />
            </template>
            <template #num>
                <span class="blog-m-tool-like"><van-icon name="good-job-o" />{{article.like_num}}</span>
                <span class="blog-m-tool-comment"><van-icon name="chat-o" />{{article.comment_num}}</span>
                <span><van-icon name="label-o" />{{article.hit_num}}</span>
            </template>
        </van-card>
</template>
<script setup>
const { article } = defineProps({
    article:Object
})
</script>
<style lang="">
    
</style>