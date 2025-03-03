import modalMap from '../config/modal.config.js'
import Template from "./templateController.js"
//模态框
export default class Modal {
    constructor({ modalWarp = $('.blog-modal'), modalType }) {
        this.modalWarp = modalWarp
        this.modalType = modalType
        this.html = ""
    }

    open() {
        // 生成html = 渲染方法(渲染数据)
        let data = modalMap[this.modalType]
        this.html = Template.render("modal", data)
        this.#draw()
    }
    //关闭
    close() {
        this.#reset()
    }
    confirm() {
        this.modalWarp.find("form")[0]?.submit()
    }
    //渲染
    #draw() {
        this.#clean()
        this.modalWarp.removeAttr('hidden')
        this.modalWarp.html(this.html).show()
    }
    //清空
    #clean() {
        this.modalWarp.html('')
    }

    //reset 重置blog-wrap
    #reset() {
        this.modalWarp.hide()
        this.modalWarp.attr('hidden', true)
    }
}