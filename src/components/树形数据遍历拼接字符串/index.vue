<!--  -->
<template>
  <div class>
    <div v-text="data"></div>
    <br />
    <br />
    <br />
    <br />
    <div v-text="datas"></div>
    <br />
    <br />
    <br />
    <br />
    <div v-text="ids"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  private data: any = require('./data.json')
  get datas() {
    return this.findPathByLeafId('star', this.data).join('/')
  }
  findPathByLeafId(leafId: string, nodes: any, path?: any): any {
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

  get ids() {
    return this.getID({ name: 'yuyu', age: '15', salary: '1500' }, ['name', 'age'])
  }
  getID(obj: any, str: any) {
    return [obj[str[0]], obj[str[1]]]
  }
}
</script>
<style lang="scss" scoped></style>
