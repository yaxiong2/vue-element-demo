import request from '@/utils/request'
const opFieldUrl = process.env.VUE_APP_MANAGER_API
// 操作公共字段 相关字段
// 获取公共字段列表
export function getPublicFieldList() {
  return (
    request({
      url: '/op/field/getPublicFields',
      method: 'get',
      baseURL: opFieldUrl
    })
  )
}
// 编辑公共字段
export function setPublicField(data:object) {
  return (
    request({
      url: '/op/field/editPublicField',
      method: 'post',
      data,
      baseURL: opFieldUrl
    })
  )
}
// 删除单个公共字段
export function deletePublicField(publicFldId:string) {
  return (
    request({
      url: '/op/field/deletePublicField/' + publicFldId,
      method: 'delete',
      baseURL: opFieldUrl
    })
  )
}
// 获取相关字段列表
export function getRelevantFieldList() {
  return (
    request({
      url: '/op/field/getRelationFields',
      method: 'get',
      baseURL: opFieldUrl
    })
  )
}
// 添加相关字段
export function setRelationField(data:object) {
  return (
    request({
      url: '/op/field/editRelationField',
      method: 'post',
      data,
      baseURL: opFieldUrl
    })
  )
}
// 删除单个相关字段
export function deleteRelationField(data:Array<number>) {
  return (
    request({
      url: '/op/field/deleteRelationFields',
      method: 'post',
      data,
      baseURL: opFieldUrl
    })
  )
}
// 根据业务id获取公共字段
export function getKeytypecodePublicField(keyTypeCode:number) {
  return (
    request({
      url: '/op/field/getKeyTypeCodePublicFields/' + keyTypeCode,
      method: 'get',
      baseURL: opFieldUrl
    })
  )
}
// 根据业务id获取相关字段
export function getKeytypecodeRelationField(keyTypeCode:number) {
  return (
    request({
      url: '/op/field/getRelationFieldByKeyTypeCode/' + keyTypeCode,
      method: 'get',
      baseURL: opFieldUrl
    })
  )
}
// 编辑业务表单所绑定的公共字段
export function setKeytypecodePublicField(data:object) {
  return (
    request({
      url: '/op/field/editPublicFieldKeyTypeCode',
      method: 'post',
      data,
      baseURL: opFieldUrl
    })
  )
}
// 编辑业务表单所绑定的相关字段
export function setKeytypecodeRelationField(data:object) {
  return (
    request({
      url: '/op/field/editKeyTypeCodeRelationField',
      method: 'post',
      data,
      baseURL: opFieldUrl
    })
  )
}
// 删除业务表单所绑定的公共字段
export function deleteRolePublicField(id:number) {
  return (
    request({
      url: '/op/field/deleteKeyTypeCodePublicField/' + id,
      method: 'delete',
      baseURL: opFieldUrl
    })
  )
}
// 删除业务表单所绑定的想关字段
export function deleteRoleRelationField(data:[number]) {
  return (
    request({
      url: '/op/field/deleteKeyTypeCodePublicField',
      method: 'post',
      data,
      baseURL: opFieldUrl
    })
  )
}

