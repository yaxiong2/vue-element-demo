<template>
  <section v-loading="loadingVisible" class="app-main" element-loading-spinner="loader">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view :key="key" class="contentShow" />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { TagsViewModule } from '@/store/modules/tags-view'

@Component({
  name: 'AppMain'
})
export default class extends Vue {
  private loadingVisible = false
  get cachedViews() {
    return TagsViewModule.cachedViews
  }
  get key() {
    return this.$route.path
  }
  @Provide() loading = {
    start: this.start,
    close: this.close
  }
  start() {
    if (this.loadingVisible) return
    this.loadingVisible = true
  }
  close() {
    this.loadingVisible = false
  }
}
</script>
<style lang="scss">
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 65px;
  height: 65px;
  margin-top: -50px;
  margin-left: -50px;
  animation: spin 1.2s linear infinite;
  // border: 3px solid transparent;
  // border-top-color: #3498db;
  border-radius: 50%;
  background: url('../../assets/image/loading.png');
  background-size: 100%;
//   &::before {
//    content: '';
//     position: absolute;
//     top: 5px;
//     right: 5px;
//     bottom: 5px;
//     left: 5px;
//     animation: spin 3s linear infinite;
//     border: 3px solid transparent;
//     border-top-color: #e74c3c;
//     border-radius: 50%;
//   }
//   &::after {
//     content: '';
//     position: absolute;
//     top: 15px;
//     right: 15px;
//     bottom: 15px;
//     left: 15px;
//     animation: spin 1.5s linear infinite;
//     border: 3px solid transparent;
//     border-top-color: #f9c922;
//     border-radius: 50%;
//   }
}
@keyframes spin{
    0%{transform: rotate(0deg);}
    50%{transform: rotate(180deg);}
    100%{transform: rotate(360deg);}
}
.el-loading-mask {
  z-index: 9999;
}
.sk-rotating-plane {
  display: block;
  width: 4em;
  height: 4em;
  position: relative;
  margin: auto;
}
.el-loading-mask {
  opacity:.7;
  background-color: rgba(255,255,255,0.95)!important;
}
@keyframes sk-rotating-plane{
  0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
  }
  50% {
      transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
  }
  100% {
      transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}

</style>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 34px);
  width: 100%;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 34px);
  // padding: 14px;
  background-color: rgba(239, 243, 246, 1);
}

.fixed-header+.app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: hidden !important;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 34px);
    height: calc(100vh - 34px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
  .contentShow {
    background-color: #fff;
    height: 100%;
  }
}
</style>
