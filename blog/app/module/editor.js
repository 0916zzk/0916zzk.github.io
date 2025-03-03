import { createEditor, createToolbar, Boot } from "@wangeditor/editor"
import markdownModule from "@wangeditor/plugin-md"
import store from "store"
import message from "./message"
import $ from "jquery"
const tokenName = "ua_ZZTK"
const URL = 'http://127.0.0.1:3001/upload/article'
const ERROR_MAP = {
    title: '标题不能为空',
    content: '内容不能为空',
    column: '请选择分类'
}
Boot.registerModule(markdownModule)
export default class Editor {
    constructor(mode, callback = function () { }) {
        this.mode = mode
        this.callback = callback
        this.init()
        this.listen()
    }
    init() {
        const editorConfig = {
            placeholder: 'Type here...',
            MENU_CONF: {}
        }
        editorConfig.MENU_CONF['uploadImage'] = {
            server: URL,
            fieldName: 'file',
            maxFileSize: 1 * 1024 * 1024, // 1M
            maxNumberOfFiles: 1,
            allowedFileTypes: ['image/*'],
            headers: {
                'Authorization': `Bearer ${store.get(tokenName)}`,
            },
            timeout: 5 * 1000, // 5 秒,
            customInsert(res, insertFn) {
                insertFn(res.data)
            },
            // 单个文件上传失败
            onError(file) {
                message.danger(`${file.name} 上传失败`)
            },
        }
        this.editor = createEditor({
            selector: '#blog-editor-container',
            html: '<p><br></p>',
            config: editorConfig,
            mode: this.mode, // or 'simple'
        })

        const toolbarConfig = {}
        const toolbar = createToolbar({
            editor: this.editor,
            selector: '#blog-toolbar-container',
            config: toolbarConfig,
            mode: this.mode, // or 'simple'
        })
    }
    listen() {
        $('.blog-write-btn').on('click', '.blog-write-submit', (e) => {
            e.preventDefault()
            let data = {}
            let body = this.getHtml()
            let $body = $(body)
            let category = $('input[name=category]:checked').val()
            let coverURL = $body.find('img')[0]?.src
            data.title = $('#blog-write-title').val()
            data.body = body
            data.category = category;
            if (coverURL) {
                data.cover = coverURL
            }
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
    getHtml() {
        return this.editor.getHtml()
    }
}
