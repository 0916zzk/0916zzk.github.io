<template lang="">
    <CommentInput @addComment="addComment" />
    <CommentItem v-for="comment in comments" :key="comment._id" :comment="comment"/>
</template>
<script setup>
import CommentItem from './CommentItem.vue';
import CommentInput from "./CommentInput.vue"

let {comments } = defineProps({
    comments: {
        type:Array
    }
})
let emit = defineEmits("addComment")
function addComment(content) { 
    emit("addComment",content)
}
</script>
<style lang="less">

</style>