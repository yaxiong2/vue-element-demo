import request from '@/utils/request'

const globalBaseUrl = process.env.VUE_APP_BASE_API

// 查询菜单列表
export function listMenu(query:object) {
  return request({
    url: '/admin/menu/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 查询菜单详细
export function getMenu(menuId:string) {
  return request({
    url: '/admin/menu/' + menuId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/admin/menu/treeselect',
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId:string) {
  return request({
    url: '/admin/menu/roleMenuTreeselect/' + roleId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增菜单
export function addMenu(data:any) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 修改菜单
export function updateMenu(data:any) {
  return request({
    url: '/admin/menu',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 删除菜单
export function delMenu(menuId:string) {
  return request({
    url: '/admin/menu/' + menuId,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}
