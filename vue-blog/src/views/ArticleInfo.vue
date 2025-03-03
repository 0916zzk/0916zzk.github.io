<template>
    <el-scrollbar height="80vh" >
      <el-card>
        <div class="blog-article">
            <div class="blog-article-head">
                <el-icon @click="goBack"><ArrowLeftBold /></el-icon>
                <h2>{{article.title}}</h2>
            </div>
            <div class="blog-article typo">
                <ArticleBar :date="article.date" :nickname="article.author?.nickname"/>
                <div class="blog-article-wrap" v-html="article.body"></div>
            </div>
            <CommentList :comments="comments" @addComment="addComment"/>
        </div>
      </el-card>
    </el-scrollbar>
</template>
<script setup>
import ArticleBar from '@/components/article/ArticleBar.vue';
import { useRoute, useRouter } from 'vue-router';
import CommentList from '@/components/comment/CommentList.vue';
import { inject, ref } from 'vue';

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
getArticle()
//返回按钮
let router=useRouter()
function goBack() { 
    router.push("/index")
}

//评论列表
async function addComment(content) {
  
  try {
    await axios({
      type: "postComment",
      data: {  
        content,
        aid:article.value._id
      }
    })
    await getArticle()
  } catch (e) { 
    console.log(e.message);
  }
}


</script>
<style lang="less">

.blog-article{
   // overflow-y:auto
  padding: @white-space*2;
  font-size: 16px;
}
 
.blog-article-wrap{
  min-height: 60vh;
}
.blog-article-head h2{
  font-size: 24px;
}
 
/* table 样式 */
table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
table td,
table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}
table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote 样式 */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
pre code {
  display: block;
}

/* ul ol 样式 */
ul,ol {
  margin: 10px 0 10px 20px;
}
.blog-article-head{
  display: flex;
  align-items: center;
  height: 50px;
  margin-bottom: 10px;
  padding: @white-space *2;
  i{
    margin-left: 10px;
    cursor: pointer;
  }
  h2{
    text-align: center;
    flex: 1;
  }
}
  
</style>