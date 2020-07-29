import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '',
    name: 'Home',
    component: () => import('@/views/主页/index.vue'),
    meta: {
      title: '示例',
      icon: 'el-icon-eleme'
    },
    redirect: '/tree',
    children: [
      {
        path: 'tree',
        name: '树展开折叠',
        component: () => import('@/components/element树展开折叠/index.vue'),
        meta: {
          title: '树展开折叠',
          icon:'el-icon-goods'
        }
      },
      {
        path: 'treestring',
        name: '树形数据遍历拼接字符串',
        component: () => import('@/components/树形数据遍历拼接字符串/index.vue'),
        meta: {
          title: '树形数据遍历拼接字符串',
          icon:'el-icon-help'
        }
      },
      {
        path: 'flod',
        name: '顶部条件赛选',
        component: () => import('@/components/顶部条件赛选/index.vue'),
        meta: {
          title: '顶部条件赛选',
          icon:'el-icon-s-platform'
        }
      },
      {
        path: 'table',
        name: '表格',
        component: () => import('@/components/el-table/index.vue'),
        meta: {
          title: '表格',
          icon:'el-icon-s-platform'
        }
      },
      {
        path: 'ceshi',
        name: '测试',
        component: () => import('@/components/测试/index.vue'),
        meta: {
          title: '测试',
          icon:'el-icon-s-platform'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
