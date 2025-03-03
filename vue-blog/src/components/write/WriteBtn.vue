<template >
    <div class="blog-write-btn">
        <a href="javascript:;" class="blog-write-save" @click="emit('resetArticle')">重置</a>
        <a href="javascript:;" class="blog-write-submit" @click="submitArticle">提交</a>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { inject } from 'vue';
const ERROR_MAP = {
    title: '标题不能为空',
    content: '内容不能为空',
    column: '请选择分类'
}
const axios = inject("axios")
const router = useRouter()
const { category, valueHtml, title } = defineProps({
    category:String,
    valueHtml:String,
    title:String,
})
const emit =defineEmits(["resetArticle"])
async function submitArticle() { 
    let data = validateArticle()
    if (!data) return
    try {
        let result = await axios({ type: 'postArticle', data })
        router.push(`/article/${result._id}`)
    } catch (e) {
        console.log(e);
    }
}
function validateArticle() { 
    let data = {}
    data.category = category;
    let coverURL =valueHtml.match(/<img src="([^"']*)"/)?.[1] || undefined
    data.title = title
    data.body = valueHtml

    if (coverURL) {
        data.cover = coverURL
    }
    console.log(data);
    
    Object.entries(data).some(([key, value]) => {
        let isPass = !value || value.trim().length === 0
        if (isPass) {
            ElNotification({
                title: '上传文章失败',
                message: ERROR_MAP[key],
                position: "top-right",
                type: 'error',
            })
            data = null
        }
        return isPass
    })
    return data
}
</script>
<style lang="less">
.blog-write-btn{
    display: flex;
    a{
        flex: 1;
        line-height: 50px;
        font-size: 20px;
        text-align: center;
        border: 1px solid @bg-motify-color;
        &:hover{
            background-color: @bg-motify-color;
            color: white;
        }
    }
}
</style>