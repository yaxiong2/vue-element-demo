<!-- 测试 -->
<template>
  <div class="main">
    <a href="javascript:#">Button</a>
    <a href="javascript:#">Button</a>
    <a href="javascript:#">Button</a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class extends Vue {}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #111 !important;
  a {
    margin: 50px;
    color: cornflowerblue;
    padding: 10px 30px;
    font-size: 20px;
    text-align: center;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    transition: 0.5s;
    transition-delay: 0.5s;
    -webkit-box-reflect: below 1px linear-gradient(transparent,#0003);
    &:hover {
      background: cornflowerblue;
      color: #111;
      box-shadow: 0 0 50px cornflowerblue;
      transition-delay: 0.5s;
    }
    &:hover::before,
    &:hover::after {
      width: 100%;
      height: 100%;
      transition-delay: 0;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 10px;
      height: 10px;
      border-top: 2px solid cornflowerblue;
      border-left: 2px solid cornflowerblue;
      transition: 0.5s;
      transition-delay: 0.5s;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-bottom: 2px solid cornflowerblue;
      border-right: 2px solid cornflowerblue;
      transition: 0.5s;
      transition-delay: 0.5s;
    }
    &:first-child {
      filter: hue-rotate(115deg);
    }
    &:last-child{
      filter: hue-rotate(270deg);
    }
  }
}
</style>
