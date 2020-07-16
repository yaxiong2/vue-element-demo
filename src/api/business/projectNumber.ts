import request from '@/utils/request'
import { dataScope } from '../system/role'
const buseBaseUrl = process.env.VUE_APP_MANAGER_API

// 获取项目列表
export function getProjectTypeIds() {
  return request({
    url: '/op/project/getProjectTypeIds',
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 获取项目号详情
export function getDetail(prjTypeDefineId: string) {
  return request({
    url: '/op/project/getProjectTypeIdDetail/' + prjTypeDefineId,
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 删除项目号信息
export function deleteProject(prjTypeDefineId: string) {
  return request({
    url: '/op/project/deleteProjectTypeId/' + prjTypeDefineId,
    method: 'delete',
    baseURL: buseBaseUrl
  })
}
// 新增项目号信息
export function addProject(data: object) {
  return request({
    url: '/op/project/addProjectTypeIdKeyTypeCode',
    data: data,
    method: 'post',
    baseURL: buseBaseUrl
  })
}
// 编辑项目号信息
export function editProject(data: object) {
  return request({
    url: '/op/project/editProjectTypeId',
    data: data,
    method: 'post',
    baseURL: buseBaseUrl
  })
}
