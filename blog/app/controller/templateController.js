import modal from "Templates/modal.hbs"
import login from "Templates/login.hbs"
import write from "Templates/write.hbs"
import article from "Templates/article.hbs"
import message from "Templates/message.hbs"
import articles from "Templates/articles.hbs"
import category from "Templates/category.hbs"
import comments from "Templates/comments.hbs"
import toolbar from "Templates/toolbar.hbs"
import userInfo from "Templates/userInfo.hbs"
import shootGame from "Templates/shootGame.hbs"
import media from "Templates/media.hbs"
import slider from "Templates/slider.hbs"
import myProject from "Templates/myProject.hbs"
import postAvatar from "Templates/postAvatar.hbs"

const TemplateMap = {
    modal, login, write, article, message, articles, category,
    comments, toolbar, shootGame, media, userInfo, slider, myProject, postAvatar
}

export default class Template {
    constructor({ wrap = "body", typeName = "modal", data } = {}) {
        this.wrap = $(wrap)
        this.name = typeName
        this.data = data
    }
    render() {
        this.wrap.html(this.getHtml())
    }
    getHtml() {
        return TemplateMap[this.name](this.data)
    }
    static render(type, data) {
        return TemplateMap[type](data)
    }
}