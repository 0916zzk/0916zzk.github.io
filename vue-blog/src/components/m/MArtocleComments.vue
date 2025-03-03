<template>
    <div class="blog-m-comments" ref="container">
        <van-cell-group inset>
            <van-field
                v-model="commentVal"
                center
                clearable
                placeholder="评论有温暖，善意有回报">
                <template #button>
                <van-button size="small" type="primary" @click="postComment">发送评论</van-button>
                </template>
            </van-field>
        </van-cell-group>
        <van-divider :style="{ color: '#ccc', borderColor: '#ccc'}"/>
        <template v-if="comments.length!==0">
            <MCommentItem v-for="comment in comments" :key="comment._id" :comment="comment" />
        </template>
        <van-empty v-else image="error" description="暂无评论" />
        
    </div>
    
</template>
<script setup>
import { ref } from 'vue';
import MCommentItem from './MCommentItem.vue';
import bus from "@/util/bus"
const container = ref(null)
const { comments } = defineProps({
    comments:Array
})
const commentVal = ref("")
async function postComment() { 
    bus.emit("maddComment", commentVal.value)
    commentVal.value = ""
}
</script>
<style lang="less">
.blog-m-comments{
    height:50vh;
    overflow-y: auto;
}
</style>