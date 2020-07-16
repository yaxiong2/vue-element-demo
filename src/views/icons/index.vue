<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="线性图标">
        <div v-for="item of linearIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" :style="{'color':className[Math.floor(Math.random() * className.length)]}" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="填充图标">
        <div v-for="item of lumpIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" :style="{'color':className[Math.floor(Math.random() * className.length)]}" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="组件图标">
        <div v-for="item of componentIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" :style="{'color':className[Math.floor(Math.random() * className.length)]}" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="常用图标">
        <div v-for="item of commonIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" :style="{'color':className[Math.floor(Math.random() * className.length)]}" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="彩色文件图标">
        <div v-for="item of colorfulIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其他图标">
        <div v-for="item of otherIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" :style="{'color':className[Math.floor(Math.random() * className.length)]}" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import clipboard from '@/utils/clipboard'
import { commonIcons, linearIcons, lumpIcons, componentIcons, otherIcons, colorfulIcons } from './svg-icons'
@Component({
  name: 'Icons'
})
export default class Icons extends Vue {
  // private svgIcons: string[] = svgIcons
  private commonIcons: string[] = commonIcons
  private linearIcons: string[] = linearIcons
  private lumpIcons: string[] = lumpIcons
  private componentIcons: string[] = componentIcons
   private colorfulIcons: string[] = colorfulIcons
  private otherIcons: string[] = otherIcons
  private className: string[] = ['#3A71A8', 'orangered', 'green', 'red']

  private generateIconCode(symbol: any) {
    return `<svg-icon icon-class="${symbol}" />`
  }
  private generateElementIconCode(symbol: any) {
    return `<i class="el-icon-${symbol}" />`
  }
  private handleClipboard(text: any, event: any) {
    clipboard(text, event)
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: auto;

  .icon-item {
    margin: 10px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 18px !important;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
