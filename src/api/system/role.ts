import request from '@/utils/request'
const globalBaseUrl = process.env.VUE_APP_BASE_API

// 查询角色列表
export function listRole(query?:string) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 查询角色详细
export function getRole(roleId:string) {
  return request({
    url: '/admin/role/' + roleId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增角色
export function addRole(data:any) {
  return request({
    url: '/admin/role',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 修改角色
export function updateRole(data:any) {
  return request({
    url: '/admin/role',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}
// 修改角色
export function updateRoleAuthor(data:any) {
  return request({
    url: '/admin/role/authorize',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 角色数据权限
export function dataScope(data:any) {
  return request({
    url: '/admin/role/dataScope',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 角色状态修改
export function changeRoleStatus(roleId:string, status:string) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/admin/role/changeStatus',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 删除角色
export function delRole(roleId:string) {
  return request({
    url: '/admin/role/' + roleId,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}
