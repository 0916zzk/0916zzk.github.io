import Modal from "./modalController.js"
import FormValidator from "../module/validator.js"
import Drag from "../module/drag.js"
import Http from "../module/http.js"
import $ from "jquery"
import router from "./routerController.js"
import store from "store"
import Cropper from "cropperjs"
// import Template from "./templateController.js"
/*
  actionControl
  管理页面上发生的用户行为

  modal 行为
    modal 唤起渲染
    modal 上按钮触发

  form 行为 
    confirm 提交 校验

*/

//事件句柄
const RES_HANDLE = {
    login() {
        this.index()
    },
    register() {
        this.index()
    },
    postCategory() {
        this.index()
        router.go("/category", {
            routerName: "category"
        })
    },
    index() {
        //进入主页路由
        router.go("/index", {
            routerName: "index"
        })
    },
    putUserInfo() {
        router.go("/index", {
            routerName: "index"
        })

    }
}

export default class Action {
    constructor() {
        this.ModalAgency()
        this.validaoeAgency()
        this.routeAgency()
        this.headerAgency()
        this.init()
    }
    init() {
        //刷新页面，则重新进入index路由
        //前端路由会判断有无token，再进行重定向
        router.go("/index", { routerName: "index" })

    }
    ModalAgency() {
        //绑定data-modal属性的元素点击弹出模态框
        $(document).on('click', '[data-modal]', (e) => {
            e.preventDefault()
            let $target = $(e.target)
            let modalType = $target.data('modal')
            if (!modalType || modalType.length === 0) {
                return false
            }
            //生成模态框
            this.modal = new Modal({ modalWarp: $('.blog-modal'), modalType })
            this.modal.open()
            let box = $(".blog-modal-wrap").get(0)
            //添加拖拽事件
            new Drag(box)
        })
        //modal按钮的事件
        $(document).on("click", '[data-modal-btn]', (e) => {
            // e.preventDefault()
            let $target = $(e.target)
            let clickType = $target.data('modal-btn')
            if (this.modal && this.modal[clickType]) {
                this.modal[clickType]()
            }

        })
    }
    validaoeAgency() {
        $(document).on('submit', 'form', async (e) => {
            let $target = $(e.target)
            //获取form的id
            let formType = $target[0].id
            //表单校验 如果校验成功 返回表单数据
            try {
                let formData = await new FormValidator(formType)
                if (store.get("uid")) {
                    formData.id = store.get("uid")
                }
                //调用 Http发送请求 
                let result = await Http({ type: formType, data: formData })
                // //如果存在modal 关闭modal
                this.modal && this.modal.close()
                //执行请求句柄函数
                RES_HANDLE[formType] && RES_HANDLE[formType](result)
            } catch (err) {
                console.log(err)
            }

        })
    }
    //router
    routeAgency() {
        $(document).on('click', '[data-router]', function (e) {
            let $target = $(this)
            let routerName = $target.data('router')
            let articleId = $target.data('article-id')
            let categoryId = $target.data('category-id')
            router.go(`/${routerName}`, { routerName, articleId, categoryId })
        })
    }
    headerAgency() {
        //导航栏切换
        $(".blog-nav-list").on("click", "a", (e) => {
            e.preventDefault()
            $(e.currentTarget).addClass("active").siblings().removeClass("active")
        })
        //search搜索文章
        $(".blog-search-input").on("focus", (e) => {
            e.preventDefault()
            $(document).on("keyup", getSearchValue)

        })
        function getSearchValue(e) {
            if (e.keyCode === 13) {
                $(document).off("keyup", getSearchValue)
                let q = $(".blog-search-input").val()
                router.go("/search", {
                    routerName: "search",
                    data: { q }
                })
                $(".blog-search-input").val("")
            }
        }
        $(".blog-search-input").on("blur", (e) => {
            $(document).off("keyup", getSearchValue)
        })
        $(".blog-search-btn").on("click touchend", () => {
            let q = $(".blog-search-input").val()
            router.go("/search", {
                routerName: "search",
                data: { q }
            })
            $(".blog-search-input").val("")
        })
        $(".blog-menu").on("click touchend", (e) => {
            e.preventDefault()
            let maxHeight = $(".blog-nav-pulldown").css("max-height")
            if (maxHeight.startsWith("0")) {
                $(".blog-nav-pulldown").css("max-height", 1000)
            } else {
                $(".blog-nav-pulldown").css("max-height", 0)
            }
        })
    }
}