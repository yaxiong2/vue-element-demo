import request from '@/utils/request'

const globalBaseUrl = process.env.VUE_APP_BASE_API

// 查询参数列表
export function listConfig(query:string) {
  return request({
    url: '/admin/config/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 查询参数详细
export function getConfig(configId:string) {
  return request({
    url: '/admin/config/' + configId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey:string) {
  return request({
    url: '/admin/config/configKey/' + configKey,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增参数配置
export function addConfig(data:any) {
  return request({
    url: '/admin/config',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 修改参数配置
export function updateConfig(data:any) {
  return request({
    url: '/admin/config',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 删除参数配置
export function delConfig(configId:string) {
  return request({
    url: '/admin/config/' + configId,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}
