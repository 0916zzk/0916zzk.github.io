import service from "@/api/service"
import store from "store"
import JSEncrypt from "jsencrypt"
import base from "@/config/base.config"
const { PUBKEY_NAME } = base
export default async function encrty(str) {
    let key = store.get(PUBKEY_NAME)
    try {
        if (!key || key === 'undefined') {
            let result = await service.get('/keys')
            key = result.pubKey
            // key = key.replace(/\. +/g, '')
            // key = key.replace(/[\r\n]/g, '')
            store.set(PUBKEY_NAME, key)
        }
        let encrypt = new JSEncrypt()
        encrypt.setPublicKey(key)
        //加密密码
        return encrypt.encrypt(str);
    } catch (e) {
        console.log(e)
    }
}