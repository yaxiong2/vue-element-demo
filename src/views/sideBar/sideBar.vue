<template>
  <div class="home">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <sidebarItem
        v-for="route in routeData"
        :key="route.id"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import sidebarItem from "./itemBar.vue";
@Component({
  name: "home",
  components: {
    sidebarItem
  }
})
export default class extends Vue {
  get routeData() {
    return (this.$router as any).options.routes;
  }
  handleOpen(key: string, keyPath: string) {
    console.log(key, keyPath);
  }
  handleClose(key: string, keyPath: string) {
    console.log(key, keyPath);
  }
}
</script>
<style lang="scss" scoped>
.home {
  width: 250px;
  height: 100%;
  .el-menu {
    height: 100%;
  }
}
</style>
