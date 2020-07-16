/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const designerRouter: RouteConfig = {
  path: '/manager',
  component: Layout,
  redirect: 'manager/designer',
  name: 'Manager',
  meta: {
    title: '设计管理',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'designer',
      meta: { title: '表单设计器', icon: 'form' },
      name: 'Designer',
      component: () => import('@/views/designer-manager/designer/index.vue')
    },
    {
      path: 'otherDesign',
      meta: { title: '流程图', icon: 'nested' },
      name: 'OtherDesign',
      component: () => import('@/views/designer-manager/otherDesign/index.vue')
    }
  ]
}

export default designerRouter
