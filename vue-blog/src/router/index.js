import store from 'store'
import base from "@/config/base.config"
let { TOKEN_NAME } = base
import { ElNotification } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
import lodsh from '@/util/lodsh'
const { isMobile } = lodsh
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import("@/views/HomePage.vue"),
      redirect: "/index",
      children: [
        //路由懒加载
        { path: 'index', name: "index", component: () => import("@/views/ArticleList.vue") },
        {
          path: 'category', name: "category", component: () => import("@/views/ArticleCategory.vue"), meta: {}
        },
        { path: 'project', name: "project", component: () => import("@/views/ProjectShow.vue") },
        { path: 'article/:id', name: "article", component: () => import("@/views/ArticleInfo.vue") },
        {
          path: 'write',
          name: "write",
          component: () => import("@/views/ArticleWrite.vue"),
          props: (route) => {
            return {
              categoryid: route.query.categoryid
            }
          }
        },
        {
          path: 'user', name: "user", component: () => import("@/views/UserInfo.vue"), meta: {
            requireAuth: true
          }
        },
        {
          path: 'shootgame', name: "shootgame", component: () => import("@/components/project/ShootGame.vue")
        },
        {
          path: 'automedia', name: "automedia", component: () => import("@/components/project/AutoMedia.vue")
        },
        { path: 'chat', name: "chat", component: () => import("@/views/ChatHome.vue") }

      ]
    }
    , {
      path: "/m",
      name: "MHome",
      component: () => import("@/mviews/MHomePage.vue"),
      redirect: "/m/index",
      children: [
        {
          path: "index",
          name: "mIndex",
          component: () => import("@/mviews/MArticleList.vue"),
          meta: {
            navType: "NavSearchBar"
          }
        },
        {
          path: "article/:id",
          name: "mArticle",
          component: () => import("@/mviews/MArticleInfo.vue"),
          meta: {
            title: "文章",
            navType: "NavHeaderBar",
            button: true,
            handler: "mTurnToComment"
          }
        },
        {
          path: "category",
          name: "mCategory",
          component: () => import("@/mviews/MArticleCategory.vue"),
          meta: {
            title: "分类",
            navType: "NavHeaderBar",
          }
        },
        {
          path: "user",
          name: "mUser",
          component: () => import("@/mviews/MUserInfo.vue"),
          meta: {
            title: "我的",
            navType: "NavHeaderBar",
          },
          children: [
            {
              path: "index",
              component: () => import("@/components/m/MUserToolbar.vue"),
            },
            {
              path: "write",
              component: () => import("@/components/m/MUserArticle.vue"),
              meta: { type: "write", requireAuth: true }
            },
            {
              path: "like",
              component: () => import("@/components/m/MUserArticle.vue"),
              meta: { type: "like", requireAuth: true }
            },
          ]
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  let requireAuth = to.meta.requireAuth
  if (requireAuth && !store.get(TOKEN_NAME)) {
    ElNotification({
      title: "权限不足",
      message: "请先登录...",
      position: "top-right",
      type: 'warning',
    })
    !isMobile() ? next("/index") : next("/m/user/index")
    return
  }
  next()
})

export default router
