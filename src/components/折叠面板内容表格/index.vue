<!-- 折叠面板  -->
<template>
  <div class="wrapper">
    <div v-for="(item, index) in testData" :key="index" class="collapse-item">
      <div>
        <span @click="changeData(item, index)">
          <svg-icon icon-class="icf-dir-right" v-show="!Boolean(item.isActive)" />
          <svg-icon icon-class="icf-dir-bottom" v-show="Boolean(item.isActive)" />
          {{ item.label }}:
        </span>
        <el-checkbox :value="item.upload === 0" class="el-mr-4">查阅</el-checkbox>
        <el-checkbox :value="item.upload === 1">填写</el-checkbox>
      </div>
      <el-table :data="item.children" stripe>
        <el-table-column property="label" label="名称" />
        <el-table-column label="查阅" width="80">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.upload === 0" @change="changeData(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="填写" width="80">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.upload === 1" @change="changeData(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'collapseTable'
})
export default class extends Vue {
  private testData: any = []
  changeData(row: any, index: number) {
    setTimeout(() => {
      const collapseDom = document.getElementsByClassName('collapse-item')
      if (this.testData[index].isActive) {
        collapseDom[index].setAttribute('class', 'collapse-item isActive')
        this.testData[index].children = [
          {
            label: '字段一',
            id: '10-1',
            upload: 0
          },
          {
            label: '字段二',
            id: '10-2',
            upload: 1
          },
          {
            label: '字段三',
            id: '10-3',
            upload: 0
          },
          {
            label: '字段四',
            id: '10-4',
            upload: 1
          }
        ]
        this.testData[index].isActive = true
      } else {
        collapseDom[index].classList.remove('isActive')
        this.testData[index].isActive = false
        this.$forceUpdate()
      }
    }, 20)
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  width: inherit;
  height: 100%;
  overflow-y: auto;
  .collapse-item {
    height: 30px;
    overflow: hidden;
    > div:first-child {
      cursor: pointer;
    }
  }
}
.isActive {
  height: auto !important;
  border-bottom: 1px solid #e6e9f0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}
</style>
<style lang='scss' scoped>
.collapse {
  width: inherit;
  height: 100%;
  overflow-y: auto;
  .el-collapse {
    border: none;
  }
  ::v-deep .el-collapse-item__header {
    height: 32px;
    line-height: 32px;
    border-bottom: none;
    flex: 1 0 auto;
    order: -1;
  }
  ::v-deep .el-collapse-item__content {
    padding: 10px 0 16px;
  }
  ::v-deep .el-collapse-item__wrap {
    margin-bottom: 10px;
  }
  .collapse-title {
    flex: 1 0 auto;
    order: 1;
  }
  .el-collapse-item {
    border: none;
  }
}
::v-deep .el-table th.is-leaf,
::v-deep .el-table td {
  border: none;
}
.el-table {
  border: 1px solid #dfe6ec !important;
  margin-top: 16px;
}
::v-deep .el-checkbox__label {
  padding-left: 4px;
}
</style>
