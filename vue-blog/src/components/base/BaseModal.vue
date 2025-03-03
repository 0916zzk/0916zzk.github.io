<template >
  <el-dialog v-model="store.isShow" :title="title" width="500">
    <BaseForm :type="type" ref="refform"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-for="btn in btns" :key="btn.name" @click="handlerBtn(btn.targetName,btn.isSubmit)">{{ btn.name }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import BaseForm from './BaseForm.vue';
import { useModalStore } from '@/stores/modal'
import MODAL_DATA from "@/config/modal.config"
import { computed, inject, ref } from 'vue';
import { useUserStore } from "@/stores/user"
import { useLikeStore } from "@/stores/like"
import bus from "@/util/bus"
import { useRouter } from 'vue-router';
const router = useRouter()
const { login } = useUserStore()
const {getUserLikes } =useLikeStore()
const axios = inject("axios")
const store = useModalStore()
const refform = ref(null)
const type = computed(()=>store.type)
const btns = computed(() => {
  return MODAL_DATA[type.value]?.btns??[]
})
const title = computed(() => {
  return MODAL_DATA[type.value]?.title??""
})
function handlerBtn(type,isSubmit) { 
  if (isSubmit) {
    submitForm()
    return
  }
  store[type]&&store[type]()
}
function submitForm() { 
  refform.value.$refs['elform'].validate(async (valid) => {
    if (valid) {
      try { 
        let result = await axios({ type: type.value, data: refform.value.form })
        if (type.value === "login" || type.value === "register") {
          let token = result.token
          await login(token,router)
          await getUserLikes()
        }
        bus.emit("hiddenDialog")
      } catch (e) { 
        console.log(e)
        refform.value.$refs['elform'].resetFields()
      }
    } else {
      console.log('提交失败');
      return false;
    }
  });
}
</script>
<style lang="stylus">

</style>