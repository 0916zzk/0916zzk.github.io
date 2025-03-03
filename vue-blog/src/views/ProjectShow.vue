<template lang="">
    <el-card>
        <div class="blog-project">
            <el-card v-for="project in projects" :key=project.name class="project-item"> 
                <ProjectItem :project="project"/>
            </el-card>
        </div>
    </el-card>
</template>
<script setup>
import ProjectItem from '@/components/card/ProjectItem.vue';
const projects = [
    {
        name:"泡泡龙游戏",
        link: "/shootgame",
        imgURL: "/src/assets/image/shootGame.png",
        desc: "原生JS射击小游戏，击落相同颜色的球，就会得到相应的积分。通过本次案例练习，增加原生JS实现动画效果的实际开发经验",
        date:"2024-5-10"
    },
    {
        name:" 自定义播放器",
        link: "/automedia",
        imgURL: "/src/assets/image/media.png",
        desc: "利用H5新特性，制作自定义控件完成对视频播放的控制。可以实现调整播放进度，调节音量，静音，循环播放，全屏等功能，退出还后可记住播放进度。",
        date:"2024-7-1"
    }
]
</script>
<style lang="less">
.blog-project{
    max-height: 70vh;
}
.project-item{
    margin-bottom: @white-space;
}
</style>