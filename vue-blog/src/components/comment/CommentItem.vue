<template>
    <div class="blog-comment-item">
        <div class="blog-comment-user">
            <div class="blog-comment-avarar">
                <img :src="comment.uid.avatar" alt="">
            </div>
            <span class="blog-comment-nickname">{{comment.uid.nickname}}</span>
        </div>
        <p class="blog-comment-info">{{comment.content}}</p>
        <p class="blog-comment-time">{{comment.date}}</p>
    </div>
</template>
<script setup>
let {comment} = defineProps({
    comment: {
        type: Object,
        default: () => { 
            return {
                uid:{}
            }
        }
    }
})
</script>
<style lang="less">

.blog-comment-item{
    background-color:#f5f5f5;
    margin: @white-space 0;
    padding: @white-space;
    box-shadow: 0 0 1px @bg-motify-color ;
}
   
.blog-comment-user{
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid @bg-motify-color;
    .blog-comment-avarar{
        overflow: hidden;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        margin-right: @white-space;
    }
        
}
    
.blog-comment-info{
    margin: @white-space 0;
    padding: 0 @white-space;
    font-size: @font-base-size;
}
   
.blog-comment-time{
    text-align: end;
    padding: 0 @white-space;  
}
     
</style>