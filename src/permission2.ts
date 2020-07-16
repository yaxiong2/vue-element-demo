import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import settings from './settings'

NProgress.configure({ showSpinner: false })

const whiteList = ['/auth-redirect', '/bind', '/register', '/oauth2/authorization/venus-x', '/index', '/login', '/logout', '/login?logout']

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()
  // Determine whether the user has logged in
  if (to.path === '/logout' || to.path === '/login?logout') { // 退出，放行
    next()
    NProgress.done()
  } else { // 非退出
    // Check whether the user has obtained his permission roles
    if (UserModule.roles === null) {
      try {
        // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
        await UserModule.GetUserInfo()
        const roles = UserModule.roles
        // Generate accessible routes map based on role
        await PermissionModule.GenerateRoutes()
        // Dynamically add accessible routes
        router.addRoutes(PermissionModule.dynamicRoutes)
        // Hack: ensure addRoutes is complete
        // Set the replace: true, so the navigation will not leave a history record
        next({ ...to, replace: true })
      } catch (err) {
        UserModule.FedLogOut().then(() => {
          Message.error(err || 'Has Error')
          if (whiteList.indexOf(to.path) !== -1) {
            // 白名单中的路径，直接进入
            next()
            NProgress.done()
          }
        })
      }
    } else {
      next()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()
})
