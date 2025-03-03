<template>
    <div class="blog-write-wrap">
        <div class="blog-write">
            <WriteContent v-model:valueHtml="valueHtml" v-model:title="title"></WriteContent>
            <WriteCategory  v-model:category="category" :categories="categories"/>
            <WriteBtn :category="category" :title="title" :valueHtml="valueHtml" @resetArticle="resetArticle"/>
        </div>
    </div>
</template>
<script setup>
import WriteCategory from '@/components/write/WriteCategory.vue'
import WriteContent from '@/components/write/WriteContent.vue'
import WriteBtn from '@/components/write/WriteBtn.vue'
import { ref, inject, onBeforeMount } from 'vue'
const {categoryid} = defineProps({
    categoryid: String
})

const axios = inject("axios")
const categories =ref([])
const category = ref(categoryid??"")
onBeforeMount(async () => { 
    try {
        let res = await axios({ type: 'category' })
        categories.value = res.list
     } catch (e) { 
        console.log(e);
    }
})

const valueHtml = ref("")
const title = ref("")
function resetArticle() {     
    valueHtml.value = ""
    title.value = ""
    category.value =""
}


</script>
<style lang="less">
.blog-write-wrap{
    height: 100%;
    padding:@white-space;
}
.blog-write{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px;
    border: 1px solid @bg-motify-color;
}
    

    
</style>