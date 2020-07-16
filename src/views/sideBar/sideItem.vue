<!-- 侧边栏子组件 -->
<template>
  <el-menu-item :index="basePath" v-if="!item.children" @click="jump(item.path)">
    <i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
    <span slot="title">{{item.meta.title}}</span>
  </el-menu-item>
  <el-submenu v-else>
    <template slot="title" v-if="item.children.length>0">
      <i v-if="item.meta && item.meta.icon" :class="item.meta.icon" />
      <span v-if="item.meta && item.meta.title" slot="title">{{ item.meta.title }}</span>
    </template>

    <template slot="title" v-else @click="jump(item.path)" :index="basePath">
      <i v-if="item.meta && item.meta.icon" :class="item.meta.icon" />
      <span v-if="item.meta && item.meta.title" slot="title">{{ item.meta.title }}</span>
    </template>

    <sidebar-item v-for="child in item.children" :key="child.id" :item="child" :base-path="child.path"/>
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

  jump(val:string){
    const arr=this.findParentPath(this.routes,val)
    console.log(arr)
  }
  //传入参数：需要遍历的json，需要匹配的id
  findParentPath(data:any,path:any):any{
    //设置结果
    let result;
    if (!data) {
      return;//如果data传空，直接返回
    }
    for (let i = 0; i < data.children.length; i++) {
      const item = data.children[i];
      if (item.path === path) {
        result=data.path;
        console.log(result)
      //找到id相等的则返回父id
        return result;
      } else if (item.children && item.children.length > 0) {
      //如果有子集，则把子集作为参数重新执行本方法
        result= this.findParentPath(item, path);
      //关键，千万不要直接return本方法，不然即使没有返回值也会将返回return，导致最外层循环中断，直接返回undefined,要有返回值才return才对
        if(result){
          return result;
        }
      }
    }
    //如果执行循环中都没有return，则在此return
    return result;
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
