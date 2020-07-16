import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import store from '@/store'
import Message from '@/utils/message'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[] | null
  email: string
  permissions:any
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = require('@/assets/image/123.jpg')
  public introduction = ''
  public roles: string[] | null = null
  public email = ''
  public permissions = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_PERMISSIONS(permissions:any) {
    this.permissions = permissions
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Action
  public async Login(userInfo: { username: string, password: string, grant_type:string}) {
    const { data } = await login(userInfo)
    setToken(data.access_token)
    this.SET_TOKEN(data.access_token)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    // let t: any = JSON.parse(sessionStorage.getItem('info') || '')
    let res:any
    // if (!t) {
      res = await getInfo()
      res = res.data
    // } else {
    //   res = t
    // }
    if (!res) {
      throw Error('认证失败，请重新登录')
    }
    const { roles, permissions } = res as any
    let { userName, avatar, admin, guard } = (res as any).user
    if (avatar === '') { // 如果服务器没有图片地址，则加载本地图片
      avatar = require('@/assets/image/123.jpg')
    }
    if (!roles || roles === null || roles.length === 0) {
      Message.warning({ message: '该用户尚未配置角色', duration: 3000 })
    }
    this.SET_ROLES(roles)
    this.SET_NAME(userName)
    this.SET_AVATAR(avatar)
    this.SET_PERMISSIONS(permissions)
  }

  @Action
  public LogOut() {
    // if (this.token === '') {
    // window.location.reload()
    // }
    location.href = '/login'
    removeToken()
    resetRouter()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    this.SET_PERMISSIONS('')
  }

   // 前端 登出
   @Action
   public FedLogOut() {
    return new Promise(resolve => {
      this.SET_TOKEN('')
      removeToken()
      resolve()
    })
  }
}

export const UserModule = getModule(User)

