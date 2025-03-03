<template lang="">
   <van-search
    v-model="value"
    placeholder="请输入搜索关键词"
    input-align="center"
    @search="searchArticle"
    />
</template>
<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const value = ref("")
const router = useRouter()
const route = useRoute()
function searchArticle() { 
    let fullpath = route.fullPath
    if (!fullpath.includes("?")) { 
        fullpath += "?"
    }
    if (fullpath.includes("q=")) {
        router.push(fullpath.replace(/(?<=q=)(.*)(?!&)/, value.value))
    } else { 
        router.push(`${fullpath}&q=${value.value}`)
    }
    value.value =""
}

</script>
<style lang="">
    
</style>