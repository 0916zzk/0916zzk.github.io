import Template from "../controller/templateController"
import $ from "jquery"
let timer
class Message {
    constructor(wrap) {
        this.wrap = $(wrap)
    }
    success(message) {
        this.#render("success", message)
        this.#show()
    }
    info(message) {
        this.#render("info", message)
        this.#show()
    }
    warning(message) {
        this.#render("warning", message)
        this.#show()
    }
    danger(message) {
        this.#render("danger", message)
        this.#show()
    }
    #show() {
        clearTimeout(timer)
        timer = setTimeout(() => {
            this.wrap.find(".alert").removeClass("show")
        }, 2000)
        setTimeout(() => {
            this.wrap.find(".alert").addClass("show")
        }, 10)

    }
    #render(type, message) {
        this.wrap.html(this.#html(type, message))
    }
    #html(type, message) {
        return Template.render("message", {
            type, message
        })
    }
}
export default new Message(".blog-message-wrap")