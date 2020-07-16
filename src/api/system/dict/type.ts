import request from '@/utils/request'
const globalBaseUrl = process.env.VUE_APP_BASE_API

// 查询字典类型列表
export function listType(query?:string) {
  return request({
    url: '/admin/dict/type/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 查询字典类型详细
export function getType(dictId:string) {
  return request({
    url: '/admin/dict/type/' + dictId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增字典类型
export function addType(data:any) {
  return request({
    url: '/admin/dict/type',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 修改字典类型
export function updateType(data:any) {
  return request({
    url: '/admin/dict/type',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 删除字典类型
export function delType(dictId:string) {
  return request({
    url: '/admin/dict/type/' + dictId,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}
