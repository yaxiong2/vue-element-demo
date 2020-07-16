import request from '@/utils/request'

const globalBaseUrl = process.env.VUE_APP_BASE_API
// 查询字典数据列表
export function listData(query:string) {
  return request({
    url: '/admin/dict/data/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 查询字典数据详细
export function getData(dictCode:string) {
  return request({
    url: '/admin/dict/data/' + dictCode,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType:string) {
  return request({
    url: '/admin/dict/data/dictType/' + dictType,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增字典数据
export function addData(data:any) {
  return request({
    url: '/admin/dict/data',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 修改字典数据
export function updateData(data:any) {
  return request({
    url: '/admin/dict/data',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 删除字典数据
export function delData(dictCode:string) {
  return request({
    url: '/admin/dict/data/' + dictCode,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}
