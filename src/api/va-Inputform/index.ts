import request from '@/utils/request'

const opBaseUrl = process.env.VUE_APP_MANAGER_API

// 获取表单
export function getForm(keyTypeCode:number) {
  return request({
    url: '/op/manager/form/list',
    params: { keyTypeCode: keyTypeCode },
    method: 'get',
    baseURL: opBaseUrl
  })
}

// 增加表单
export function addForm(data:object) {
  return request({
    url: '/op/manager/form',
    method: 'post',
    params: data,
    baseURL: opBaseUrl
  })
}

// 删除表单
export function deleForm(formId:number) {
  const params = {
    formId: formId
  }
  return request({
    url: '/op/manager/form',
    method: 'delete',
    params: params,
    baseURL: opBaseUrl
  })
}

// 作废表单
export function disableForm(formId:number) {
  return request({
    url: '/op/manager/form/disable',
    method: 'put',
    params: {
      formId: formId
    },
    baseURL: opBaseUrl
  })
}

// 恢复表单
export function recoverForm(formId:number) {
  return request({
    url: '/op/manager/form/recover',
    method: 'put',
    params: {
      formId: formId
    },
    baseURL: opBaseUrl
  })
}
// 修改表单
export function editForm(params:Object) {
  return request({
    url: '/op/manager/form',
    method: 'put',
    params: params,
    baseURL: opBaseUrl
  })
}
