/**
 * 通用js方法封装处理
 * Copyright (c) 2019
 */

import { delData } from '@/api/system/dict/data'
import { RouteConfig } from 'vue-router'
type TCallback = (tree:RouteConfig) => void

// 日期格式化
export function parseTime(time: any, pattern: any) {
  if (arguments.length === 0) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(
    /{(y|m|d|h|i|s|a)+}/g,
    (result: any, key: any) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    }
  )
  return time_str
}

// 添加日期范围
export function addDateRange(this: any, params: any, dateRange: any) {
  var search = params
  if (dateRange != null) {
    search.params = {
      beginTime: this.dateRange[0],
      endTime: this.dateRange[1]
    }
  }
  return search
}

// 回显数据字典
export function selectDictLabel(datas: any, value: any) {
  var actions: any[] = []
  Object.keys(datas).map(key => {
    if (datas[key].dictValue === '' + value) {
      actions.push(datas[key].dictLabel)
      return false
    }
  })
  return actions.join('')
}

// 字符串格式化(%s )
export function sprintf(str: any) {
  var args = arguments
  var flag = true
  var i = 1
  str = str.replace(/%s/g, function() {
    var arg = args[i++]
    if (typeof arg === 'undefined') {
      flag = false
      return ''
    }
    return arg
  })
  return flag ? str : ''
}
const _guid = () => {
  let _index = 0
  return () => Math.random().toString(32) + _index++
}
export const guid = _guid()

export const treeRecursion = (data:RouteConfig[], cb:TCallback) => data && data.map(item => {
  cb(item)
  item.children && treeRecursion(item.children, cb)
  return item
})
export const setLocalRoutes = (data:any) => {
  sessionStorage.setItem('__routes', JSON.stringify(data))
}
export const getLocalRoutes = () => {
  return JSON.parse(sessionStorage.getItem('__routes') || '')
}
export const removeLocalRoutes = () => {
  sessionStorage.setItem('__routes', '')
}
export const download = (filename:string, url:string) => {
  var oReq = new XMLHttpRequest()
  oReq.open('GET', url, true)
  oReq.responseType = 'blob'
  oReq.onload = function(oEvent) {
      var content = oReq.response

      var elink = document.createElement('a')
      elink.download = filename
      elink.style.display = 'none'

      var blob = new Blob([content])
      elink.href = URL.createObjectURL(blob)

      document.body.appendChild(elink)
      elink.click()

      document.body.removeChild(elink)
  }
  oReq.send()
}
