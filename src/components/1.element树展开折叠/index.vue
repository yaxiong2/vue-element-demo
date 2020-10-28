

<template>
  <div>
    <el-tree
      :data="navs"
      show-checkbox
      ref="personTree"
      highlight-current
      draggable
      node-key="label"
      :default-expand-all="expandAll"
    ></el-tree>

    <el-button @click="expandOpen(1)">展开所有菜单</el-button>
    <svg-icon icon-class="icl-app" />
    <el-button @click="expandOpen(0)">收起所有菜单</el-button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class extends Vue {
  navs: any = [
    {
      label: '一级 1',
      children: [
        {
          label: '二级 1-1',
          children: [
            {
              label: '三级 1-1-1'
            }
          ]
        }
      ]
    },
    {
      label: '一级 2',
      children: [
        {
          label: '二级 2-1',
          children: [
            {
              label: '三级 2-1-1'
            }
          ]
        },
        {
          label: '二级 2-2',
          children: [
            {
              label: '三级 2-2-1'
            }
          ]
        }
      ]
    },
    {
      label: '一级 3',
      children: [
        {
          label: '二级 3-1',
          children: [
            {
              label: '三级 3-1-1'
            }
          ]
        },
        {
          label: '二级 3-2',
          children: [
            {
              label: '三级 3-2-1'
            }
          ]
        }
      ]
    }
  ] //所有菜单
  expandAll = false //默认展开所有节点

  expandOpen(val: number) {
    if (val === 1) {
      // 展开所有
      this.expandAll = true
      for (let i = 0; i < this.navs.length; i++) {
        ;(this.$refs.personTree as any).store.nodesMap[this.navs[i].label].expanded = true
        if (this.navs[i].children) {
          this.navs[i].children.map((el: any) => {
            ;(this.$refs.personTree as any).store.nodesMap[el.label].expanded = true
          })
        }
      }
    } else if (val === 0) {
      // 收合所有
      this.expandAll = false
      for (let i = 0; i < this.navs.length; i++) {
        ;(this.$refs.personTree as any).store.nodesMap[this.navs[i].label].expanded = false
      }
    }
    // for (let i = 0 ,leng=personTree.store._getAllNodes().length; i < leng; i++) {
    //     personTree.store._getAllNodes()[i].expanded = this.expandAll
    // }
  }
}
</script>
