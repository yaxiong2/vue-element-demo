<!-- 主页 -->
<template>
  <div class="wrapp">
    <div>
      <el-menu
        :default-active="this.$route.path"
        router
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :default-openeds="['']"
      >
        <div v-for="(item,i) in navList" :key="i">
          <el-submenu v-if="item.children&&item.children.length>0" :index="item.path">
            <template slot="title">
              <i :class="item.meta.icon"></i>
              <span>{{item.meta.title}}</span>
            </template>
            <el-menu-item v-for="(el,index) in item.children" :key="index" :index="el.path">
              <i :class="el.meta.icon"></i>
              <span>{{el.meta.title}}</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item v-else>
            <template slot="title">
              <i :class="item.meta.icon"></i>
              <span>{{ item.meta.title }}</span>
            </template>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <div>
      <router-view class="menu-right" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class extends Vue {
  get navList() {
    return (this as any).$router.options.routes
  }
}
</script>
<style lang="scss" scoped>
.wrapp {
  width: 100%;
  height: 100%;
  display: flex;
  > div:first-child {
    width: 240px;
    min-width: 240px;
    height: 100%;
    .el-menu {
      box-sizing: border-box;
      height: 100%;
    }
    .el-menu--horizontal {
      border-bottom: 0px;
      > .el-menu-item {
        height: 48px;
        line-height: 48px;
        width: 100%;
      }
      > .el-menu-item.is-active {
        border-bottom: 0px;
      }
    }
  }
  > div:last-child {
    background: #eff3f6;
    padding: 16px;
    width: 100%;
    .menu-right {
      width: 100%;
      height: 100%;
      background: #fff;
    }
  }
}
</style>