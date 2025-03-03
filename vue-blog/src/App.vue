<template>
  <RouterView />
  <div></div>
</template>
<script setup>
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import loadsh from "@/util/lodsh"
const {isMobile } = loadsh
const router = useRouter()
onMounted(() => { 
  isMobile()&&router.replace("/m")
})
</script>
<style></style>
