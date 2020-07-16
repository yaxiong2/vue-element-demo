<template>
  <div style="width:100%;">
    <el-table
      :data="tableData"
      style="width: 100%"
      :highlight-current-row="true"
      @row-click="handleRowClick"
    >
      <el-table-column
        type="index"
      />
      <el-table-column
        prop="materialTypeName"
        label="材料名称"
      />
      <el-table-column
        prop="materialTypeId"
        label="材料类型"
      />
    </el-table>
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
@Component({
  name: 'MaterialTable'
})
export default class MaterialTable extends Vue {
  @Prop({ required: true }) readonly tableData!: []
  @Emit('handleRowClick')
  handleRowClick(row:any) {
    return row
  }
}
</script>

<style lang='scss' scoped>
.rotate ::v-deep .el-icon-download {
  transform: rotate(180deg);
}
.title {
  cursor: default;
  color: #000;
  margin-right: 10px!important;
  vertical-align: middle;
}
</style>
