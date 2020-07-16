<!-- 相关字段 -->
<template>
  <div class="content">
    <el-input v-model="keyWord" style="width:100%;margin-top:10px" placeholder="请输入关键词检索..." />
    <el-table
      :data="tableData"
      style="margin-top:10px"
      height="calc(100% - 30px)"
    >
      <el-table-column prop="relationFldName" label="相关字段名称" />
      <el-table-column label="输入表格字段">
        <template slot-scope="scope">
          <Treeselect
            v-model="scope.row.fldId"
            :disable-branch-nodes="true"
            placeholder="请选择"
            :options="inputData"
            :show-count="true"
            z-index="99"
            :match-keys="['label','id']"
            @select="handleChange($event,scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator'
import {
  getRelevantFieldList,
  setKeytypecodeRelationField,
  getKeytypecodeRelationField,
  deleteRoleRelationField
} from '@/api/tree-data/filedOperation'
import { getInputTree } from '@/api/tree-data/input-form'
import { ModuleState } from '@/store/modules/module'
@Component({
  name: 'RelevantField'
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private relevantData: any = []
  private relevantDatas: any = []
  private inputData: any = []
  private keyWord: string = ''
  private tmpTableData = []
  private get keytypecode() {
    return ModuleState.opId
  }
  get tableData() {
    return this.relevantDatas.filter((data:any) => !this.keyWord || data.relationFldId.toLowerCase().includes(this.keyWord.toLowerCase()) || data.relationFldName.toLowerCase().includes(this.keyWord.toLowerCase()))
  }
  created() {
    getRelevantFieldList().then((res: any) => {
      this.tmpTableData = res.data
    })
    this.getFieldTableList(this.keytypecode)
  }
  @Watch('keytypecode')
  getFieldTableList(val: number) {
    this.relevantData = []
    this.inputData = []
    getInputTree(val)
      .then((res: any) => {
        this.inputData = res.data.filter((item:any, index:number, arr:any) => { return arr.indexOf(item) === index })
        console.log(this.inputData)
        this.inputData.unshift({ label: '无', id: -1 })
      })
      .then(() => {
        getKeytypecodeRelationField(val).then((res: any) => {
          this.relevantData = res.data
          this.tmpTableData.forEach((el: any) => {
            this.relevantData.forEach((item: any) => {
              if (el.relationFldId === item.relateFieldId) {
                el.code = item.id
                el.fldId = this.filterTree(item.inFldName, this.inputData)[0].id
              }
            })
          })
          this.relevantDatas = this.tmpTableData
        })
      })
  }
  // 遍历树形数据 返回本身以及父节点不包含子节点的数据
  filterTree(val: any, data: any, arr: any = [], obj:any = {}) {
    data.map((item: any) => {
      if (item.children) {
        obj = { id: item.id, label: item.label }
        this.filterTree(val, item.children, arr, obj)
      }
      if (item.label === val) {
        arr.push(item, obj)
      }
    })
    return arr
  }
  handleChange(val: any, row: any) {
    if (val.id !== -1) {
      let data = {
        formTbName: this.filterTree(val.label, this.inputData)[1].label,
        id: row.code,
        inFldName: val.label,
        keyTypeCode: this.keytypecode,
        relateFieldId: row.relationFldId
      }
      this.loading.start()
      setKeytypecodeRelationField(data)
        .then((res: any) => {
          this.$message.success('修改成功')
        })
        .finally(() => {
          this.loading.close()
        })
    } else if (val.id === -1) {
      let data: [number] = [row.code]
      this.loading.start()
      deleteRoleRelationField(data)
        .then((res: any) => {
          this.$message.success('修改成功')
        })
        .finally(() => {
          this.loading.close()
        })
    }
  }
}
</script>
<style lang='scss' scoped>
.content {
  height: 100%;
}
.el-table::before {
  z-index: inherit;
  height: 0;
}
::v-deep .el-table .cell {
  overflow: visible !important;
}
</style>
