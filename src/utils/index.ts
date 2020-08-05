import Vue from 'vue'
import echarts from 'echarts'
import VueParticles from 'vue-particles'
import '@/directive/index.ts'// 全局自定义指令
import '@/filter/index.ts' // 全局自定义过滤器


Vue.use(VueParticles)
Vue.prototype.$echarts = echarts
