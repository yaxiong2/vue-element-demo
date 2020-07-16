import request from '@/utils/request'

const formBaseUrl = process.env.VUE_APP_FORM_API + '/op'

// 移除业务
export function removeBusiness(params:{keyTypeCodeFrom:number, keyTypeCodeTo:number}) {
  return request({
    url: '/manager/fldCopy',
    params: params,
    method: 'delete',
    baseURL: formBaseUrl
  })
}
// 获取业务列表
export function getBusinessList(params:{keyTypeCodeTo:number}) {
  return request({
    url: '/manager/fldCopy/keyTypeCodeFroms',
    params: params,
    method: 'get',
    baseURL: formBaseUrl
  })
}
// 获取数据列表
export function getDataList(params:{keyTypeCodeFrom:number, keyTypeCodeTo:number}) {
  return request({
    url: '/manager/fldCopy/list',
    params: params,
    method: 'get',
    baseURL: formBaseUrl
  })
}
// 保存数据
export function saveFormData(data:any) {
  return request({
    url: '/manager/fldCopy',
    data: data,
    method: 'post',
    baseURL: formBaseUrl
  })
}
