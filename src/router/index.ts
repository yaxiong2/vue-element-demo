import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      icon: 'el-icon-plus'
    },
    redirect: '/tree',
    children: [
      {
        path: 'tree',
        name: '树展开折叠',
        component: () => import('@/components/element树展开折叠/index.vue'),
        meta: {
          title: '树展开折叠'
        }
      },
      {
        path: 'treestring',
        name: '树形数据遍历拼接字符串',
        component: () => import('@/components/树形数据遍历拼接字符串/index.vue'),
        meta: {
          title: '树形数据遍历拼接字符串'
        }
      },
      {
        path: 'flod',
        name: '折叠面板内容表格',
        component: () => import('@/components/折叠面板内容表格/index.vue'),
        meta: {
          title: '折叠面板内容表格'
        }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于',
      icon: 'el-icon-plus'
    },
    redirect: 'stars',
    children: []
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
