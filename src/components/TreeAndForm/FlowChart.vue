<template>
  <div class="flow-chart">
    <div class="header-right">
      <el-button icon="el-icon-plus" type="primary" @click="handleInsert">新增</el-button>
    </div>
    <div style="height:10px;" />
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="version"
        label="版本"
      />
      <el-table-column
        prop="versionName"
        label="描述"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="500"
      >
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" class="btn-no-padding" :disabled="!scope.row.procDefId" @click="handleInputTable(scope.row)">输入表</el-button>
          <el-button type="text" icon="el-icon-edit" class="btn-no-padding" :disabled="!scope.row.procDefId" @click="handleOutputTable(scope.row)">输出表</el-button>
          <el-button type="text" icon="el-icon-edit" class="btn-no-padding" :disabled="!scope.row.procDefId" @click="handleMaterial(scope.row)">业务材料</el-button>
          <el-button type="text" icon="el-icon-edit" class="btn-no-padding" :disabled="!scope.row.procDefId" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="btn-no-padding" icon="el-icon-refresh" :disabled="!scope.row.procDefId" @click="handleUpadte(scope.row)">更新</el-button>
          <el-button type="text" size="small" class="btn-no-padding" icon="el-icon-video-play" @click="handlePublish(scope.row)">发布</el-button>
          <el-button type="text" size="small" class="btn-no-padding" icon="el-icon-video-play" @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增弹窗 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" :before-close="handleDialogBeforeClose">
      <el-form ref="processForm" :model="processForm">
        <el-form-item label="版本名称" prop="bpmName" :rules="[{required:true,message:'请输入流程名称'}]" label-width="80px" class="el-mb-0">
          <el-input v-model="processForm.bpmName" autocomplete="off" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDilogClose">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="EditFormVisible" :before-close="handleEditDialogBeforeClose" />
    <el-dialog title="流程图" :fullscreen="true" class="process-dialog" top="0" :visible.sync="dialogProcessVisible" :before-close="handleIframeBeforeClose">
      <iframe class="iframe" :src="iframeSrc" width="100%" height="100%" />
    </el-dialog>
    <el-dialog :modal-append-to-body="false" title="业务材料" class="material-dialog" :visible.sync="dialogMaterialVisible">
      <BusinessMaterials />
    </el-dialog>
    <!-- 输入表版本控制弹窗 -->
    <el-dialog title="输入表版本控制" :visible.sync="inputFormVisible" class="formversion-dialog">
      <el-table
        ref="inputMultipleTable"
        :data="inputFormVersionData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="45"
        />
        <el-table-column prop="formName" label="表格名称" />
        <el-table-column prop="tableVersion" label="版本" width="140">
          <template slot-scope="scope">
            <el-select v-model="scope.row.tableVersion" placeholder="请选择版本">
              <el-option v-for="(item, index) in allInputVersion[scope.row.formId]" :key="index" :label="'版本'+item.tableVersion" :value="item.tableVersion" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="formType" label="表格类型" width="170">
          <template slot-scope="scope">
            <el-select v-model="scope.row.formType" placeholder="请选择表格类型">
              <el-option label="普通表格" value="1" />
              <el-option label="一表多用" value="2" />
              <el-option label="一卷多证" value="5" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="formCaption" label="表格别名" width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.formCaption" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inputFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handSaveVersion">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 输出表版本配置窗口 -->
    <el-dialog title="输出表版本控制" :visible.sync="outputFormVersion" class="formversion-dialog">
      <el-table
        ref="outputMultipleTable"
        :data="outputFormVersionData"
        style="width: 100%"
        :row-class-name="rowClassName"
        @selection-change="handleOutPutChange"
      >
        <el-table-column
          type="selection"
          width="45"
        />
        <el-table-column prop="description" label="表格名称" />
        <el-table-column prop="reportDefineID" label="报表模板" width="140">
          <template slot-scope="scope">
            <el-select v-model="scope.row.reportDefineID" placeholder="请选择报表模板">
              <el-option v-for="(item, index) in alloutputTemplate[scope.row.reportId]" :key="index" :label="item.description" :value="item.reportDefineId" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="reportType" label="表格类型" width="170">
          <template slot-scope="scope">
            <el-select v-model="scope.row.reportType" placeholder="请选择报表版本" disabled>
              <el-option label="普通表格" value="1" />
              <el-option label="一表多用" value="2" />
              <el-option label="一卷多证" value="5" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="formId" label="对应输入表" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.formId" placeholder="请选择对应的输入表" @change="changeFormType(scope.row)">
              <el-option v-for="(item, index) in selectedVersion" :key="index" :label="item.formCaption" :value="item.formId" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outputFormVersion = false">取 消</el-button>
        <el-button type="primary" @click="handSaveOutPutVersion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch, Inject } from 'vue-property-decorator'
import { queryProcess, queryProcessList, updateProcess, insertProcess, publishEdition, updateEdition, insertEdition, IInsertEdition, IUpdateProcess, IUpdateEdition, queryEditionDetail, refreshEdition, getInputForms, getInputVersion, getSelectedVersion, saveInputFormVersion, getOutputSelectedVersion, saveOutputFormVersion } from '@/api/flowChart'
import { getOutputForm, getReportTemplate } from '@/api/output-form/outputForm'
import { ModuleState } from '@/store/modules/module'
import BusinessMaterials from '@/components/TreeAndForm/BusinessMaterials.vue'
import { Form, Table, Message } from 'element-ui'

interface IEditionForm {
  flowPhTimeYellow: string,
  opReturnTime: string,
  opTotalTime: string,
  opTotalTimeYellow: string,
  description: string,
  version: string,
  [propName:string]:any
}
interface IInputFormVersion {
  formCaption: string
  formId: number
  formType: string | number
  id: string
  keyTypeCode: number
  procDefId: string
  sortIndex: number
  tableVersion: string | number
  formName?:string
}
interface IOutputFormVersion {
  description: string
  formId: number
  keyTypeCode: string
  procDefId: string
  reportDefineID: string
  reportId: string
  reportType:string
  index?:number
}
interface IAllInputVersion {
  [key:string]:any[]
}

@Component({
  name: 'FlowChart',
  components: {
    BusinessMaterials
  }
})
export default class FlowChart extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private tableData = []
  private processForm = { bpmName: '' }
  private editionForm:IEditionForm = {
    flowPhTimeYellow: '',
    opReturnTime: '',
    opTotalTime: '',
    opTotalTimeYellow: '',
    description: '',
    version: ''
  }
  private dialogFormVisible = false
  private EditFormVisible = false
  private dialogProcessVisible = false
  private dialogMaterialVisible = false
  private bpmId = ''
  private id = ''
  private iframeSrc = ''
  private procDefId = ''
  private inputFormVisible:boolean = false
  private inputFormVersionData:IInputFormVersion[] = []
  private multipleSelectionVersion:IInputFormVersion[] = []
  private allInputVersion:IAllInputVersion = {}
  private outputFormVersion:boolean = false
  private outputFormVersionData:any[] = []
  private outputSelectionVersion:any[] = []
  private alloutputTemplate:any = {}
  private selectedVersion:any[] = [] // 已经配置的输入表版本
  @Ref('processForm') processFormRef!:Form
  @Ref('editionForm') editionFormRef!:Form
  @Ref('inputMultipleTable') readonly inputMultipleTable!:Table
  @Ref('outputMultipleTable') readonly outputMultipleTable!:Table
  private checkNumber = (rule:any, value:any, callback:(arg?:Error)=>{}) => {
    if (!value) {
      callback(new Error('不能为空'))
    } else if (!Number.isInteger(value)) {
      callback(new Error('请输入数字值'))
    } else {
      callback()
    }
  }
  get keyTypeCode() {
    return ModuleState.keyTypeCode
  }
  @Watch('keyTypeCode')
  keyTypeCodeChange(val:any, oldVal:any) {
    if (val !== oldVal) {
      this.query()
    }
  }
  mounted() {
    this.query()
  }
  query() {
    this.loading.start()
    const { keyTypeCode } = this
    queryProcessList({ keyTypeCode }).then(res => {
      this.tableData = res.data
      if (res.data && res.data.length) this.bpmId = res.data[0].bpmId
      this.loading.close()
    }).catch(() => {
      this.loading.close()
    })
  }
  editionInsert() {
    const { bpmName: description } = this.processForm
    const { bpmId, keyTypeCode } = this
    const insertData = { bpmId, description, keyTypeCode }
    insertEdition(insertData).then(res => {
      this.handleDilogClose()
      this.query()
    })
  }
  handleInsert() {
    this.dialogFormVisible = true
  }
  handleDialogBeforeClose(done:()=>{}) {
    this.processFormRef.resetFields()
    done()
  }
  handleEditDialogBeforeClose(done:()=>{}) {
    this.editionFormReset()
    this.$nextTick(() => {
      done()
    })
  }
  handleIframeBeforeClose(done:()=>{}) {
    this.iframeSrc = ''
    done()
  }
  handleDilogClose() {
    this.processFormRef.resetFields()
    this.dialogFormVisible = false
  }
  handleDialogSubmit() {
    this.processFormRef.validate((valid) => {
      if (valid) {
        this.editionInsert()
      } else {
        return false
      }
    })
  }
  handleEdit(row:any) {
    const { id } = row
    queryEditionDetail({ id }).then(res => {
      for (let i in this.editionForm) {
        this.editionForm[i] = res.data[i] || ''
      }
      this.id = id
      this.EditFormVisible = true
    })
  }
  handleUpadte(row:any) {
    this.$confirm('此操作将更新流程, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const { modelId } = row
      refreshEdition({ modelId }).then(res => {
        this.$message.success('更新成功')
      })
    }).catch(e => {})
  }
  handlePublish(row:any) {
    this.$confirm('此操作将发布流程, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const { id } = row
      publishEdition({ id }).then(res => {
        this.$message.success('发布成功')
      })
    }).catch(e => {})
  }
  editionFormReset() {
    this.EditFormVisible = false
    for (let i in this.editionForm) {
      this.editionForm[i] = ''
    }
    this.id = ''
    this.editionFormRef.resetFields()
  }
  handleEditionSubmit() {
    this.editionFormRef.validate((valid) => {
      if (valid) {
        const obj = { ...this.editionForm, id: this.id }
        updateEdition(obj).then(res => {
          this.$message.success('更新成功')
          this.editionFormReset()
        })
      } else {
        return false
      }
    })
  }
  handleView(row:any) {
    const { modelId } = row
    this.iframeSrc = `http://10.14.2.169:19130/#/editor/${modelId}`
    this.dialogProcessVisible = true
  }
  // 输入表版本控制
  async handleInputTable(flowInfo:any) {
    this.procDefId = flowInfo.procDefId
    this.inputFormVersionData = []
    this.loading.start()
    try {
      let res = await getInputForms({ keyTypeCode: this.keyTypeCode })
      let foo = res.data.map((item:any) => {
         let singleFormData:IInputFormVersion = {
            formName: item.description,
            formType: '1',
            formCaption: item.description,
            tableVersion: '',
            id: '',
            formId: item.formId,
            keyTypeCode: this.keyTypeCode,
            procDefId: flowInfo.procDefId,
            sortIndex: 0
          }
          this.inputFormVersionData.push(singleFormData)
        return getInputVersion({ formId: item.formId })
      })
      let xxx = await Promise.all(foo)
      xxx.forEach((item:any, index) => {
        if (Object.values(item.data).length !== 0) {
          let formInd = (Object.values(item.data)[0] as any).formId
          if (formInd) this.allInputVersion[formInd] = Object.values(item.data)
        }
      })
      let selectedVersion = await getSelectedVersion({ procDefId: flowInfo.procDefId })
      let selectedTable:IInputFormVersion[] = []
      this.inputFormVersionData = this.inputFormVersionData.map((item:IInputFormVersion) => {
        selectedVersion.data.forEach((selectedItem:IInputFormVersion) => {
          if (selectedItem.formId === item.formId) {
            selectedItem.formType = String(selectedItem.formType)
            selectedItem.tableVersion = String(selectedItem.tableVersion)
            let { formName } = { ...item }
            item = { formName, ...selectedItem }
            selectedTable.push(item)
          }
        })
        return item
      })
      this.$nextTick(() => {
        selectedTable.forEach((item:IInputFormVersion) => {
          let index = this.inputFormVersionData.indexOf(item)
          this.inputMultipleTable.toggleRowSelection(this.inputFormVersionData[index], true)
        })
      })
      this.inputFormVisible = true
    } catch {}
    this.loading.close()
  }
  // 保存流程输入表版本
  handSaveVersion() {
    if (this.multipleSelectionVersion.length === 0) {
      this.$confirm('你尚未给该流程配置任何版本输入表, 确定要保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.saveInputForm([])
        }).catch(() => {})
    } else {
      let versionData:any[] = []
      this.multipleSelectionVersion.forEach((item:IInputFormVersion) => {
        let { formName, ...newData } = { ...item }
        if (item.tableVersion !== '' && item.tableVersion !== null) {
          versionData.push(newData)
        } else {
          versionData = []
        }
      })
      if (versionData.length) {
        this.saveInputForm(versionData)
      } else {
        this.$message.error('所选输入表的版本不能为空！')
      }
    }
  }
  // 发送保存输入表请求
  async saveInputForm(versionData:any) {
    this.inputFormVisible = false
    this.loading.start()
    try {
      let res = await saveInputFormVersion(versionData, { procDefId: this.procDefId })
      if (res.status === 200) {
        this.$message.success('保存成功')
      }
    } catch {}
    this.loading.close()
  }
  handleSelectionChange(val:IInputFormVersion[]) {
    this.multipleSelectionVersion = val
  }
  handleOutPutChange(val:any) {
    this.outputSelectionVersion = val
  }
  async handleOutputTable(flowInfo:any) {
    this.procDefId = flowInfo.procDefId
    this.outputFormVersionData = []
    this.loading.start()
    try {
      // 获取已绑定的输入表版本,注意是输入表
      let selectedVersion = await getSelectedVersion({ procDefId: flowInfo.procDefId })
      this.selectedVersion = [...selectedVersion.data]
      // 获取输出表已绑定的版本
      let selectedRes = await getOutputSelectedVersion({ keyTypeCode: this.keyTypeCode, procDefId: this.procDefId })
      // 获取所有的输出表
      let res = await getOutputForm({ keyTypeCode: this.keyTypeCode })
      // 遍历输出表，获取每个输出表的模板
      let tempData:any[] = []
      await Promise.all(res.data.map(async(item:any) => {
        let reportId = item.reportId
        let singleVersionData = {
          description: item.reportName,
          formId: '',
          keyTypeCode: this.keyTypeCode,
          procDefId: this.procDefId,
          reportDefineID: '',
          reportId: reportId,
          reportType: ''
        }
        selectedRes.data.forEach((selectedItem:any) => {
          if (item.reportId === selectedItem.reportId) {
            singleVersionData.formId = selectedItem.formId
            singleVersionData.reportDefineID = String(selectedItem.reportDefineID)
            singleVersionData.reportType = String(selectedItem.reportType)
          }
        })
        tempData.push(singleVersionData)
        let tempRes = await getReportTemplate({ reportId: reportId, reportDefineId: 0 })
        this.alloutputTemplate[reportId] = [...tempRes.data]
      })).then(() => { this.loading.close() })
      this.outputFormVersionData = [...tempData]
      // 默认选中勾选上
      this.$nextTick(() => {
        selectedRes.data.forEach((item:IOutputFormVersion) => {
          let selectedData = this.outputFormVersionData.forEach((outputItem:IOutputFormVersion) => {
            if (outputItem.reportId === item.reportId) this.outputMultipleTable.toggleRowSelection(outputItem, true)
            return outputItem.reportId === item.reportId
          })
        })
      })
      this.outputFormVersion = true
    } catch {}
  }
  // 给输出表版本控制的table行中加上index
  rowClassName({ row, rowIndex }:any) {
    row.index = rowIndex
  }
  // 通过切换输入表来切换输出表的类型
  changeFormType(row:any) {
    let formId = row.formId
    let index = row.index
    this.selectedVersion.forEach((item:any) => {
      if (item.formId === formId) {
        this.outputFormVersionData[index].reportType = String(item.formType)
      }
    })
  }
  handleMaterial(row:any) {
    ModuleState.SET_PROC_DEF_Id(row.procDefId)
    this.dialogMaterialVisible = true
  }
  // 点击输出表弹窗确定按钮
  handSaveOutPutVersion() {
    if (this.outputSelectionVersion.length === 0) {
      this.$confirm('你尚未给该流程配置任何输出表版本, 确定要保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.saveOutPut([])
        }).catch(() => {})
    } else {
      let versionData:IOutputFormVersion[] = []
      this.outputSelectionVersion.forEach((item:IOutputFormVersion) => {
        let { index, ...newData } = { ...item }
        if (item.reportDefineID && item.formId) {
          versionData.push(newData)
        } else {
          versionData = []
        }
      })
      if (versionData.length) {
        this.saveOutPut(versionData)
      } else {
        this.$message.error('必须配置报表模板和对应的输入表!')
      }
    }
  }
  // 保存输出表版本请求
  async saveOutPut(data:IOutputFormVersion[]) {
    this.outputFormVersion = false
    this.loading.start()
    try {
      let res = await saveOutputFormVersion(data, { keyTypeCode: this.keyTypeCode, procDefId: this.procDefId })
      this.$message.success('保存成功')
      this.loading.close()
    } catch { this.loading.close() }
  }
}
</script>

<style lang="scss">
.flow-chart .process-dialog .el-dialog {
  width: 100%!important;
  height: 100%!important;
}
.flow-chart .process-dialog   .el-dialog__body {
  width: 100%!important;
  height: calc(100% - 54px)!important;
}
</style>
<style scoped lang="scss">
.flow-chart {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding:10px;
}
.iframe {
  border:none;
}
.left {
  width: 400px;
  height: 100%;
  border-right: 1px solid #ccc;
}
.right {
  width: 100%;
  height: 100%;
  padding-left: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 150px;
}

.material-dialog > ::v-deep .el-dialog {
  width: 1000px!important;
  height: 700px!important;
}
.formversion-dialog> ::v-deep .el-dialog {
  width: 745px!important;
  max-height: 70%!important;
  overflow-y: auto;
}
</style>
