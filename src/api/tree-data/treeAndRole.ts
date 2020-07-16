import request from '@/utils/request'
const opBaseUrl = process.env.VUE_APP_MANAGER_API
// 操作业务组
// 获取业务树
export function getGroupTree() {
  return (
    request({
      url: '/op/manager/group/tree',
      method: 'get',
      baseURL: opBaseUrl
    })
  )
}
// 获取分组详细信息
export function getGroupMain() {
  return request({
      url: '/op/manager/group',
      method: 'get',
      baseURL: opBaseUrl
    })
}
// 增加业务主组
export function addGroupMain(data: object) {
  return request({
    url: '/op/manager/group',
    method: 'post',
    data,
    baseURL: opBaseUrl
  })
}
// 删除业务主组
export function removeGroupMain(mainGroupId: number) {
  return request({
    url: '/op/manager/group',
    method: 'delete',
    params: { opTypeGroupId: mainGroupId },
    baseURL: opBaseUrl
  })
}
// 修改业务主组信息
export function modifyGroupMain(data: object) {
  return request({
    url: '/op/manager/group',
    method: 'put',
    data,
    baseURL: opBaseUrl
  })
}
// 移动分组
export function moveGroupMain(data: object) {
  return request({
    url: '/op/manager/group/move',
    method: 'put',
    params: data,
    baseURL: opBaseUrl
  })
}

// 操作业务
// 获取业务详情
export function getOpdetail(keyTypeCode: number) {
  return request({
    url: '/op/manager/op',
    method: 'get',
    params: { keyTypeCode },
    baseURL: opBaseUrl
  })
}
// 增加业务
export function addOpmain(data: object) {
  return request({
    url: '/op/manager/op',
    method: 'post',
    data,
    baseURL: opBaseUrl
  })
}
// 修改业务
export function updateOpmain(data: object) {
  return request({
    url: '/op/manager/op',
    method: 'put',
    data,
    baseURL: opBaseUrl
  })
}
// 删除业务
export function removeOpmain(keyTypeCode: number) {
  return request({
    url: '/op/manager/op',
    method: 'delete',
    params: { keyTypeCode: keyTypeCode },
    baseURL: opBaseUrl
  })
}
// 移动业务
export function moveOpmain(data: object) {
  return request({
    url: '/op/manager/op/move',
    params: data,
    method: 'put',
    baseURL: opBaseUrl
  })
}

// 获取材料分类接口
export function getAllManager() {
  return request({
    url: '/op/manager/material/list',
    method: 'get',
    baseURL: opBaseUrl
  })
}

