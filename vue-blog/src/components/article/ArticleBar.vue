<template>
    <div class="blog-article-bar">
            <span class="blog-info-item">
                <el-icon><EditPen /></el-icon>
                {{nickname}}
            </span>
            <span class="blog-info-item">
                <el-icon><Clock /></el-icon>{{date}}
            </span>
    </div>
</template>
<script setup>
let { nickname, date } = defineProps({
    nickname: {
        type: String,
        default:"佚名"
    },
    date: {
        type: String,
        default:"未知时间"
    },
})
</script>
<style lang="less">
.blog-article-bar{
    display: flex;
    align-items: center;
     justify-content: space-between;
     height: 50px;
     padding: 0 @white-space*2;
    margin-bottom: @white-space *2;
    background-color:#f5f5f5;     
}
.blog-info-item{
    display: flex;
    align-items: center;
    margin: 0 white-space;
}
   
</style>