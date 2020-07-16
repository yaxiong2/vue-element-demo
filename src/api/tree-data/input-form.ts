import request from '@/utils/request'
const opBaseUrl = process.env.VUE_APP_MANAGER_API
// 操作业务基本信息
// 获取分组详情
export function getGroupdetail(opTypeGroupId: number) {
  return request({
    url: '/op/manager/group',
    method: 'get',
    params: { opTypeGroupId },
    baseURL: opBaseUrl
  })
}
// 获取项目号
export function getProject() {
  return request({
    url: 'op/manager/op/project',
    method: 'get',
    baseURL: opBaseUrl
  })
}
// 获取许可证号
export function getLicense() {
  return request({
    url: '/op/manager/license/licenses',
    method: 'get',
    baseURL: opBaseUrl
  })
}

// 输入表
// 获取输入表
export function getForm(formId:number) {
  return request({
    url: '/op/manager/form',
    method: 'get',
    params: { formId },
    baseURL: opBaseUrl
  })
}
// 添加输入表
export function addForm(data:object) {
  return request({
    url: '/op/manager/form',
    method: 'post',
    params: data,
    baseURL: opBaseUrl
  })
}
// 修改输入表
export function updataForm(data:object) {
  return request({
    url: '/op/manager/form',
    method: 'put',
    data,
    baseURL: opBaseUrl
  })
}
// 删除输入表
export function delForm(formId:number) {
  return request({
    url: '/op/manager/form',
    method: 'delete',
    params: { formId },
    baseURL: opBaseUrl
  })
}
// 作废输入表
export function disableForm(formId:number) {
  return request({
    url: '/op/manager/form/disable',
    method: 'put',
    params: { formId },
    baseURL: opBaseUrl
  })
}
// 恢复输入表
export function recoverForm(formId:number) {
  return request({
    url: '/op/manager/form/recover',
    method: 'put',
    params: { formId },
    baseURL: opBaseUrl
  })
}
// 添加表单列表信息
export function addForminfo(data:object) {
  return request({
    url: '/op/manager/form/formlistinfo',
    method: 'post',
    data,
    baseURL: opBaseUrl
  })
}
// 获取输入表列表
export function getFormlist(keyTypeCode:number) {
  return request({
    url: '/op/manager/form/formlistinfo',
    method: 'get',
    params: { keyTypeCode },
    baseURL: opBaseUrl
  })
}
// 获取已选择输入表
export function getselectForm(keyTypeCode:number, procDefId:number) {
  return request({
    url: '/op/manager/form/selected',
    method: 'get',
    params: { keyTypeCode, procDefId },
    baseURL: opBaseUrl
  })
}
// 获取表单版本
export function getFormVersion(formId:number) {
  return request({
    url: '/op/manager/form/version',
    method: 'get',
    params: { formId },
    baseURL: opBaseUrl
  })
}
// 获取输入列表树形结构
export function getInputTree(keyTypeCode:number) {
  return (
    request({
      url: '/op/manager/form/fields/tree',
      method: 'get',
      params: { keyTypeCode },
      baseURL: opBaseUrl
    })
  )
}
