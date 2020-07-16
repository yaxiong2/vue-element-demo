import request from '@/utils/request'

const globalBaseUrl = process.env.VUE_APP_BASE_API
// 查询公告列表
export function listNotice(query:object) {
  return request({
    url: '/admin/notice/list',
    method: 'get',
    params: query,
    baseURL: globalBaseUrl
  })
}

// 查询公告详细
export function getNotice(noticeId:string) {
  return request({
    url: '/admin/notice/' + noticeId,
    method: 'get',
    baseURL: globalBaseUrl
  })
}

// 新增公告
export function addNotice(data:any) {
  return request({
    url: '/admin/notice',
    method: 'post',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 修改公告
export function updateNotice(data:any) {
  return request({
    url: '/admin/notice',
    method: 'put',
    data: data,
    baseURL: globalBaseUrl
  })
}

// 删除公告
export function delNotice(noticeId:string) {
  return request({
    url: '/admin/notice/' + noticeId,
    method: 'delete',
    baseURL: globalBaseUrl
  })
}
