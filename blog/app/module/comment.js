import message from "./message"
import $ from "jquery"
const ERROR_MAP = {
    content: '不能发送空评论',
}
export default class Comment {
    constructor({ submitEle, inputEle, callback = function () { } }) {
        this.submitEle = $(submitEle)
        this.inputEle = $(inputEle)
        this.callback = callback
        this.listen()
    }
    listen() {
        this.submitEle.on('click', (e) => {
            e.preventDefault()
            let data = {}
            let content = $(this.inputEle).val() || $(this.inputEle).html()
            data.content = content
            Object.entries(data).some(([key, value]) => {
                let isPass = !value || value.trim().length === 0
                if (isPass) {
                    message.warning(ERROR_MAP[key])
                    data = null
                }
                return isPass
            })
            this.callback(data)
        })
    }
}