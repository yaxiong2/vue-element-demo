import request from '@/utils/request'
const opPowerUrl = process.env.VUE_APP_MANAGER_API

// 获取角色权限列表
export function getPowerList(powerType:number) {
  return (
    request({
      url: '/op/power/getPowerDics/' + powerType,
      method: 'get',
      baseURL: opPowerUrl
    })
  )
}
export function getUserPower(data:any) {
  return (
    request({
      url: '/op/power/setUserPower',
      data: data,
      method: 'post',
      baseURL: opPowerUrl
    })
  )
}
export function getUserOriginPower(data: {keyTypeCode:number, userId:string}) {
  const { keyTypeCode, userId } = data
  return (
    request({
      url: `/op/power/${keyTypeCode}/${userId}`,
      method: 'get',
      baseURL: opPowerUrl
    })
  )
}
