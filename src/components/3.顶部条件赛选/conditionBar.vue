<!-- 台账条件栏 -->
<template>
  <div class="condition">
    <div v-for="(item, index) in data" :key="index" class="tab-item">
      <p class="el-mr-2">{{ item.label }}:</p>
      <span @click="getCondition(item, 'all')" :class="{ active: item.active }">全部</span>
      <span
        @click="getCondition(item, el)"
        v-for="(el, ind) in item.children"
        :class="{ active: el.active }"
        :key="ind"
        >{{ el.label }}</span
      >
    </div>
    <div>
      <el-input
        v-model="filterText"
        @input="getKeyWord"
        clearable
        prefix-icon="el-icon-search"
        placeholder="输入关键词查询"
      ></el-input>
      <el-button @click="refresh">刷新</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'conditionBar'
})
export default class extends Vue {
  @Prop({ default: [] }) data: any
  private filterText = ''
  // 点击tabs
  getCondition(item: any, el?: any) {
    if (el === 'all') {
      item.active = true
      item.children.map((it: any) => {
        it.active = false
      })
    } else {
      if (el.active) {
        el.active = false
      } else {
        el.active = true
        item.active = false
      }
    }
    const arr = item.children.filter((a: any) => {
      return a.active === true
    })
    if (arr.length < 1) {
      item.active = true
    }
    const conditionArr = this.conditionFilter(this.data)
    this.$emit('getCondition', conditionArr)
  }
  // 遍历树 获取选中的tabs
  conditionFilter(arr: any) {
    let arr1: any = []
    arr.map((item: any) => {
      if (item.active) {
        arr1.push(item)
      }
      arr1 = [
        ...arr1,
        ...item.children.filter((el: any) => {
          return el.active
        })
      ]
    })
    return arr1
  }
  // 获取关键词
  getKeyWord() {
    this.$emit('getKeyWord', this.filterText)
  }
  // 刷新
  refresh() {
    this.$emit('refresh')
  }
}
</script>
<style lang="scss" scoped>
.condition {
  padding: 10px 10px 10px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
  .tab-item {
    height: 37px;
    border-bottom: 1px dashed #e8e8e8;
    line-height: 37px;
    p {
      display: inline;
    }
    span {
      padding: 4px 15px;
      cursor: pointer;
    }
    .active {
      color: #fff;
      background-color: #2c73e8;
      border-radius: 4px;
    }
  }
  > div:last-child {
    display: flex;
    justify-content: space-between;
    margin-top: 7px;
    .el-input {
      width: 200px;
      height: 36px;
      ::v-deep .el-input__inner {
        border-radius: 0;
      }
    }
  }
}
</style>
