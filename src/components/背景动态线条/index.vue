<!-- 动态线条 -->
<template>
  <div class=""></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { start } from "./index.js";
@Component({})
export default class extends Vue {
  created(){
    this.$nextTick(()=>{
      start()
    })
  }
}
</script>
<style lang="scss" scoped></style>
