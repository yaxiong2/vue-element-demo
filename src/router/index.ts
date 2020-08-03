import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '',
    name: 'Examples',
    component: () => import('@/views/主页/index.vue'),
    meta: {
      title: '组件示例',
      icon: 'el-icon-s-management'
    },
    children: [
      {
        path: 'tree',
        name: 'tree',
        component: () => import('@/components/element树展开折叠/index.vue'),
        meta: {
          title: '树展开折叠',
          icon:'el-icon-document'
        }
      },
      {
        path: 'treestring',
        name: 'treestring',
        component: () => import('@/components/树形数据遍历拼接字符串/index.vue'),
        meta: {
          title: '树形数据遍历拼接字符串',
          icon:'el-icon-document'
        }
      },
      {
        path: 'flod',
        name: 'flod',
        component: () => import('@/components/顶部条件赛选/index.vue'),
        meta: {
          title: '顶部条件赛选',
          icon:'el-icon-document'
        }
      },
      {
        path: 'table',
        name: 'table',
        component: () => import('@/components/el-table/index.vue'),
        meta: {
          title: '表格',
          icon:'el-icon-document'
        }
      },
      {
        path: 'ceshi',
        name: 'ceshi',
        component: () => import('@/components/测试/index.vue'),
        meta: {
          title: '测试',
          icon:'el-icon-document'
        }
      },
      {
        path: 'line',
        name: 'line',
        component: () => import('@/components/背景动态线条/index.vue'),
        meta: {
          title: '动态线条',
          icon:'el-icon-document'
        }
      },
      {
        path: 'drag',
        name: 'drag',
        component: () => import('@/views/拖动条/index.vue'),
        meta: {
          title: '拖动条',
          icon:'el-icon-document'
        }
      }
    ]
  },
  {
    path: '',
    name: 'About',
    component: () => import('@/views/主页/index.vue'),
    meta: {
      title: '关于',
      icon: 'el-icon-s-management'
    },
    children:[
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/关于/index.vue'),
        meta: {
          title: '关于我们',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'jstool',
        name: 'About',
        component: () => import('@/components/js工具函数/index.vue'),
        meta: {
          title: 'js工具函数',
          icon: 'el-icon-document'
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
