import request from '@/utils/request'
export interface IMaterial {
  materialFileType: string
  materialTypeName: string
  companyNum?: number
  materialGroupId?: number
  materialTypeId?: number
  sortIndex?: number
}
export interface IbpmMaterial {
  asArchive: boolean,
  id: number,
  keyTypeCode: number,
  materialConditionType: number,
  materialFileType: string,
  materialTypeId: number,
  materialTypeName: string,
  processDefId: string,
  sortIndex: number
  [propName:string]:any
}
export interface IbpmMaterialInsert {
  keyTypeCode :number,
  materialTypeId: number,
  materialTitle:string,
  asArchive:boolean
}
const baseUrl = process.env.VUE_APP_MANAGER_API
export const query = () => request.get(baseUrl + '/op/material/manager/list')
export const insert = (data:IMaterial) => request.post(baseUrl + '/op/material/manager', data)
export const update = (data:IMaterial) => request.put(baseUrl + '/op/material/manager', data)
export const del = ({ materialTypeId }:IMaterial) => request.delete(baseUrl + `/op/material/manager/${materialTypeId}`)
export const bpmQuery = (keyCodeType: any) => request.get(baseUrl + '/op/bpm/material/manager', { params: keyCodeType })
export const bpmInsert = (data: any) => request.post(baseUrl + '/op/bpm/material/manager', {}, { params: data })
export const bpmUpdate = (data:IbpmMaterial[]) => request.put(baseUrl + '/op/bpm/material/manager', data)
export const bpmDel = ({ id }:IbpmMaterial) => request.delete(baseUrl + `/op/bpm/material/manager/${id}`)
