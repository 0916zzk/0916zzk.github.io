<template>
    <div class="blog-m-article-info">
        <MArticleToobar :article="article"/>
        <van-divider :style="{ color: '#ccc', borderColor: '#ccc'}"/>
        <article class="markdown-body" v-html="article.body"></article>
        <van-action-sheet v-model:show="commentShow" title="评论区">
          <MArtocleComments :comments="comments"/>
        </van-action-sheet>
    </div>
</template>
<script setup>
import MArticleToobar from "@/components/m/MArticleToobar.vue";
import MArtocleComments from "@/components/m/MArtocleComments.vue";
import bus from "@/util/bus"
import { ref,inject, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user"
import { showNotify } from 'vant';


bus.on("mTurnToComment", mTurnToComment)
onBeforeUnmount(() => {
  bus.off("mTurnToComment",mTurnToComment)
})
const userStore = useUserStore()
const commentShow = ref(false)
function mTurnToComment() { 
  if (!userStore.Token) { 
    // 主要通知
    showNotify({ type: 'warning', message: '请先登录' });
    bus.emit("showDialog","login")
    return 
  }
  commentShow.value=true
}
const axios = inject("axios")
const route = useRoute()
const article = ref({})
const comments = ref([])
async function getArticle() { 
  try {
    const res =await axios({ type: "article", data: { id: route.params.id } })
    article.value = res
    comments.value =article.value.comments
  } catch (e) {
    console.log(e);
  }
}
bus.on("maddComment",addComment)
async function addComment(content) {
  if (!content) { 
        showNotify({ type: 'warning', message: '不能发表空评论' })
        return false
    }
    try {
        await axios({
            type: "postComment",
            data: {  
                content:content,
                aid:article.value._id
            }
        })
      await getArticle()
      showNotify({ type: 'success', message: '发表评论成功' })
    } catch (e) { 
        console.log(e.message);
    }
}
getArticle()
</script>
<style lang="less">
.blog-m-article-info{
  min-height: 100%;
  background-color: white;
  padding:5px
}
.van-notify--warning {
  background-color: #ff976a;
}
.van-notify--success{
  background-color: #07c160;
}
</style>