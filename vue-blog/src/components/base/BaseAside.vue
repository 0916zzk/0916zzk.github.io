<template lang="">
    <el-card style="max-width: 480px">
        <div class="blog-user-box" v-if="isLogin">
            <div class="blog-user-avatar">
                <img :src="avatar" alt="">
            </div>
            <h4 class="blog-user-title">{{nickname}}</h4>
            <div class="blog-user-status">
                <div class="blog-status-article">
                    <p class="blog-article-num">{{articleNum}}</p>
                    <p>文章</p>
                </div>
                <div class="blog-status-classify">
                    <p class="blog-classify-num">{{categoryNum}}</p>
                    <p>专栏</p>
                </div>
            </div>
            <p class="blog-user-desc">{{ desc??"这个人很懒，什么也没留下 ....."}}</p>
        </div>
        <div class="blog-user-box" v-else>
            <div class="blog-user-avatar">
                <img src="@/assets/image/avatar_default.png" alt="">
            </div>
            <h4 class="blog-user-title">请先登录...</h4>
            <div class="blog-user-status">
                <div class="blog-status-article">
                    <p class="blog-article-num">0</p>
                    <p>文章</p>
                </div>
                <div class="blog-status-classify">
                    <p class="blog-classify-num">0</p>
                    <p>专栏</p>
                </div>
            </div>
            <p class="blog-user-desc">这个人很懒，什么也没留下 .....</p>
        </div>
    </el-card>
    

</template>
<script setup>
import { useUserStore } from '@/stores/user';
import { computed} from 'vue';
const store = useUserStore()
const isLogin = computed(() => !!store.Token)
const avatar = computed(()=>store.userInfo.avatar)
const nickname = computed(()=>store.userInfo.nickname)
const articleNum = computed(()=>store.userInfo.articleNum)
const categoryNum = computed(()=>store.userInfo.categoryNum)
const desc = computed(()=>store.userInfo.desc)

</script>
<style lang="less">     

.blog-user-box{
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    padding: 20px;
    background-color: @bg-theme-color;
    box-shadow: 0 0 4px @bg-theme-color;
    border-radius: @border-normal-radius;
}
   
    
.blog-user-avatar{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    box-shadow: 0 0 20px @bg-motify-color;
    overflow: hidden;
    cursor: pointer;
    &:hover{
        transform: scale(1.01);
    } 
}
    

.blog-user-title{
    font-size: @font-head-size;
    margin: 2*@white-space 0;
}
    
    
.blog-user-status{
    display: flex;
    justify-content: center;
    text-align: center;
    .blog-status-article{
        padding-right: @white-space * 2;
        position: relative;
        .blog-article-num{
            font-weight: bold
        }   
        &:after{
            content: "";
            position: absolute;
            right: 0;
            top: 0;
            width: 1px;
            height: 80%;
            background-color: @bg-motify-color;
        }  
    }
    .blog-status-classify{
        padding-left: 20px;
        .blog-classify-num{
            font-weight: bold
        }
            
    }
    .blog-user-desc{
        padding: 5px;
        text-align: start;
        text-indent: .5em;
        color: @font-normal-color;
    }    
}
    
            
        
        
    
            
    
    
</style>