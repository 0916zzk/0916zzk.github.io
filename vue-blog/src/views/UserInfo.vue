<template lang="">
    <el-card class="blog-userinfo">
        <BaseForm type="putUserInfo" ref="userinfo"></BaseForm>
        <div class="blog-userinfo-btn">
            <el-button type="info" plain size="large" @click="handleReset">重置</el-button>
            <el-button type="primary" plain size="large" @click="handleSubmit">提交</el-button>
        </div>
    </el-card>
</template>
<script setup>
import BaseForm from '@/components/base/BaseForm.vue';
import formConfig from "@/config/form.config"
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore} from "@/stores/user"
async function handleReset() { 
    let form = formConfig["putUserInfo"].reduce((acc, cur) => {
        if(cur.query==="username") return acc
        acc[cur.query] = ""
        return acc
    }, {})
    userinfo.value.form=Object.assign(userinfo.value.form,form)
}
const store = useUserStore()
const userinfo = ref(null)
const axios = inject("axios")
const router = useRouter()
function handleSubmit() { 
    userinfo.value.$refs['elform'].validate(async (valid) => {
    if (valid) {
      try { 
          await axios({
              type: "putUserInfo",
              data: {
                ...userinfo.value.form,
                id:store.userInfo._id 
              }
          })
          store.getUserInfo()
          router.push("/index")
      } catch (e) { 
        console.log(e)
      }
    } else {
      console.log('提交失败');
      return false;
    }
  });
}
</script>
<style lang="less">
.blog-userinfo{
    min-height: 70vh;
}
.blog-userinfo-btn{
    display:flex;
    justify-content: center;
}
</style>