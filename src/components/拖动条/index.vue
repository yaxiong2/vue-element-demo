<template>
  <div id="box">
    <div id="left" :style="`min-width:${leftMinWidth}px;width:${leftWidths} `">
      <slot name="left"></slot>
    </div>
    <div id="resize" title="可拖拽面板">
      <div id="darg_btn"></div>
    </div>
    <div id="right" :style="`min-width:${rightMinWidth}px`">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'ResizeContent'
})
export default class Draggle extends Vue {
  @Prop({ default: '35%' }) private leftWidth!: string
  @Prop({ default: 200 }) private leftMinWidth!: number
  @Prop({ default: 300 }) private rightMinWidth!: number
  @Prop({ default: true }) private isResizeable!: boolean
  private leftWidths: string = this.leftWidth
  private resizeWidth = 12
  private leftMinWidths: number = this.leftMinWidth
  private rightMinWidths: number = this.rightMinWidth
  @Watch('leftWidth')
  private leftWidthChange(value: string) {
    this.leftWidths = value
  }

  dragControllerDiv() {
    const that = this
    const resize: any = document.getElementById('resize')
    const left: any = document.getElementById('left')
    const right: any = document.getElementById('right')
    const box: any = document.getElementById('box')
    const leftMinWidth = this.leftMinWidths
    const rightMinWidth = this.rightMinWidths
    const resizeWidth = this.resizeWidth
    const leftWidths = this.leftWidths
    const leftWidth = this.leftWidth
    resize.onmousedown = function(event: any) {
      event = event || window.event // ie浏览器只支持event
      if (leftWidths !== '0' && leftWidths !== '100%') {
        const startX = event.clientX
        resize.left = resize.offsetLeft
        document.onmousemove = function(event) {
          const endX = event.clientX
          let moveLen = resize.left + (endX - startX)
          let boxWidth = box.clientWidth
          const maxT = boxWidth - resize.offsetWidth
          boxWidth = box.clientWidth
          if (moveLen < leftMinWidth) moveLen = leftMinWidth
          if (moveLen > maxT - rightMinWidth) moveLen = maxT - rightMinWidth
          that.$emit('widthChange', moveLen)
          resize.style.left = moveLen
          left.style.width = moveLen + 'px'
          right.style.width = boxWidth - moveLen - resizeWidth + 'px'
        }
      }
      document.onmouseup = function() {
        document.onmousemove = null
        document.onmouseup = null
        resize.releaseCapture && resize.releaseCapture()
      }
      resize.setCapture && resize.setCapture()
      return false
    }
  }
  toLeft() {
    const right: any = document.getElementById('right')
    if (this.leftWidths !== this.leftWidth) {
      right.style.width = 0
      this.leftWidths = this.leftWidth
      if (this.isResizeable) this.dragControllerDiv()
    } else {
      right.style.width = 0
      this.leftWidths = '0'
      if (this.isResizeable) this.dragControllerDiv()
    }
  }
  toRight() {
    const right: any = document.getElementById('right')
    if (this.leftWidths !== this.leftWidth) {
      right.style.width = 0
      this.leftWidths = this.leftWidth
      if (this.isResizeable) this.dragControllerDiv()
    } else {
      right.style.width = 0
      this.leftWidths = '100%'
      if (this.isResizeable) this.dragControllerDiv()
    }
  }
  mounted() {
    if (this.isResizeable) {
      this.dragControllerDiv()
    }
  }
}
</script>

<style scoped lang="scss">
#box {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  background-color: #fff;
}
#left {
  height: 100%;
  overflow: auto;
}

#resize {
  width: 2px;
  height: 100%;
  z-index: 1;
  background-color: #e4e7ed;
  position: relative;
  #darg_btn {
    width: 12px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -10px;
    transform: translateX(-50%);
    cursor: w-resize;
    background-image: url('../../assets/drag.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}
#right {
  height: 100%;
  flex-grow: 1;
  overflow: auto;
  width: 0;
}
</style>
