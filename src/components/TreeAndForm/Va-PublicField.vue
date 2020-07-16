<!-- 公共字段 -->
<template>
  <div class="content">
    <el-input v-model="keyWord" style="width:100%;margin-top:10px" placeholder="请输入关键词检索..." />
    <el-table
      :data="tabelData"
      style="margin-top:10px"
      height="calc(100% - 30px)"
    >
      <el-table-column prop="publicFldName" label="公共字段名称" />
      <el-table-column prop="publicFldId" label="英文标识" />
      <el-table-column label="输入表格字段">
        <template slot-scope="scope">
          <Treeselect
            v-model="scope.row.fldId"
            :disable-branch-nodes="true"
            placeholder="请选择"
            :options="inputData"
            :show-count="true"
            z-index="99"
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
  getPublicFieldList,
  getKeytypecodePublicField,
  setKeytypecodePublicField,
  deleteRolePublicField
} from '@/api/tree-data/filedOperation'
import { getInputTree } from '@/api/tree-data/input-form'
import { ModuleState } from '@/store/modules/module'
@Component({
  name: 'PublicField'
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private publicData: any = []
  private publicDatas: any = []
  private tmpTabelData: any = []
  private inputData: any = []
  private keyWord: string = ''
  // 获取 keytypecode
  private get keytypecode() {
    return ModuleState.opId
  }
  get tabelData() {
    return this.publicDatas.filter((data:any) => !this.keyWord || data.publicFldName.toLowerCase().includes(this.keyWord.toLowerCase()) || data.publicFldId.toLowerCase().includes(this.keyWord.toLowerCase()))
  }
  created() {
    getPublicFieldList().then((res: any) => {
      this.tmpTabelData = res.data
    })
    this.getFieldTableList(this.keytypecode)
  }
  @Watch('keytypecode')
  getFieldTableList(val: number) {
    this.publicData = []
    this.inputData = []
    getKeytypecodePublicField(val).then((res: any) => {
      this.publicData = res.data
      this.tmpTabelData.forEach((el: any) => {
        this.publicData.forEach((item: any) => {
          if (el.publicFldId === item.publicFldId) {
            el.fldId = item.fldId
            el.code = item.id
          }
        })
      })
      this.publicDatas = this.tmpTabelData
    })
    getInputTree(val).then((res: any) => {
      this.inputData = res.data
      this.inputData.unshift({ label: '无', id: -1 })
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
        field: {
          fldId: val.id,
          formId: this.filterTree(val.label, this.inputData)[1].id,
          publicFldId: row.publicFldId,
          keyTypeCode: this.keytypecode
        },
        keyTypeCode: this.keytypecode
      }
      this.loading.start()
      setKeytypecodePublicField(data)
        .then((res: any) => {
          this.$message.success('修改成功')
        })
        .finally(() => {
          this.loading.close()
        })
    } else if (val.id === -1) {
      let id = row.code
      this.loading.start()
      deleteRolePublicField(id)
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
::v-deep .el-table .cell{
  overflow: visible !important;
}
</style>
