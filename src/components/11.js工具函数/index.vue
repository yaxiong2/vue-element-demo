<!-- js工具函数 -->
<template>
  <div class="">
    <!-- 生成一周时间 -->
    <div>
      <p>function getWeekTime(){ return [...new Array(7)].map((j,i)=> new Date(Date.now()+i*8.64e7).toLocaleDateString()) }</p>
      <el-button @click="getWeekTime">生成一周时间</el-button>
      <p>{{ weekTime }}</p>
    </div>
    <br />
    <!-- 数据类型检查 -->
    <div>
      <el-select v-model="text" placeholder="请选择数据">
        <el-option v-for="item in datas" :key="item" :label="item" :value="item"> </el-option>
      </el-select>

      <el-select v-model="type" placeholder="请选择数据类型">
        <el-option v-for="item in types" :key="item" :label="item" :value="item"> </el-option>
      </el-select>
      <el-button @click="check">数据类型检查</el-button>
      <p>{{ result }}</p>
    </div>
    <br />
    <!-- 对象属性剔除 -->
    <div>
      <p>{{ obj }}</p>
      <el-input v-model="delData" placeholder="输入要删除的属性"></el-input>
      <el-button @click="obj = omit(obj, delData)">剔除</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component
export default class extends Vue {
  private weekTime: any = ''
  private text: any = '数组' //数据
  private type = 'Array' //数剧类型
  private types: any = ['Array', 'RegExp', 'Date', 'Function', 'Symbol'] //数据类型
  private datas: any = ['数组', '正则', '日期', '函数', 'Symbol'] // 数据
  private result: any = ''
  private delData = ''
  private obj: any = {
    name: '张三',
    sex: '男',
    salary: '10000'
  }
  getWeekTime() {
    return (this.weekTime = [...new Array(7)].map((j, i) => new Date(Date.now() + i * 8.64e7).toLocaleDateString()))
  }
  isType(target: any, type: string) {
    let targetType = Object.prototype.toString
      .call(target)
      .slice(8, -1)
      .toLowerCase()
    return targetType === type.toLowerCase()
  }
  check() {
    switch (this.text) {
      case '数组':
        this.result = this.isType([], this.type)
        break
      case '正则':
        this.result = this.isType(/\d/, this.type)
        break
      case '日期':
        this.result = this.isType(new Date(), this.type)
        break
      case '函数':
        this.result = this.isType(function() {}, this.type)
        break
      case 'Symbol':
        this.result = this.isType(Symbol(1), this.type)
        break
      default:
        break
    }
  }
  omit(object: any, props: any = []) {
    let res: any = {}
    Object.keys(object).forEach((key: string) => {
      if (props.includes(key) === false) {
        res[key] = typeof object[key] === 'object' && object[key] !== null ? JSON.parse(JSON.stringify(object[key])) : object[key]
      }
    })
    return res
  }
  created() {
    this.$nextTick(() => {
      this.nature()
    })
  }
  //性能分析
  nature() {
    setTimeout(() => {
      let t = performance.timing,
        m = (performance as any).memory
      console.table({
        DNS查询耗时: (t.domainLookupEnd - t.domainLookupStart).toFixed(2),
        TCP链接耗时: (t.connectEnd - t.connectStart).toFixed(2),
        request请求耗时: (t.responseEnd - t.responseStart).toFixed(2),
        解析dom树耗时: (t.domComplete - t.domInteractive).toFixed(2),
        白屏时间: (t.responseStart - t.navigationStart).toFixed(2),
        domready时间: (t.domContentLoadedEventEnd - t.navigationStart).toFixed(2),
        onload时间: (t.loadEventEnd - t.navigationStart).toFixed(2),
        js内存使用占比: m ? ((m.usedJSHeapSize / m.totalJSHeapSize) * 100).toFixed(2) + '%' : undefined
      })
    })
  }
}
</script>
<style lang="scss" scoped></style>
