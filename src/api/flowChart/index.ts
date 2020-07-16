import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_MANAGER_API
export interface IInsertEdition {
  'bpmId': string
  'description': string
  'keyTypeCode':number
}
export interface IUpdateProcess {
  asInvalid: boolean
  bpmId: number
  bpmName: string
}
export interface IUpdateEdition {
  id: string,
  flowPhTimeYellow: number | string,
  opTotalTimeYellow: number | string
  opReturnTime: number | string,
  opTotalTime: number | string,
  description?:any,
  version?:any
}
export interface ISaveInputBpm {
  formCaption: string
  formId: number | string
  formType: number
  keyTypeCode: number | string
  procDefId: string
  sortIndex: number
  id: string
  tableVersion:number
}
export interface ISaveOutputBpm {
  description: string
  formId: number
  keyTypeCode: string
  procDefId: string
  reportDefineID: string
  reportId: string
  reportType:string
}

// 流程
export const queryProcess = (keyCodeType:any) => request.get(baseUrl + '/op/manager/bpm', { params: keyCodeType })
export const queryProcessList = (keyCodeType:any) => request.get(baseUrl + '/op/manager/instance/list', { params: keyCodeType })
export const updateProcess = (data:IUpdateProcess) => request.put(baseUrl + '/op/manager/bpm', data)
export const insertProcess = (data: any) => request.post(baseUrl + '/op/manager/bpm', data)
// 版本
export const publishEdition = (data: any) => request.put(baseUrl + '/op/manager/instance/publish', {}, { params: data })
export const updateEdition = (data:IUpdateEdition) => request.put(baseUrl + '/op/manager/instance/edit', data)
export const insertEdition = (data: IInsertEdition) => request.post(baseUrl + '/op/manager/instance', data)
// 获取详情data
export const queryEditionDetail = (data: any) => request.get(baseUrl + '/op/manager/instance', { params: data })
// 更新
export const refreshEdition = (data: {modelId :string}) => request.put(baseUrl + '/op/manager/instance/update', {}, { params: data })
// 根据业务Id获取所有的输入表
export const getInputForms = (params:object) => request.get(baseUrl + '/op/manager/form/list', { params: params })
// 根据输入表id，获取输入表样式版本
export const getInputVersion = (params: {formId:string | number}) => request.get(baseUrl + '/form/designer', { params: params })
// 根据procDefId获取已经选定的版本
export const getSelectedVersion = (params: {procDefId:string}) => request.get(baseUrl + '/op/bpm/form', { params: params })
// 保存输入表版本
export const saveInputFormVersion = (data:any, params:{procDefId:string}) => request.post(baseUrl + '/op/bpm/form', data, { params: params })
// 获取绑定的报表
export const getOutputSelectedVersion = (params:{keyTypeCode:number, procDefId:string}) => request.get(baseUrl + '/op/bpm/report/manager', { params: params })
// 保存输出表版本配置
export const saveOutputFormVersion = (data:ISaveOutputBpm[], params:{keyTypeCode:number, procDefId:string}) => request.post(baseUrl + '/op/bpm/report/manager', data, { params: params })

