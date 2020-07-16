import request from '@/utils/request'
import { dataScope } from '../system/role'
const buseBaseUrl = process.env.VUE_APP_MANAGER_API

// 获取许可证列表
export function getProjectTypeIds() {
  return request({
    url: '/op/manager/license/licenses',
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 获取许可证详情
export function getDetail(licenseId: string) {
  return request({
    url: '/op/manager/license',
    params: { licenseId: licenseId },
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 删除项目号信息
export function deleteProject(licenseId: number) {
  return request({
    url: '/op/manager/license',
    params: { licenseId: licenseId },
    method: 'delete',
    baseURL: buseBaseUrl
  })
}
// 新增项目号信息
export function addProject(data: object) {
  return request({
    url: '/op/manager/license',
    data: data,
    method: 'post',
    baseURL: buseBaseUrl
  })
}
// 编辑项目号信息
export function editProject(data: object) {
  return request({
    url: '/op/manager/license',
    data: data,
    method: 'put',
    baseURL: buseBaseUrl
  })
}
// 获取许可证索引列表
export function indexList(licenseId: number) {
  return request({
    url: '/op/manager/license/index/indexList',
    params: { licenseId: licenseId },
    method: 'get',
    baseURL: buseBaseUrl
  })
}
// 添加许可证索引值
export function addIndexVal(data: object) {
  return request({
    url: '/op/manager/license/index',
    data: data,
    method: 'post',
    baseURL: buseBaseUrl
  })
}
// 修改许可证索引值
export function editIndexVal(data: object) {
  return request({
    url: '/op/manager/license/index',
    data: data,
    method: 'put',
    baseURL: buseBaseUrl
  })
}
// 删除许可证索引值
export function deleteIndexVal(params: object) {
  return request({
    url: '/op/manager/license/index',
    params: params,
    method: 'delete',
    baseURL: buseBaseUrl
  })
}
