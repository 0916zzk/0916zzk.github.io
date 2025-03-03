<template lang=""> 
    <van-form :required="true" label-align="left" :validate-trigger="['onChange','onBlur']" ref="formref" @submit="onSubmit">
        <van-cell-group inset>
            <template v-for="item in formData" :key="item.query">
                <van-field name="uploader" :label="item.label" v-if="item.upload">
                    <template #input>
                        <van-uploader 
                            v-model="avatarPath" 
                            :max-count="1" 
                            :max-size="500 * 1024"
                            :after-read="afterRead"
                            />
                    </template>
                </van-field>
                
                <van-field  v-else
                v-model="form[item.query]"
                :name="item.query"
                :label="item.label"
                :placeholder="item.placeholder"
                :rules="item.rules"
                :disabled="item.readonly"
                />
            </template>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                提交
                </van-button>
            </div>
        </van-cell-group>
    </van-form>
</template>
<script setup>
import formConfig from '@/config/form.config';
import validateConfig from "@/config/validate.config"
import { ref, computed, inject,watch } from 'vue';
import loadsh from "@/util/lodsh"
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import bus from "@/util/bus"
const { firsttoUpperCase } = loadsh
const props= defineProps({
    type: String,
    nform:Object
})
const form = ref({})
const store = useUserStore()
watch(() => props.type, async (newVal) => { 
    const info = await store.getUserInfo()
    form.value = formConfig[newVal].reduce((acc, cur) => {
        acc[cur.query] = info[cur.query]??""
        return acc
    }, {})
    avatarPath.value[0].url=form.value.avatar
}, {
  immediate:true
})

const formData = computed(() => { 
    return formConfig[props.type].map((item) => {
        return {
            ...item,
            rules: validateConfig[item.query]?.map(item => {
                return {...item,trigger:"on" + firsttoUpperCase(item.trigger)}
            })
        }
  })
})
//上传图片

const avatarPath = ref([{}])
async function afterRead(file) {
    const f = new FormData()
    f.append("file", file.file)
    console.log(file);
    try {
        let res = await axios({ type: "postAvatar", data: f })
        form.value.avatar=res
    } catch (e) { 
        console.log(e);
    }
    
}
function onSubmit() { 
    console.log("提交");
    
    confirmAgent(props.type)
}
const axios = inject("axios")
const userStore = useUserStore()
const { login} = userStore
const router = useRouter()
const formref = ref(null)
async function confirmAgent(type) {
    form.value.id= userStore.userInfo._id
    try { 
        let result = await axios({ type, data: form.value })
        if (type === "login" || type === "register") { 
            let token = result.token
            await login(token, router)
        }
        await userStore.getUserInfo()
        bus.emit("hiddenDialog")
    } catch (e) { 
        console.log(e)
        formref.value.resetValidation()
        form.value = {}
    }

}

</script>
<style lang="">
    
</style>