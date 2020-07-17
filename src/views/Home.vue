<!-- 主页面 -->
<template>
  <div class="content">
    <div>
      <sideBar @jump="jump"></sideBar>
    </div>
    <div>
      <div>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import sideBar from '@/views/sideBar/index.vue'
@Component({
  name: 'home',
  components: {
    sideBar
  }
})
export default class extends Vue {
  get cachedViews(){
    return '/about/star'
  }
  get key(){
    return '/about/star'
  }
  jump(val:any){
    console.log(val)
  }
}
</script>
<style lang='scss' scoped>
.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  > div:first-child {
    height: 100%;
    width: 246px;
  }
  > div:nth-child(2) {
    width: 100%;
    height: calc(100% - 48px);
    padding: 24px;
    background: rgba($color: #6e6e6e7c, $alpha: 0.2);
    > div {
      width: 100%;
      height: 100%;
      background: #fff;
    }
  }
}
</style>