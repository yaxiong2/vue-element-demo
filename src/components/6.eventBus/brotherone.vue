<!-- 兄弟组件 -->
<template>
  <div class="">
    one{{ count }}
    <el-button @click="handleInfo">获取兄弟2组件信息</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { eventBus } from './eventBus'
@Component
export default class extends Vue {
  private count: any = ''
  handleInfo() {
    eventBus.$on('info', (msg: any) => {
      this.count = msg
    })
  }
}
</script>
<style lang="scss" scoped></style>
