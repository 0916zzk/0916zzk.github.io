<template lang="">
   <div class="blog-comment-header">
        <div class="comment-heading">
            <h3 class="comment-title">请发表你的评论</h3>
        </div>
        <div class="comment-body">
            <textarea ref="conmment_input" class="blog-comment-input" placeholder="天青色等烟雨，评论区在等你..." v-model="content"></textarea>
            <a href="javascript:;" class="blog-comment-submit" @click="addComment">提交</a>
        </div>
    </div>
</template>
<script setup>
import { ref,onBeforeUnmount } from 'vue';
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/user';
import bus from "@/util/bus"
const store = useUserStore()
const content = ref("")
const emit = defineEmits("addComment")
function addComment() { 
    if (!store.Token) { 
        ElNotification({
            title: '评论失败',
            message: `请先登录`,
            position: "top-right",
            type: 'warning',
        })
        return false 
    }
    if (!content.value.trim()) {
        ElNotification({
            title: '评论失败',
            message: `不能发表空评论`,
            position: "top-right",
            type: 'warning',
        })
    } else { 
        content.value = ""
        ElNotification({
            title: '评论成功 ',
            message: `成功发表评论`,
            position: "top-right",
            type: 'success',
        })
        emit("addComment",content.value)
    }
}
const conmment_input = ref(null)
function turnToComment() { 
    conmment_input.value.focus()
}
bus.on("turnToComment", turnToComment)
onBeforeUnmount(() => { 
  bus.off("turnToComment", turnToComment)
})

console.log();
</script>
<style lang="less">
.blog-comment-header{
    border: 1px solid @bg-motify-color; 
    border-radius :8px;
    .comment-heading{
        padding:@white-space;
        border-bottom: 1px solid @bg-motify-color;
        background-color:@bg-theme-color;
        color: @bg-motify-color;
    }
        
}
    
.comment-body{
    display: flex;
    flex-direction: column;
}
    
.blog-comment-input{
    border: 0;
    font-size: @font-base-size;
    outline: 0;
    padding: @white-space;
    resize: none;
}
    
.blog-comment-submit{
    padding: @white-space 0;
    font-size: 28px;
    line-height: 35px;
    text-align: center;
    text-align: center;
    border-top: 1px solid @bg-motify-color ;
    color: @bg-motify-color; 
    &:hover{
        color: black ;
    }    
}    
     
</style>