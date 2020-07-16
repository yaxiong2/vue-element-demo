import request from '@/utils/request'
const globalBaseUrl = process.env.VUE_APP_BASE_API

// 查询用户列表
export function listUser(query:string) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 获取用户列表树
export function getUserTreeData() {
  return request({
    url: '/admin/user/treeselect',
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 查询用户详细
export function getUser(userId:string) {
  return request({
    url: '/admin/user/' + userId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增用户
export function addUser(data:any) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}
// 修改用户
export function updateUser(data:any) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}
// 当角色为guard的时候修改用户接口
export function updateUserRole(data:any) {
  return request({
    url: '/admin/user/role',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}
// 删除用户
export function delUser(userId:string) {
  return request({
    url: '/admin/user/' + userId,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}

// 用户密码重置
export function resetUserPwd(userId:string, password:string) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/admin/user/resetPwd',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}
// 用户状态修改
export function changeUserStatus(userId:string, status:string) {
  const data = {
    userId,
    status
  }

  return request({
    url: '/admin/user/changeStatus',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/admin/user/profile',
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 修改用户个人信息
export function updateUserProfile(data:any) {
  return request({
    url: '/admin/user/profile',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword:string, newPassword:string) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/admin/user/profile/updatePwd',
    method: 'put',
    params: data,
    baseURL: globalBaseUrl
  })
}

// 用户头像上传
export function uploadAvatar(data:any) {
  return request({
    url: '/admin/user/profile/avatar',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}
