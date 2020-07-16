import request from '@/utils/request'

const formBaseUrl = process.env.VUE_APP_FORM_API

// 获取表单
export function getForm(groupId:number |undefined) {
  return request({
    url: '/form/group/forms',
    params: { groupId: groupId },
    method: 'get',
    baseURL: formBaseUrl
  })
}

// 增加表单
export function addForm(data:object) {
  return request({
    url: '/form/',
    method: 'post',
    data: data,
    baseURL: formBaseUrl
  })
}

// 删除表单
export function deleForm(formId:number) {
  const params = {
    formId: formId
  }
  return request({
    url: '/form/',
    method: 'delete',
    params: params,
    baseURL: formBaseUrl
  })
}

// 作废表单
export function disableForm(formId:number) {
  return request({
    url: '/form/disable',
    method: 'put',
    params: {
      formId: formId
    },
    baseURL: formBaseUrl
  })
}

// 恢复表单
export function recoverForm(formId:number) {
  return request({
    url: 'form/recover',
    method: 'put',
    params: {
      formId: formId
    },
    baseURL: formBaseUrl
  })
}
