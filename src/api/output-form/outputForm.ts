import request from '@/utils/request'

const buseBaseUrl = process.env.VUE_APP_MANAGER_API + '/op'
// 报表管理api
// 获取报表
export function getOutputForm(params:object) {
  return request({
    method: 'get',
    url: '/report/reports',
    params: params,
    baseURL: buseBaseUrl
  })
}
// 新建报表
export function addOutputForm(data:object) {
  return request({
    method: 'post',
    url: '/report',
    params: data,
    baseURL: buseBaseUrl
  })
}
// 删除报表
export function removeOutputForm(reportId:string) {
  return request({
    method: 'delete',
    url: '/report/' + reportId,
    baseURL: buseBaseUrl
  })
}
// 作废报表
export function disabledOutputForm(params:object) {
  return request({
    method: 'put',
    url: '/report/disable',
    params: params,
    baseURL: buseBaseUrl
  })
}
// 启用报表
export function recoverOutputForm(params:object) {
  return request({
    method: 'put',
    url: '/report/recover',
    params: params,
    baseURL: buseBaseUrl
  })
}
// 修改报表名称
export function editOutputForm(params:object) {
  return request({
    method: 'put',
    url: '/report/reportName',
    params: params,
    baseURL: buseBaseUrl
  })
}
// 查询报表模板
export function getReportTemplate(params: {reportId:string, reportDefineId:number}) {
  return request({
    method: 'get',
    url: '/reportTemplate/templates',
    params: params,
    baseURL: buseBaseUrl
  })
}
// 清空报表模板
export function clearReportTemplate(reportInd:string) {
  return request({
    method: 'delete',
    url: '/reportTemplate/template/reportId/' + reportInd,
    baseURL: buseBaseUrl
  })
}
// 删除报表模板
export function delReportTemplate(reportDefineId:string) {
  return request({
    method: 'delete',
    url: '/reportTemplate/template/reportDefineId/' + reportDefineId,
    baseURL: buseBaseUrl
  })
}
// 新增报表模板
export function addReportTemplate(params: {reportId: string, description:string}, file:any, content:any) {
  return request({
    method: 'post',
    url: '/reportTemplate',
    params: params,
    onUploadProgress: progressEvent => {
      let percent = (progressEvent.loaded / progressEvent.total * 100) | 0
      // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
      content.onProgress({ percent: percent })
    },
    data: file,
    baseURL: buseBaseUrl
  })
}
// 更新报表模板
export function updateReportTemplate(params:{reportDefineId:string, description:string}, file:any) {
  return request({
    method: 'put',
    url: '/reportTemplate',
    params: params,
    data: file,
    baseURL: buseBaseUrl
  })
}
// 下载报表模板
export function downloadReportTemplate(reportDefineId:string) {
  return request({
    responseType: 'blob',
    method: 'get',
    url: '/reportTemplate/template/' + reportDefineId,
    baseURL: buseBaseUrl
  })
}
