import axios from 'axios'
import { Notification } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { getToken } from '@/utils/cookies'
import Message from '@/utils/message'
import Vue from 'vue'
// 创建axios实例
const service = axios.create({
  // 超时
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(
  config => {
    if (config.headers.Authorization !== 'Basic dmVudXM6c2VjcmV0' && getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use((res:any) => {
    const code = res.status
   if (code !== 200) {
      // 提示错误原因
      (Notification as any).error({
        title: res.data.msg
      })
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    const status = error && error.response && error.response.status
    if (status) {
      if (Number(status) >= 400 && Number(status) < 500) {
        if (Number(status) === 401) {
          Message.error({ message: '登录超时,3s后将重新登录', duration: 3000 })
          setTimeout(() => {
            UserModule.LogOut()
            window.location.reload()
          }, 3000)
        } else {
          const err = error.response && error.response.data && error.response.data.error
          if (err) {
            Message.error({ message: err, duration: 3000 })
         }
        }
      } else if (status === 500) {
        Message.error('服务器请求失败')
      } else if (status === 502) {
        Message.error('网关错误')
      } else if (status === 504) {
        Message.error('网关超时')
      }
    } else {
      Message.error('请求错误')
    }
    return Promise.reject(error)
  }
)

export default service
