import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
import Layout from '@/layout/index.vue'
import { getRouters } from '@/api/login'
import { getToken } from '@/utils/cookies'
import { guid, treeRecursion } from '@/utils/tools'

interface _RouteConfig extends RouteConfig {
  id?:string
}

export const filterAsyncRoutes = (routes: RouteConfig[]) => routes.map(route => {
  if (route.component) {
    if (route.component === 'Layout') {
      route.component = Layout
    } else {
      route.component = loadView(route.component)
    }
  }
  if (route.children && route.children.length) {
    route.children = filterAsyncRoutes(route.children)
  }
  return route
})

const mapList = {
  'user/index': import('@/views/system/user/index.vue'),
  'role/index': import('@/views/system/role/index.vue'),
  'menu/index': import('@/views/system/menu/index.vue'),
  'dept/index': import('@/views/system/dept/index.vue'),
  'post/index': import('@/views/system/post/index.vue'),
  'dict/index': import('@/views/system/dict/index.vue'),
  'config/index': import('@/views/system/config/index.vue'),
  'dashboard/index': import('@/views/dashboard/index.vue'),
  'myoffice/index': import('@/views/dashboard/index.vue')
}
export const loadView = (view: any) => { // 路由懒加载
  return () => (mapList as any)[view]
}

export interface IPermissionState {
  routes: _RouteConfig[]
  dynamicRoutes: _RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: _RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: _RouteConfig[]) {
    this.routes = treeRecursion(constantRoutes.concat(routes), (item:_RouteConfig) => { item.id = guid() })
    this.dynamicRoutes = routes
  }

  @Action
  public async GenerateRoutes() {
    if (getToken() === '') {
      throw Error('获取token失败')
    }
    let res = await getRouters()
    // res = res.data
    const { data } = { ...res }
    if (!data) {
      throw Error('认证失败，请重新登录')
    }
    let accessedRoutes
    accessedRoutes = filterAsyncRoutes(data)
    // 插入本地配置的异步路由
    accessedRoutes = accessedRoutes.concat(asyncRoutes)
    this.SET_ROUTES(accessedRoutes)
  }
}

export const PermissionModule = getModule(Permission)
