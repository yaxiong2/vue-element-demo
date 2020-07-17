<!-- 侧边栏子组件 -->
<template>
  <router-link v-if="!item.children || item.children.length<1" to="/about/star">
    <el-menu-item :index="basePath" @click="jump(item.path)">
      <i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
      <span slot="title">{{item.meta.title}}</span>
    </el-menu-item>
  </router-link>

  <el-submenu v-else :index="basePath">
    <template slot="title" :index="basePath">
      <i v-if="item.meta && item.meta.icon" :class="item.meta.icon" />
      <span v-if="item.meta && item.meta.title" slot="title">{{ item.meta.title }}</span>
    </template>

    <sidebar-item
      v-for="child in item.children"
      :key="child.id"
      :item="child"
      :base-path="child.path"
      @jump="jump"
    />
  </el-submenu>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Route, RouteConfig } from 'vue-router'

@Component({
  name: 'SidebarItem'
})
export default class extends Vue {
  @Prop({ required: true }) private item!: RouteConfig
  @Prop({ default: '' }) private basePath!: string
  get routes() {
    const rout: any = this.$router
    return rout.options.routes
  }

  jump(val: string) {
    this.$emit('jump', val)
  }
}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
// 单独设置侧边栏栏图标尺寸
.menu-wrapper {
  .svg-icon {
    font-size: 1.2em;
  }
}
.svg-icon {
  margin-right: 16px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
