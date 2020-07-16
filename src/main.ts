import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/styles'
import '@/icons'
import '@/plugins/element-ui'
import '@/plugins/global-prop' // 全局属性和方法
import '@/plugins/global-com' // 全局组件和指令
import '@/plugins/refactor-router' // 路由重写
import '@/permission' // 权限相关

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
