<template lang="">
   <el-form :model="form" label-width="auto" ref="elform">
    <el-form-item v-for="item in formData" :key="item.query" :label="item.label"
    :prop="item.query"
    :rules="item.rules" :show-message="true">
        <el-upload
          v-if="item.upload"
          ref="uplaod"
          class="avatar-uploader"
          :action="avatarPath"
          :headers="{Authorization:`Bearer ${store.Token}`}"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-error="handleAvatarError"
        >
          <img v-if="form[item['query']]" :src="form[item['query']]" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon avatar"><Plus /></el-icon>
        </el-upload>
        <el-input v-else v-model="form[item['query']]" autocomplete="off" :type="item.type"  :placeholder="item.placeholder" :disabled="item.readonly" />
      </el-form-item>
    </el-form>
</template>
<script setup>
import { ref, defineProps, computed,watch,defineExpose } from 'vue';
import formConfig from '@/config/form.config';
import validateConfig from "@/config/validate.config"
import { useUserStore } from "@/stores/user"
import { ElNotification } from 'element-plus'
const avatarPath = ref(import.meta.env.VITE_UPLOAD_USER_URL)
const form = ref({})
const uplaod = ref(null)
const props = defineProps(["type"])
defineExpose({form})
const elform=ref(null)
const formData = computed(() => { 
  return formConfig[props.type].map((item) => {
    return {
      ...item,
      rules:validateConfig[item.query]
    }
  })
})

const store = useUserStore()
watch(() => props.type, async (newVal) => { 
  const info = await store.getUserInfo()
  form.value = formConfig[newVal].reduce((acc, cur) => {
    acc[cur.query] = info[cur.query]??""
    return acc
  }, {})
  elform.value?.resetFields()
}, {
  immediate:true
})
function handleAvatarSuccess(res) {
  form.value.avatar = res.data
}
function  handleAvatarError (err) {
  ElNotification({
    title: '上传失败',
    message: JSON.parse(err.message)?.message,
    position: "top-right",
    type: 'error',
  })
}
function beforeAvatarUpload (file) {
  // 上传前 限制文件大小和文件类型
  let { size, type } = file
  let isPass = true
  isPass = /image/g.test(type)
  isPass = isPass && size < 5 * 1024 * 1024 
  if (!isPass) {
    let errMsg = /image/g.test(type) ? "文件不得大于5M" : "请选择图片文件"
    ElNotification({
      title: '上传错误',
      message: errMsg,
      position: "top-right",
      type: 'error',
    })
    uplaod.value.abort(file)
    return false
  }
}

</script>
<style lang="less">
.avatar-uploader .avatar {
  width: 20vw;
  height: 20vw;
  max-width: 178px;
  max-height: 178px;
  display: block;
  box-shadow: 0 0 10px @bg-theme-color;
  svg{
    width: 100%;
    height: 100%;
  }
}
</style>