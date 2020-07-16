import request from '@/utils/request'
const opRoleUrl = process.env.VUE_APP_MANAGER_API
// 操作角色
// 获取角色流程版本列表
export function getRoleVersion(keyTypeCode: number) {
  return request({
    url: '/op/manager/bpm',
    method: 'get',
    params: { keyTypeCode },
    baseURL: opRoleUrl
  })
}

// 获取业务下指定类型的角色列表
export function getRoleTree(keyTypeCode: number, procDefId: string, roleType: number) {
  return request({
    url: '/op/role/getRolesByRoleType/' + keyTypeCode + '/' + roleType + '/' + procDefId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 删除角色
export function removeRole(data: [number]) {
  return request({
    url: '/op/role/deleteRolesByRoleIds',
    method: 'post',
    data: data,
    baseURL: opRoleUrl
  })
}
// 修改(添加)角色
export function modifyRole(data: object) {
  return request({
    url: '/op/role/editRole',
    method: 'post',
    data,
    baseURL: opRoleUrl
  })
}
// 获取业务角色权限列表
export function getRolelist(keyTypeCode: number, roleId: number) {
  return request({
    url: '/op/role/getRolePowers/' + keyTypeCode + '/' + roleId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 获取角色表单列表
export function getRoleFormlist(keyTypeCode: number, roleId: number) {
  return request({
    url: '/op/role/getRoleForms/' + keyTypeCode + '/' + roleId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 设置角色与表单关联信息
export function setRoleFormInfo(data: object) {
  return request({
    url: '/op/role/setRoleForm',
    data,
    method: 'post',
    baseURL: opRoleUrl
  })
}
// 获取输入表权限表字段
export function getRoleInputField(keyTypeCode: number, roleId: number, formId: number) {
  return request({
    url: '/op/role/getRoleFormFields/' + keyTypeCode + '/' + roleId + '/' + formId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 获取输出表权限
export function getRoleOutput(keyTypeCode: number, roleId: number) {
  return request({
    url: '/op/role/getRoleReports/' + keyTypeCode + '/' + roleId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 设置输入表字段权限
export function setInputFiled(data: object) {
  return request({
    url: '/op/role/setRoleFormField',
    method: 'post',
    data,
    baseURL: opRoleUrl
  })
}
// 设置输出表权限
export function setOutputRole(data: object) {
  return request({
    url: '/op/role/setRoleReport',
    method: 'post',
    data,
    baseURL: opRoleUrl
  })
}
// 获取角色材料信息列表
export function getRoleMaterial(keyTypeCode: number, roleId: number) {
  return request({
    url: '/op/role/getRoleMaterials/' + keyTypeCode + '/' + roleId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 批量设置角色与材料关联信息
export function setRoleMaterial(data: object) {
  return request({
    url: '/op/role/setRoleMaterials',
    method: 'post',
    data,
    baseURL: opRoleUrl
  })
}

// 获取角色权限列表
export function getRolePower(keyTypeCode: number, roleId: number, powerType: number) {
  return request({
    url: '/op/role/getRolePowers/' + keyTypeCode + '/' + roleId + '/' + powerType,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 设置输出表权限
export function setPowerRole(data: object) {
  return request({
    url: '/op/role/setRolePower',
    method: 'post',
    data,
    baseURL: opRoleUrl
  })
}
// 获取人员配置信息
export function getRoleUsers(keyTypeCode: number, roleId: number) {
  return request({
    url: '/op/role/getRoleUsers/' + keyTypeCode + '/' + roleId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 获取箱子人员配置信息
export function getBoxRoleUsers(keyTypeCode: number, roleId: number) {
  return request({
    url: '/op/role/getBoxRoleUsers/' + keyTypeCode + '/' + roleId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 设置角色与用户关联信息
export function setRoleUsers(data: object) {
  return request({
    url: '/op/role/setRoleUsers',
    method: 'post',
    data,
    baseURL: opRoleUrl
  })
}
// 设置箱子角色与用户关联信息
export function setBoxRoleUsers(data: object) {
  return request({
    url: '/op/role/setBoxRoleUsers',
    method: 'post',
    data,
    baseURL: opRoleUrl
  })
}
// 获取业务角色与箱子关联信息列表
export function getRoleBox(keyTypeCode: number, roleId: number) {
  return request({
    url: '/op/role/getRoleBox/' + keyTypeCode + '/' + roleId,
    method: 'get',
    baseURL: opRoleUrl
  })
}
// 添加角色与箱子关联信息
export function addRoleBox(data: object) {
  return request({
    url: '/op/role/addRoleBox',
    method: 'post',
    data,
    baseURL: opRoleUrl
  })
}
// 删除业务角色与箱子关联信息
export function deleteRoleBox(keyTypeCode: number, roleId: number, boxId: number) {
  return request({
    url: '/op/role/deleteRoleBox/' + keyTypeCode + '/' + roleId + '/' + boxId,
    method: 'delete',
    baseURL: opRoleUrl
  })
}
