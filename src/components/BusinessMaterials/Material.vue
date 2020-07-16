<template>
  <div>
    <MaterialHeader :is-disabled="!!currentRow" class="material-header" :title="title" @handleInsert="handleInsert" @handleDel="handleDel" @handleTop="handleTop" @handleUp="handleUp" @handleDown="handleDown" @handleBottom="handleBottom" />
    <MaterialTable :table-data="originData" @handleRowClick="handleRowClick" />
    <el-dialog append-to-body title="添加材料" class="inner-material-dialog" :visible.sync="visiable" width="400px" :before-close="beforeClose">
      <el-form ref="materialRef" :model="materialForm">
        <el-form-item label="材料类型" :label-width="formLabelWidth" prop="materialTypeId" :rules="[{ required: true, message: '请填写材料名称', trigger: 'blur' }]">
          <el-select v-model="materialForm.materialTypeId" style="width:100%;" placeholder="请选择材料名称">
            <el-option
              v-for="item in originOptions"
              :key="item.materialTypeId"
              :label="item.materialTypeName"
              :value="item.materialTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="材料名称" :label-width="formLabelWidth">
          <el-input v-model="materialForm.materialTitle" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref, Emit } from 'vue-property-decorator'
import MaterialHeader from './MaterialHeader.vue'
import MaterialTable from './MaterialTable.vue'
import { bpmQuery, bpmUpdate, bpmInsert, bpmDel, query, IbpmMaterial, IMaterial } from '@/api/material'
import { ModuleState } from '@/store/modules/module'
import { Form } from 'element-ui'
import { titleEnum } from './types'

@Component({
  name: 'Material',
  components: {
    MaterialHeader,
    MaterialTable
  }
})
export default class Material extends Vue {
  @Prop({ required: true }) readonly title!: titleEnum
  @Prop({ required: true }) private readonly tableData!:IbpmMaterial[]
  @Prop({ required: true }) private readonly options!: IbpmMaterial[]
  @Ref('materialRef') readonly materialRef!:Form
  private currentRow:string | IbpmMaterial = ''
  private formLabelWidth = '80px'
  private visiable = false
  private materialForm = {
    materialTypeId: '',
    materialTitle: '',
    materialGroupId: 0
  }
  // $refs!:{materialRef:Form}
  get keyCodeType() {
    return ModuleState.opId
  }
  get procDefId() {
    return ModuleState.procDefId
  }
  get originData() {
    return this.tableData
  }
  get originOptions() {
    return this.options
  }
  handleInsert(val:any) {
    this.visiable = true
    this.materialForm = {
      materialTypeId: '',
      materialTitle: '',
      materialGroupId: 0
    }
  }
  @Emit('updateQuery')
  insert() {
    const { materialTypeId, materialTitle } = this.materialForm
    return bpmInsert({ procDefId: this.procDefId, materialTitle, materialTypeId: String(materialTypeId), asArchive: titleEnum.achievements === this.title }).then(_ => {
      this.visiable = false
    })
  }
  @Emit('updateQuery')
  del() {
    return bpmDel(this.currentRow as IbpmMaterial).then(res => {
      this.currentRow = ''
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    })
  }
  beforeUpdateData(a:IbpmMaterial, b:IbpmMaterial) {
    this.update(this.exchange(a, b))
  }
  @Emit('updateQuery')
  update(data:IbpmMaterial[]) {
    return bpmUpdate(data).then(res => {
      this.currentRow = ''
    })
  }
  handleDel() {
    this.$confirm('此操作将删除材料类型, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.del()
    }).catch(() => { })
  }
  handleTop() {
    if (this.tableData.length <= 1) return false
    if (this.tableData[0].id === (this.currentRow as IbpmMaterial).id) return false
    this.beforeUpdateData(this.currentRow as IbpmMaterial, this.tableData[0])
  }
  exchange(a:IbpmMaterial, b:IbpmMaterial) {
    const sortIndex = a.sortIndex
    a.sortIndex = b.sortIndex
    b.sortIndex = sortIndex
    return [a, b]
  }
  handleUp() {
    if (this.tableData.length <= 1) return false
    const curIndex = this.tableData.findIndex(item => item.id === (this.currentRow as IbpmMaterial).id)
    if (!this.tableData[curIndex - 1]) return false
    this.beforeUpdateData(this.currentRow as IbpmMaterial, this.tableData[curIndex - 1])
  }
  handleDown() {
    if (this.tableData.length <= 1) return false
    const curIndex = this.tableData.findIndex(item => item.id === (this.currentRow as IbpmMaterial).id)
    if (!this.tableData[curIndex + 1]) return false
    this.beforeUpdateData(this.currentRow as IbpmMaterial, this.tableData[curIndex + 1])
  }
  handleBottom() {
    if (this.tableData.length <= 1) return false
    const [last] = this.tableData.slice(-1)
    if (last.id === (this.currentRow as IbpmMaterial).id) return false
    this.beforeUpdateData(this.currentRow as IbpmMaterial, last)
  }
  handleRowClick(row:any) {
    this.currentRow = row
  }
  dialogSubmit() {
    this.materialRef.validate(valid => {
      if (!valid) return
      this.insert()
    })
  }
  dialogClose() {
    this.materialRef.resetFields()
    this.visiable = false
  }
  beforeClose(done:()=>{}) {
    this.materialRef.resetFields()
    done()
  }
}
</script>

<style lang="scss" scoped>
.material-header {
  margin-bottom: 10px;
}
</style>
