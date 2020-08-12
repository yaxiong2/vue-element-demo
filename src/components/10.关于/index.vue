<!-- 关于 -->
<template>
  <div class="">
    <div>联系方式</div>
    <div>微信/手机:17673349714</div>
    <div>{{ '2018-09-14 01:05' | formaDate('yyyy-MM-dd hh:mm:ss w') }}</div>
    <div>{{ '2018-09-14 01:05' | formaDate('yyyy-MM-dd w') }}</div>
    <div>{{ '2018-09-14 01:05' | formaDate('MM/dd w') }}</div>
    <div>{{ '2018-09-14 01:05' | formaDate('w') }}</div>
    <el-input type="text" v-model="text" v-focus></el-input>
    <div>{{ text | trim(1) }}</div>
    <div>{{ text | trim(2) }}</div>
    <div>{{ text | trim(3) }}</div>
    <div>{{ text | trim(4) }}</div>
    <div>{{ text | changeCase(1) }}</div>
    <div>{{ text | changeCase(2) }}</div>
    <div>{{ text | changeCase(3) }}</div>
    <div>{{ text | changeCase(4) }}</div>
    <div>{{ text | changeCase(5) }}</div>

    <svg-icon icon-class="icl-app" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
})
export default class extends Vue {
  private text = ''
}
</script>
<style lang="scss" scoped></style>
