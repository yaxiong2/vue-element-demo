<!-- 测试 -->
<template>
  <div class="main">
    <div>1</div>
    <div class="item">
      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
@Component({})
export default class extends Vue {}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}
.item {
  margin: 50px auto;
  position: relative;
  width: 200px;
  > div {
    border: 1px solid #adadad;
    height: 350px;
    width: 100%;
    padding: 12px;
    position: absolute;
    background: #fff;
    z-index: 99;
  }
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100px;
    transform: scale(0.83);
    top: -10px;
    left: 0;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background-color: #fff;
    z-index: 3;
  }
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100px;
    transform: scale(0.93);
    top: -27px;
    left: 0;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background-color: #fff;
    z-index: 3;
  }
}
</style>
