import request from '@/utils/request'
const globalBaseUrl = process.env.VUE_APP_BASE_API

// 查询岗位列表
export function listPost(query?:object) {
  return request({
    url: '/admin/post/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 查询岗位详细
export function getPost(postId?:string) {
  return request({
    url: '/admin/post/' + postId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增岗位
export function addPost(data:any) {
  return request({
    url: '/admin/post',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 修改岗位
export function updatePost(data:any) {
  return request({
    url: '/admin/post',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 删除岗位
export function delPost(postId:string) {
  return request({
    url: '/admin/post/' + postId,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}
