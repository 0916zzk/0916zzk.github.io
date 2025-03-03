import "./assets/css/global.styl"
import 'element-plus/theme-chalk/display.css'
// import 'element-plus/dist/index.css'
// import 'vant/lib/index.css';
import "github-markdown-css"
import "animate.css"
import { Dialog } from 'vant';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from './plugins/axios'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(createPinia())

app.use(axios)
app.use(Dialog)
app.mount('#app')
