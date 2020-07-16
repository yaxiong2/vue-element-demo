import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import businessRouter from './modules/business'
// import designerRouter from './modules/designer';

Vue.use(Router)
/*
  name:'router-name'              keep-alive 需要提供name属性,其它如递归组件同样需要提供name属性
  redirect:                       设置为'noredirect',顶部面包屑不会不会触发重定向
  meta: {
    roles: ['admin', 'editor']    控制页面角色,可也设置多个
    title: 'title'                子菜单和面包屑中显示的名称（推荐设置）
    icon: 'svg-name'              侧边栏中显示的图标
    hidden: true                  如果为true，则此路由不会显示在侧栏中（默认为false）
    alwaysShow: true              如果为true，将始终显示根菜单（默认为false）
                                  如果为false，则在具有小于或等于一个子路由时隐藏根菜单
    breadcrumb: false             如果为false，则该项将隐藏在breadcrumb中（默认为true）
    noCache: true                 如果为true，则不会缓存该页（默认为false）
    affix: true                   如果为真，标签将固定在面包屑视图中
    activeMenu: '/example/list'   如果设置路径，侧边栏将突出显示您设置的路径
  }
*/

//  ConstantRoutes 基础路由设置,所有用户都可以访问
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path*',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'icl-dashboard',
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { hidden: true },
    redirect: 'user/userInfo',
    children: [
      {
        path: 'userInfo',
        component: () => import('@/views/system/user/profile/index.vue'),
        name: '用户中心',
        meta: { title: '用户中心', icon: 'dashboard' }
      }
    ]
  }
]

// asyncRoutes 追加的动态路由
export const asyncRoutes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  },
  businessRouter
  // designerRouter
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
