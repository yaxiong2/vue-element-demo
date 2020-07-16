import request from '@/utils/request'

// 因为用的是application/x-www-form-urlencoded,所以要借助这个工具将数据进行转换
import Qs from 'qs'

const globalBaseUrl = process.env.VUE_APP_BASE_API
const loginBaseUrl = process.env.VUE_APP_LOGIN_API

// 登录方法
export function login(userInfo:any) {
  return request({
    url: '/oauth/token',
    method: 'post',
    data: userInfo,
    transformRequest: [function(data:any) {
      data = Qs.stringify(data)
      return data
    }],
    baseURL: loginBaseUrl,
    headers: { Authorization: 'Basic b3NtcC14OnNlY3JldA==' }
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get',
    baseURL: globalBaseUrl
  })
}
