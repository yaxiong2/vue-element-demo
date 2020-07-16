import router from './router'
// import NProgress from 'nprogress'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
// import 'nprogress/nprogress.css'
// import settings from './settings'

// NProgress.configure({ showSpinner: false })

const whiteList = ['/auth-redirect', '/bind', '/register', '/oauth2/authorization/venus-x', '/login', '/logout', '/login?logout']

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // NProgress.start()

  if (UserModule.token) {
    if (to.path === '/login') {
      next({ path: '/' })
      // NProgress.done()
    } else {
      if (UserModule.roles === null) {
        try {
          await UserModule.GetUserInfo()
          const roles = UserModule.roles
          await PermissionModule.GenerateRoutes()
          router.addRoutes(PermissionModule.dynamicRoutes)
          next({ ...to, replace: true })
        } catch (err) {
          Message.error(err || '请求错误')
          next(`/login?redirect=${to.path}`)
          // NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      // NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // NProgress.done()
})
