<template lang="">
    <transition-group name="menu" tag="ul" class="blog-menu-wrap" appear>
        <el-button  v-for="btn in menuBtns" :key="btn.component" circle size="large" class="menu-btn" @click="handleClick(btn)">
            <el-icon  :size="28" color="rgb(121.3, 187.1, 255)">
                <component :is="isActive?btn.activeComponent:btn.component" v-if="btn.active"></component>         
                <component :is="btn.component" v-else></component>                
            </el-icon>
        </el-button>
    </transition-group>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useLikeStore } from "@/stores/like"
import { useModalStore } from '@/stores/modal'
import bus from "@/util/bus"
import { computed } from 'vue';
let { open } = useModalStore()
let { menuBtns} = defineProps({
    menuBtns: {
        type:Array
    }
})

const likeStore = useLikeStore()
const route = useRoute()
const isActive = computed(() => { 
    let aid = route.params.id    
    return likeStore.isLike(aid)
})
const router = useRouter()
const handleMap = {
    postCategory() {
        open("postCategory")
    },
    turnToComment() {
        bus.emit("turnToComment")
    },
    postLike() {
        let aid = route.params.id
        if (isActive.value) {
            likeStore.removeLikes(aid)
        } else { 
            likeStore.addLikes(aid)
        }
    },

    backToIndex() { 
        router.push("/index")
    }
}
function handleClick(item) {
    if (item.link) { 
        router.push(item.link)
    }
    if (item.handler) { 
        handleMap[item.handler]&& handleMap[item.handler]()
    }
 }
</script>
<style lang="less">
.blog-menu-wrap{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.menu-btn{
    margin-bottom: 10px;
    font: 28px;
}
.menu-move,
.menu-enter-active,
.menu-leave-active {
  transition: all 0.5s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.menu-leave-active {
  position: absolute;
}
</style>