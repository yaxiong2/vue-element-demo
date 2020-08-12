<!-- 拖动条 -->
<template>
  <div class="">
    <Drag leftWidth="800px" :leftMinWidth="100" :rightMinWidth="100">
      <div slot="left">左边</div>
      <div slot="right">右边</div>
    </Drag>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Drag from '@/components/拖动条/index.vue'
@Component({
  components: {
    Drag
  }
})
export default class extends Vue {}
</script>
<style lang="scss" scoped></style>
