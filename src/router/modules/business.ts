/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const businessRouter: RouteConfig = {
  path: '/businessManager',
  component: Layout,
  redirect: 'businessManager/formDesigner',
  name: 'AddBusiness',
  meta: {
    title: '业务管理',
    icon: 'icl-book'
  },
  children: [
    // {
    //   path: 'businessDefined',
    //   name: 'BusinessDefined',
    //   meta: { title: '业务定义', icon: 'icl-file-text' },
    //   component: () => import('@/views/business/businessDefined/index.vue')
    // },
    {
      path: 'opBusiness',
      name: 'opBusiness',
      meta: { title: '业务管理', icon: 'ic-container' },
      component: () => import('@/views/business/opBusiness/index.vue')
    },
    {
      path: 'projectNumber',
      name: 'projectNumber',
      meta: { title: '项目号管理', icon: 'icl-stored' },
      component: () => import('@/views/business/projectNumber/index.vue')
    },
    {
      path: 'license',
      name: 'license',
      meta: { title: '许可证管理', icon: 'icl-stored' },
      component: () => import('@/views/business/license/index.vue')
    },
    {
      path: 'projectInfoDictionaries',
      name: 'projectInfoDictionaries',
      meta: { title: '项目信息管理', icon: 'icl-info-circle' },
      component: () =>
        import('@/views/business/projectInfoDictionaries/index.vue')
    },
    // {
    //   path: 'opPublicDictionaries',
    //   name: 'opPublicDictionaries',
    //   meta: { title: '公共字段管理', icon: 'icl-message' },
    //   component: () =>
    //     import('@/views/business/publicFieldDictionaries/index.vue')
    // },
    {
      path: 'opRelevantDictionaries',
      name: 'opRelevantDictionaries',
      meta: { title: '相关字段管理', icon: 'icl-book' },
      component: () =>
        import('@/views/business/relevantFieldDictionaries/index.vue')
    },
    {
      path: 'materialClassification',
      name: 'materialClassification',
      meta: { title: '材料分类管理', icon: 'icl-piechart' },
      component: () => import('@/views/business/material/index.vue')
    },
    {
      path: 'formDesigner',
      name: 'FormDesigner',
      meta: { title: '表单设计器', icon: 'icl-wrench' },
      component: () => import('@/views/business/formDesinger/index.vue')
    },

    {
      path: 'icons',
      name: 'testPage',
      meta: { title: '图标', icon: 'icl-piechart' },
      component: () => import('@/views/icons/index.vue')
    }
  ]
}

export default businessRouter
