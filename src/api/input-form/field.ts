import request from '@/utils/request'

const formBaseUrl = process.env.VUE_APP_FORM_API
// 字段增删改查
// 获取字段
export function getFormFields(formId:number) {
  return request({
    url: '/form/field',
    method: 'get',
    params: {
      formId: formId
    },
    baseURL: formBaseUrl
  })
}
// 增加字段
export function addFormField(data:object) {
  return request({
    url: 'form/field',
    method: 'post',
    data: data,
    baseURL: formBaseUrl
  })
}
// 删除字段
export function deleteFormField(formId:number, data:object) {
  return request({
    url: 'form/field',
    method: 'delete',
    params: { formId: formId },
    data: data,
    baseURL: formBaseUrl
  })
}
// 修改字段
export function editFormField(data:object) {
  return request({
    url: 'form/field',
    method: 'put',
    data: data,
    baseURL: formBaseUrl
  })
}

