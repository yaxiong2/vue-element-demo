import Vue from 'vue'
import { Form as _Form, Message } from 'element-ui'
import Router, { Route } from 'vue-router'
import { AxiosPromise } from 'axios'

declare module 'vue/types/vue' {
  interface Vue {
    $router: Router
    $route: Route
    $message: typeof Message
    getDicts: (argv:string)=>AxiosPromise
    addDateRange: (...argv:any[])=>any
    selectDictLabel: (...argv:any[])=>string
  }
}
type Form = _Form
type Loading = { start: () => {}, close: () => {}}
