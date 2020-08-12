import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { Icon } from 'element-ui'

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
        component: () => import('@/components/1.element树展开折叠/index.vue'),
        meta: {
          title: '树展开折叠',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'treestring',
        name: 'treestring',
        component: () => import('@/components/2.树形数据遍历拼接字符串/index.vue'),
        meta: {
          title: '树形数据遍历拼接字符串',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'flod',
        name: 'flod',
        component: () => import('@/components/3.顶部条件赛选/index.vue'),
        meta: {
          title: '顶部条件赛选',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'table',
        name: 'table',
        component: () => import('@/components/4.el-table/index.vue'),
        meta: {
          title: '表格',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'ceshi',
        name: 'ceshi',
        component: () => import('@/components/5.测试/index.vue'),
        meta: {
          title: '测试',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'eventBus',
        name: 'eventBus',
        component: () => import('@/components/6.eventBus/index.vue'),
        meta: {
          title: 'eventBus',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'drag',
        name: 'drag',
        component: () => import('@/components/7.拖动条/index.vue'),
        meta: {
          title: '拖动条',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'waterfall',
        name: 'waterfall',
        component: () => import('@/components/8.背景/waterfall.vue'),
        meta: {
          title: 'waterfall',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'publicField',
        name: 'publicField',
        component: () => import('@/components/9.公共字段相关字段/Va-PublicField.vue'),
        meta: {
          title: 'publicField',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'relativeField',
        name: 'relativeField',
        component: () => import('@/components/9.公共字段相关字段/Va-RelevantField.vue'),
        meta: {
          title: 'relativeField',
          icon: 'el-icon-document'
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
    children: [
      {
        path: 'about',
        name: 'About',
        component: () => import('@/components/10.关于/index.vue'),
        meta: {
          title: '关于我们',
          icon: 'el-icon-document'
        }
      },
      {
        path: 'jstool',
        name: 'About',
        component: () => import('@/components/11.js工具函数/index.vue'),
        meta: {
          title: 'js工具函数',
          icon: 'el-icon-document'
        }
      }
    ]
  },
  {
    path: '',
    name: 'Icon',
    component: () => import('@/views/主页/index.vue'),
    meta: {
      title: '图标',
      icon: 'el-icon-s-management'
    },
    children: [
      {
        path: 'icons',
        name: 'Icon',
        component: () => import('@/components/12.icons/index.vue'),
        meta: {
          title: '图标',
          icon: 'el-icon-document'
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
