import request from '@/utils/request'

const globalBaseUrl = process.env.VUE_APP_BASE_API

// 查询部门列表
export function listDept(query:object) {
  return request({
    url: '/admin/dept/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 查询部门详细
export function getDept(deptId:string) {
  return request({
    url: '/admin/dept/' + deptId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/admin/dept/treeselect',
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId:string) {
  return request({
    url: '/admin/dept/roleDeptTreeselect/' + roleId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增部门
export function addDept(data:any) {
  return request({
    url: '/admin/dept',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 修改部门
export function updateDept(data:any) {
  return request({
    url: '/admin/dept',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 删除部门
export function delDept(deptId:string) {
  return request({
    url: '/admin/dept/' + deptId,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}
