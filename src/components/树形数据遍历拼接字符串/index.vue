<!--  -->
<template>
  <div class>
    <div v-text="data"></div>
    <br />
    <br />
    <br />
    <br />
    <div v-text="datas"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class extends Vue {
  private data: any = require('./data.json')
  get datas() {
    return this.findPathByLeafId('star',this.data).join('/')
  }
  findPathByLeafId (leafId:any, nodes:any, path?:any):any {
    if (path === undefined) {
      path = []
    }
    for (let i = 0; i < nodes.length; i++) {
      const tmpPath = path.concat()
      tmpPath.push(nodes[i].path)
      if (leafId == nodes[i].path) {
        return tmpPath
      }
      if (nodes[i].children) {
        const findResult = this.findPathByLeafId(leafId, nodes[i].children, tmpPath)
        if (findResult) {
          return findResult
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>