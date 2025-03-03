<template>
    <div>
        <van-tabs v-model:active="active">
            <van-tab v-for="category in categories"  :title="category.name" :name="category.id" :key="category.id">
                <MArticleList :categoryId="active"/>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script setup>
import { inject, onBeforeMount, ref } from 'vue';
import MArticleList from './MArticleList.vue';
const axios = inject("axios")
const categories = ref([])
const active = ref("")


async function getCategories() {
    let res = await axios({
            type:"category"
        })
    categories.value = res.list.map(item => { 
        return {
            "name": item.name,
            "value": item.aids.length,
            "id":item._id
        }
    })
    active.value=categories.value[0].id
}
onBeforeMount(() => { 
    getCategories()
})
</script>
<style lang="less">
    
</style>