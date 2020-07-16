import request from '@/utils/request'
const buseBaseUrl = process.env.VUE_APP_BUSINESS_API

// 业务主组api
// 获取业务主组
export function getGroupMain() {
  return request({
    url: '/business/getOpGroupMain',
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 增加业务主组
export function addGroupMain(data:object) {
  return request({
    url: '/business/addOpGroupMain',
    method: 'post',
    data: data,
    baseURL: buseBaseUrl
  })
}
// 删除业务主组
export function removeGroupMain(mainGroupId:number) {
  return request({
    url: '/business/deleteOpGroupMain/' + mainGroupId,
    method: 'delete',
    baseURL: buseBaseUrl
  })
}
// 修改业务主组信息
export function modifyGroupMain(data:object) {
  return request({
    url: '/business/modifyOpGroupMain',
    method: 'post',
    data: data,
    baseURL: buseBaseUrl
  })
}

// 业务组api
// 获取业务组
export function getOpGroup(mainGroupId:number) {
  return request({
    url: '/business/getOpGroups/' + mainGroupId,
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 获取所有的业务组
export function getAllOpGroup() {
  return request({
    url: '/business/getOpGroups',
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 增加业务组
export function addOpGroup(data:object) {
  return request({
    url: '/business/addOpGroup',
    method: 'post',
    data: data,
    baseURL: buseBaseUrl
  })
}
// 删除业务组
export function removeOpGroup(opGroupId:number) {
  return request({
    url: '/business/deleteOpGroup/' + opGroupId,
    method: 'delete',
    baseURL: buseBaseUrl
  })
}
// 修改业务组
export function modifyOpGroup(data:object) {
  return request({
    url: '/business/modifyOpGroup',
    method: 'post',
    data: data,
    baseURL: buseBaseUrl
  })
}

// 基础接口业务
// 获取基础业务
export function getGroup(opGroupId:number) {
  return request({
    url: '/business/getOpList/' + opGroupId,
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 获取所有基础业务
export function getAllGroup() {
  return request({
    url: '/business/getOpList/',
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 增加基础业务
export function addGroup(data:object) {
  return request({
    url: '/business/addOp',
    method: 'post',
    data: data,
    baseURL: buseBaseUrl
  })
}
// 删除基础业务
export function removeGroup(keyTypeCode:number) {
  return request({
    url: '/business/deleteOp/' + keyTypeCode,
    method: 'delete',
    baseURL: buseBaseUrl
  })
}
// 修改基础业务
export function modifyGroup(data:object) {
  return request({
    url: '/business/modifyOp',
    method: 'post',
    data: data,
    baseURL: buseBaseUrl
  })
}
