<template lang="">
    <van-dialog v-model:show="show" :title="title" :showConfirmButton="false" @close="resetForm" :closeOnClickOverlay="true">
     <MBaseForm :type="formType" ref="baseform"/>
     <p v-if="formType==='login'" class="blog-m-dialog-register"><span @click="turnToRegister">注册</span></p>
    </van-dialog>
</template>
<script setup>
import MBaseForm from './MBaseForm.vue';
import { onBeforeUnmount, ref, computed, nextTick } from 'vue';
import bus from "@/util/bus"
import MODAL_DATA from "@/config/modal.config"
const type = ref("login")
const title = computed(() => {
  return MODAL_DATA[type.value]?.title??""
})
const formType = computed(() => {
  return MODAL_DATA[type.value]?.formType??""
})
const show = ref(false)
bus.on("showDialog", showDialog)
onBeforeUnmount(() => { 
    bus.off("showDialog", showDialog)
})
bus.on("hiddenDialog", hiddenDialog)
onBeforeUnmount(() => { 
    bus.off("hiddenDialog", hiddenDialog)
})
function hiddenDialog() { 
    show.value = false
}
function showDialog(t) {
    show.value = true
    type.value= t
}
const baseform = ref(null)
function resetForm() { 
    baseform.value.$refs.formref.resetValidation()
    baseform.value.form = {}
}
async function turnToRegister() { 
    show.value = false
    await nextTick()
    showDialog("register")
}
</script>
<style lang="less">
.blog-m-dialog-register{
    display: flex;
    justify-content: flex-end;
    span{
        padding: 10px;
        margin-right: 20px;
        margin-bottom: 5px;
        color: blue;
    }
} 
</style>