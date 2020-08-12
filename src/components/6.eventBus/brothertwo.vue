<!-- 兄弟组件 -->
<template>
  <div class="">
    two
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { eventBus } from './eventBus'
@Component
export default class extends Vue {
  private count = 1
  mounted() {
    eventBus.$emit('info', '来自two的信息' )
  }
}
</script>
<style lang="scss" scoped></style>
