<!-- 台账表格分页条 -->
<template>
  <div class="contentBox">
    <div class="va-table">
      <el-table :data="pageTableData" stripe border @row-click="getRowData" height="calc(100%)">
        <el-table-column v-for="(value, key, index) of tableHead" :key="index" :prop="key" :label="value">
        </el-table-column>
      </el-table>
    </div>
    <div class="va-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageCurrent"
        :page-sizes="[10, 15, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        style="float:right"
        :total="tableData.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'conditionTable'
})
export default class extends Vue {
  @Prop({ default: [] }) tableData: any
  @Prop({ default: [] }) tableHead: any
  private pageSize = 10
  private pageCurrent = 1
  getRowData(row: any) {
    this.$emit('getRowData', row)
  }
  get pageTableData() {
    return this.tableData.slice(this.pageSize * (this.pageCurrent - 1), this.pageSize*this.pageCurrent)
  }
  //每页条数
  handleSizeChange(val: number) {
    this.pageSize = val
  }
  //当前页
  handleCurrentChange(val: number) {
    this.pageCurrent = val
  }
}
</script>
<style lang="scss" scoped>
.contentBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .va-table {
    flex-grow: 1;
    height: calc(100% - 32px);
    overflow: hidden;
    position: relative;
  }
  .va-pagination {
    flex-shrink: 0;
    padding: 10px 0;
    padding-right: 50px;
  }
}
</style>
