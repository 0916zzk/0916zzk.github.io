<template lang="">
    <section class="blog-content-article" :data-article-id="articleInfo._id">
        <h2 class=" blog-article-title">{{articleInfo.title}}</h2>
        <p class="blog-article-time">
            <i class="glyphicon glyphicon-time"></i>
            {{articleInfo.date}}
        </p>
        <div class="blog-article-pic">
            <img :src="articleInfo.cover" alt="">
        </div>
        <p class="blog-article-desc">
            {{content}}
        </p>
        <div class="blog-article-bottom">
            <div class="blog-article-author">
                <el-icon><StarFilled /></el-icon>
                {{articleInfo.author.nickname}}
            </div>
            <div class="blog-article-util">
                <span class="blog-tools-like">点赞（{{articleInfo.like_num}}）</span>
                <span class="blog-tools-conment">评论（{{articleInfo.comment_num}}）</span>
            </div>
        </div>
    </section>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps(["article"])
const articleInfo = props.article
const content = computed(() => { 
    return props.article.body.replace(/<[^<>]+>/g,"")
})
</script>
<style lang="less">

.blog-content-article{
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
    background-color: @bg-theme-color;
    box-shadow: inset 0 0 10px white;
    border-radius:@border-normal-radius;
    cursor: pointer;
}
    

.blog-article-time{
    margin: 10px 0;
}
    
.blog-article-pic{
    height: 200px;
    img{
        height: 100%;
        width: auto;
    }
       
}
    
    
    
.blog-article-desc{
    text-indent: 1em;
    // 超出3行显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;/*省略几行写几*/
    -webkit-box-orient: vertical;
    margin: 10px 0;
    color: @font-normal-color;
}
    
    
.blog-article-bottom{
    display: flex;
    width: 100%;
    padding: 0 10px;
    justify-content: space-between;
    color: @font-normal-color;
}
    
        
</style>