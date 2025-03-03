<template lang="">
    <router-link  :to="project.link"  class="blog-project-item">
        <div class="blog-project-pic">
            <img :src="project.imgURL" alt="">
        </div>
        <div class="blog-project-desc">
            <p class="blog-project-head">{{project.desc}}</p>
            <div class="blog-project-bottom">
                <div class="project-left">
                    <span class="blog-project-name"> {{project.name}}</span>
                    <span class="blog-project-time">{{project.date}}</span>
                </div>
                <p class="project-right">
                    <i class="glyphicon glyphicon-ok-circle"></i>
                    点击体验
                </p>
            </div>
        </div>
    </router-link>
</template>
<script setup>
import { defineProps } from "vue"
const { project } = defineProps({
    project: Object
})
</script>
<style lang="less">
.blog-project-item{
    cursor: pointer;
    display: flex;
    margin: @white-space;
    box-shadow: 0 0 2px @bg-motify-color;
    &:hover{
        color: @font-head-color;
    }
        
}
    
.blog-project-pic{
    flex: 1;
    height: 200px;
    border-radius: @border-normal-radius;
    overflow: hidden;
    margin: 0 2*@white-space;
    img{
        height: 100%;
        width: 100%;
    }
        
}
.blog-project-desc{
    flex: 2.5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
    
.blog-project-head{
    font-size: @font-head-size;
}
    
.blog-project-bottom{
    display: flex;
    justify-content: space-between;
    padding: @white-space;
}
    
.blog-project-name{
    margin-right:2*@white-space;  
}
    
</style>