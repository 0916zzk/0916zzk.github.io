<template>
    <div class="header-info">
        <div class="header-heading">
            <h3 class="header-title">标题</h3>
        </div>
        <div class="header-body">
            <input id="blog-write-title" class="blog-write--input" placeholder="请输入文章标题..." type="text" v-model="title">
        </div>
    </div>
    <div style="border: 1px solid #ccc; flex:1;overflow: hidden;">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated"
            @onChange="emit('changeContent', valueHtml)" />
    </div>
</template>
<script setup>
/*eslint no-undef: "warn"*/
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, shallowRef, ref } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElNotification } from 'element-plus'
import store from 'store'
import baseConfig from '@/config/base.config'
const emit = defineEmits(["changeContent", "changeTitle"])
const { TOKEN_NAME } = baseConfig
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const mode = ref("single")
// 内容 HTML
const toolbarConfig = {}
const editorConfig = {
    scroll: true,
    placeholder: 'Type here...',
    MENU_CONF: {}
}
editorConfig.MENU_CONF['uploadImage'] = {
    server: import.meta.env.VITE_UPLOAD_FILE_URL,
    fieldName: 'file',
    maxFileSize: 1 * 1024 * 1024, // 1M
    maxNumberOfFiles: 1,
    allowedFileTypes: ['image/*'],
    headers: {
        'Authorization': `Bearer ${store.get(TOKEN_NAME)}`,
    },
    timeout: 5 * 1000, // 5 秒,
    customInsert(res, insertFn) {
        insertFn(res.data)
    },
    // 单个文件上传失败
    onError(file) {
        ElNotification({
            title: '上传失败',
            message: `${file.name} 上传失败`,
            position: "top-right",
            type: 'error',
        })
    },
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
const valueHtml = defineModel("valueHtml")
const title = defineModel("title")

</script>
<style lang="less">
.header-info {
    display: flex;
    flex-direction: column;
    height: 80px;
    border-color: @bg-motify-color;
    margin-bottom: @white-space;
}

.header-info>.header-heading {
    padding: 0 @white-space;
    border-color: @bg-motify-color;
    line-height: 40px;
    font-size: 26px;
    color: @bg-motify-color;
    background-color: @bg-theme-color;
}

.header-info>.header-body {
    flex: 1;
    padding: 0;
    font-size: 30px;
    color: @bg-motify-color;

    input {
        height: 100%;
        width: 100%;
        padding: 0 10px;
        border: 0;
        outline: 0;
    }
}

[data-w-e-textarea] {
    max-height: calc(100% - 90px) !important;
}
</style>