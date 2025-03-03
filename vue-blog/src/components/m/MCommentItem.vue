<template>
    <div class="blog-v-comment-item">
        <van-image
            round
            width="30px"
            height="30px"
            :src="comment.uid.avatar"
        />
        <div class="blog-v-comment-right">
            <p class="light">{{ comment.uid.nickname }}</p>
            <p  class="blog-v-comment-content">{{ comment.content }}</p>
            <p class="light">{{ comment.date }}</p>
        </div>
    </div>
</template>
<script setup>
const {comment } = defineProps({
    comment:Object
})
</script>
<style lang="less">
.blog-v-comment-item{
    padding: 10px;
    margin-bottom: 8px;
    display: flex;
}
.blog-v-comment-right{
    display: flex;
    flex-direction: column;
    margin-left: 5px;
}
.blog-v-comment-content{
    margin: 8px 0;
}
.light{
    color: #ccc;
    font-size: 12px;
}
</style>