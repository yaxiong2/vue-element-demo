import request from '@/utils/request'
const opPowerUrl = process.env.VUE_APP_MANAGER_API

// 获取单位机构类型的列表
export function getProjectList() {
  return (
    request({
      url: '/op/manager/project/company/getCompanyTypeInfo',
      method: 'get',
      baseURL: opPowerUrl
    })
  )
}
// 增加单位机构类型
export function addProject(data:object) {
  return (
    request({
      url: 'op/manager/project/company/addCompanyTypeInfo',
      method: 'post',
      data,
      baseURL: opPowerUrl
    })
    )
  }
  // 删除单位机构类型
  export function deleteProject(companyTypeCode:number) {
    return (
      request({
        url: '/op/manager/project/company/deleteCompanyTypeInfo/' + companyTypeCode,
        method: 'delete',
        baseURL: opPowerUrl
      })
    )
  }
  // 修改单位机构类型
  export function updateProject(data:object) {
    return (
      request({
        url: '/op/manager/project/company/updateCompanyTypeInfo',
        method: 'put',
        data,
        baseURL: opPowerUrl
      })
    )
  }
// 获取项目类型信息的列表
export function getSubjectList() {
  return (
    request({
      url: '/op/manager/project/kind/getProjectKindInfo',
      method: 'get',
      baseURL: opPowerUrl
    })
  )
}
// 增加项目类型信息
export function addSubject(data:object) {
  return (
    request({
      url: 'op/manager/project/kind/addProjectKindInfo',
      method: 'post',
      data,
      baseURL: opPowerUrl
    })
    )
  }
  // 删除项目类型信息
  export function deleteSubject(projectKindId:number) {
    return (
      request({
        url: '/op/manager/project/kind/deleteProjectKindInfo/' + projectKindId,
        method: 'delete',
        baseURL: opPowerUrl
      })
    )
  }
  // 修改项目类型信息
  export function updateSubject(data:object) {
    return (
      request({
        url: '/op/manager/project/kind/updateProjectKindInfo',
        method: 'put',
        data,
        baseURL: opPowerUrl
      })
    )
  }
// 获取项目类型信息的列表
export function getDistrictList() {
  return (
    request({
      url: '/op/manager/project/district/getDistrictInfo',
      method: 'get',
      baseURL: opPowerUrl
    })
  )
}
// 增加项目类型信息
export function addDistrict(data:object) {
  return (
    request({
      url: 'op/manager/project/district/addDistrictInfo',
      method: 'post',
      data,
      baseURL: opPowerUrl
    })
    )
  }
  // 删除项目类型信息
  export function deleteDistrict(districtId:number) {
    return (
      request({
        url: '/op/manager/project/district/deleteDistrictInfo/' + districtId,
        method: 'delete',
        baseURL: opPowerUrl
      })
    )
  }
  // 修改项目类型信息
  export function updateDistrict(data:object) {
    return (
      request({
        url: '/op/manager/project/district/updateDistrictInfo',
        method: 'put',
        data,
        baseURL: opPowerUrl
      })
    )
  }
