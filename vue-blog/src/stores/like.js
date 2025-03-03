import { computed, ref, } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from "@/stores/user"
import store from 'store'
import base from "@/config/base.config"
import axios from "@/api/http"
const { LIKES_KEY } = base
export const useLikeStore = defineStore('like', () => {
    const localLikes = ref([])
    //退出之后别忘记清空数组
    const userLikes = ref([])
    const userStore = useUserStore()
    const Token = computed(() => userStore.Token)
    const { getUserInfo } = userStore
    const isLike = computed(() => {
        return (id) => {
            if (Token.value) {
                return userLikes.value.includes(id)
            } else {
                return localLikes.value.includes(id)
            }
        }
    })
    if (store.get(LIKES_KEY)) {
        localLikes.value = store.get(LIKES_KEY)
    }
    if (Token.value) {
        getUserLikes()
    }
    async function getUserLikes() {
        let res = await getUserInfo()
        userLikes.value = res.like_articles || []
    }
    async function addLikes(id) {
        if (Token.value) {
            //用户登录
            userLikes.value.push(id)
            try {
                await axios({ type: "incLike", data: { id } })
            } catch (e) {
                console.log(e);
            }
        } else {
            //游客登陆
            localLikes.value.push(id)
            store.set(LIKES_KEY, localLikes.value)
        }
    }
    async function removeLikes(id) {
        if (Token.value) {
            //用户登录
            userLikes.value = userLikes.value.filter(item => {
                return item !== id
            })
            try {
                await axios({ type: "decLike", data: { id } })
            } catch (e) {
                console.log(e);
            }
        } else {
            //游客登陆
            localLikes.value = localLikes.value.filter(item => {
                return item !== id
            })
            store.set(LIKES_KEY, localLikes.value)
        }
    }

    return { localLikes, userLikes, isLike, addLikes, removeLikes, getUserLikes }
})
