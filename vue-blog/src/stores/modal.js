import { ref, } from 'vue'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const isShow = ref(false)
  const type = ref("")
  function close() {
    isShow.value = false
  }
  function open(formType) {
    type.value = formType
    isShow.value = true
  }
  function confirm() {
    console.log("提交")
    close()
  }
  return { isShow, type, close, open, confirm }
})
