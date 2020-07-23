<!-- 侧边栏 父组件-->
<template>
  <div class="content">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.id"
          :item="route"
          :base-path="route.path"
          @jump="jump"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import SidebarItem from './sideItem.vue'

@Component({
  components: {
    SidebarItem
  }
})
export default class extends Vue {
  get routes() {
    const rout: any = (this as any).$router
    return rout.options.routes
  }
  private activeMenu = '0'

  jump(val:string){
    this.$emit('jump',val)
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
}
.el-scrollbar {
  height: 100%;
  width: 100%;
  ::v-deep .el-scrollbar__wrap {
    overflow-x:hidden;
    overflow-y: scroll;
    height: 100%;
  }
}
::v-deep .el-scrollbar__view {
  height: 100%;
}
.has-logo {
  .el-scrollbar {
    height: calc(100% - 50px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100%;
}
</style>
