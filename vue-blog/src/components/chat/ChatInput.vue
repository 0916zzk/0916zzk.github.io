<template lang="">
    <div>
        <el-input
        v-model="content"
        placeholder="请输入聊天内容..."
        class="input-with-select"
        @keydown.enter="send">
            <template #append>
                <el-button :icon="Promotion" @click="send"/>
            </template>
        </el-input>
    </div>
</template>
<script setup>
import { Promotion } from '@element-plus/icons-vue'
import { defineModel } from "vue"
import bus from "@/util/bus"
const content = defineModel("content")
const emit = defineEmits(["sendMsg"])
function send() { 
    emit('sendMsg')
    bus.emit("scrollToBottom")
}
</script>
<style lang="">
    
</style>