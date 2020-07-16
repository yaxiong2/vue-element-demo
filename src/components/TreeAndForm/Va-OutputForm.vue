<template>
  <div class="outputform-wrapper">
    <div class="outputform-button">
      <el-form :inline="true" label-width="78px" style="margin-top:10px" @submit.native.prevent>
        <el-form-item label="业务编号:">
          <el-input
            v-model="keyTypeCode"
            placeholder="请选择业务组"
            style="width: 120px"
            disabled
          />
        </el-form-item>
        <el-form-item label="业务名称:">
          <el-input
            v-model="businessName"
            placeholder="请选择业务组"
            style="width: 240px"
            disabled
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addInputForm">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="outputform-table">
      <el-table
        ref="formList"
        :data="formLists"
        row-key="keyOrder"
        height="100%"
        highlight-current-row
        :row-class-name="tableRowClassName"
        style="position:absolute"
        @row-click="selected"
      >
        <el-table-column prop="reportName" label="输出表名称" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-plus"
              @click="templateManager(scope.row)"
            >模板管理</el-button>
            <el-button
              type="text"
              icon="el-icon-close"
              :disabled="scope.row.endTime !== null && new Date(scope.row.endTime).getTime() < new Date().getTime()"
              @click="disableForm(scope.row)"
            >作废</el-button>
            <el-button
              type="text"
              icon="el-icon-check"
              :disabled="scope.row.endTime === null || new Date(scope.row.endTime).getTime() > new Date().getTime()"
              @click="recoverForm(scope.row)"
            >启用
            </el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="editForm(scope.row)"
            >修改
            </el-button>
            <el-button
              icon="el-icon-delete"
              type="text"
              class="btn-delete btn-no-padding"
              @click="deleteForm(scope.row)"
            >删除
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 增加或者修改输出表弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="addOutputForm" label-width="80px" :rules="rules" :model="addOutputFormData" @submit.native.prevent @keyup.enter.native="submitForm('addOutputForm')">
        <el-form-item label="表格名称" prop="outputFormName" class="el-mb-0">
          <el-input v-model.trim="addOutputFormData.outputFormName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addOutputForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 模板管理弹窗 -->
    <el-dialog title="模板管理" :visible.sync="dialogModuleVisible" class="template-dialog">
      <el-upload
        class="upload-template"
        :class="{'no-files':!fileList.length}"
        action="#"
        multiple
        :file-list="fileList"
        :http-request="uploadSectionFile"
        :before-upload="beforeUpload"
      >
        <div slot="tip" class="el-upload__tip el-mt-2">请上传doc/docx文件</div>
        <el-button slot="trigger" size="small" type="primary" icon="el-icon-document-add">上传模板</el-button>
        <el-button class="el-ml-3" icon="el-icon-document-delete" @click="clearFile">清空模板</el-button>
        <input id="editTemplate" type="file" style="display:none">
        <template slot="file" slot-scope="scope">
          <a v-if="scope.file.status !== 'uploading'" class="el-upload-list__item-name" @click="handleFileClick(scope.file)">
            <svg-icon icon-class="icc-files-doc" class="el-mr-2" />{{ scope.file.description }}
          </a>
          <label class="el-upload-list__item-status-label">
            <i
              :class="{
                'el-icon-upload-success': true,
                'el-icon-circle-check': true,
              }"
            />
          </label>
          <i slot="trigger" class="update-icon list-item-icon el-primary" title="更新模板" @click="handleEditFile(scope.file)">
            <svg-icon icon-class="ic-upload" />
          </i>
          <i class="el-icon-delete list-item-icon btn-delete" title="删除模板" @click="handleRemoveFile(scope.file)" />
          <el-progress
            v-if="scope.file.status === 'uploading'"
            type="line"
            :stroke-width="2"
            :percentage="parsePercentage(scope.file.percentage)"
          />
        </template>
      </el-upload>
    </el-dialog>
    <downLoad :filename="fileName" :data="fileData" />
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Watch, Inject } from 'vue-property-decorator'
// 引入操作表单的方法
import { getForm, addForm, deleForm, disableForm, recoverForm } from '@/api/input-form/form'
import { getOutputForm, addOutputForm, removeOutputForm, disabledOutputForm, recoverOutputForm, editOutputForm, getReportTemplate, clearReportTemplate, delReportTemplate, addReportTemplate, updateReportTemplate, downloadReportTemplate } from '@/api/output-form/outputForm'
import { ModuleState } from '@/store/modules/module'
import { Message } from 'element-ui'
import { warn } from 'vue-class-component/lib/util'
import { Loading } from '../../extend'
import downLoad from '@/components/Download/index.vue'
import { download } from '@/utils/tools'

// 表单和字段接口
interface OutputFormData {
  keyOrder: number | null
  order: number | null
  description: string
  endTime: null | string
  orderIndex: number | null
  parentId: string
  organId: string
}
// 添加输出表接口
interface addOutputFormData {
  outputFormName: string
}

@Component({
  name: 'Va-outputForm',
  components: {
    downLoad
  }
})
export default class extends Vue {
  @Inject('loading') loading!: Loading
  // 储存所有输出表
  private formLists:any[] = []
  // 模块id
  private moduleId:string = ''
  // 记录被点击表格的模块Id
  private selectedModuleId: string = ''
  // 控制“添加/修改表单”弹窗是否出现
  private dialogFormVisible:boolean = false
  // 模板管理弹窗是否出现
  private dialogModuleVisible:boolean = false
  // 表格描述
  private description:string |undefined = undefined
  // 添加输出表数据
  private addOutputFormData:addOutputFormData = {
    outputFormName: ''
  }
  // 修改或增加弹窗
  private title:string = ''
  // 弹窗操作方法
  private dialogMethod:string = ''
  // 输出表id
  private reportId:string = ''
  // 配置'添加表单'弹窗中的输入内容的规格
  private rules:object = {
      outputFormName: [
          { required: true, message: '请输入表单名称', trigger: 'blur' }
      ]
  }
  // 记录表单状态
  private status:number | null = null
  // 业务组名
  private get businessName() {
    return ModuleState.opName
  }
  // 基础业务组id
  private get keyTypeCode() {
    return ModuleState.opId
  }
  // 模块id前缀名称
  private get moduleIdName() {
    return ModuleState.moduleIdName
  }
  // 模板列表
  private fileList:any[] = []
  private listType = 'text'
  private fileDescription:string = ''
  private onProgress:boolean = false
  private fileData = new Blob([])
  private fileName:string = ''

  @Watch('keyTypeCode')
  keyTypeCodeChange() {
    this.initForm()
  }
  created() {
    this.initForm()
  }
  // 初始化表单数据
  async initForm() {
    if (this.keyTypeCode) { // keyTypeCode存在，请求表单
      this.formLists = []
      this.loading.start()
      try {
        let res = await getOutputForm({ keyTypeCode: this.keyTypeCode })
        this.formLists = res.data
      } catch {}
       this.loading.close()
    }
  }
  // 记录表格点击
  tableRowClassName({ row, rowIndex }:any) {
    if (row.endTime !== null && new Date(row.endTime).getTime() < new Date().getTime()) {
      return 'invalid'
    }
    // 把每一行的索引放进row
    row.index = rowIndex
  }
  // 监听表单点击
  selected(row:any) {
    this.description = row.reportName
    this.reportId = row.reportId
  }
  // 监听新增按钮点击
  addInputForm() {
    if (!this.keyTypeCode) {
      this.$message('请先选择对应的业务组')
    } else {
      this.addOutputFormData.outputFormName = ''
      this.title = '创建输出表'
      this.dialogMethod = 'add'
      this.dialogFormVisible = true
    }
  }
  // 修改表单按钮
  editForm(row:any) {
    this.addOutputFormData.outputFormName = row.reportName
    this.reportId = row.reportId
    this.title = '修改输出表'
    this.dialogMethod = 'edit'
    this.dialogFormVisible = true
  }
  // 发起修改或者增加表单请求
  async submitForm(formName:string) {
    (this.$refs[formName] as any).validate(async(valid:any) => {
      if (valid) { // 表示输入的数据格式符合要求 => 进行添加输出表操作
        // 让弹窗窗口消失
        this.dialogFormVisible = false
        this.loading.start()
        try {
          let res:any = ''
          if (this.dialogMethod === 'add') {
            res = await addOutputForm({ keyTypeCode: this.keyTypeCode, reportName: this.addOutputFormData.outputFormName.toString() })
          } else if (this.dialogMethod === 'edit') {
            res = await editOutputForm({ reportId: this.reportId, reportName: this.addOutputFormData.outputFormName })
          }
          if (res.status === 200) {
            this.$message.success('操作成功')
            this.initForm()
          }
        } catch {}
        this.loading.close()
      }
    })
  }
  // 删除表单
  deleteForm(row:any) {
    this.$confirm('确定要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading.start()
      removeOutputForm(String(row.reportId)).then(res => {
        this.loading.close()
        this.$message.success('删除成功')
        this.initForm()
      }).catch(err => {
        this.loading.close()
        this.$message.error(err)
      })
    }).catch(() => {
      this.$message.info('已取消删除')
    })
  }
  // 废除表格
  async disableForm(row:any) {
    this.loading.start()
    try {
      let res = await disabledOutputForm({ reportId: row.reportId })
      if (res.status === 200) {
        this.$message.success('作废表单成功')
        this.initForm()
      }
    } catch {}
    this.loading.close()
  }
  // 恢复表格
  async recoverForm(row:any) {
    this.loading.start()
    try {
      let res = await recoverOutputForm({ reportId: row.reportId })
      if (res.status === 200) {
        this.$message.success('表单恢复成功')
        this.initForm()
      }
    } catch {}
    this.loading.close()
  }
  // 模板管理
  async templateManager(row:any) {
    this.reportId = row.reportId
    this.getReportTemplate()
    this.dialogModuleVisible = true
  }
  // 获取模板
  async getReportTemplate() {
    this.loading.start()
    try {
      let res = await getReportTemplate({ reportId: this.reportId, reportDefineId: 0 })
      if (res.status === 200) {
        this.fileList = [...res.data]
      }
    } catch {}
    this.loading.close()
  }
  async handleFileClick(file:any) {
    let reportDefineId = file.reportDefineId
    this.fileName = file.description
    try {
      let res = await downloadReportTemplate(reportDefineId)
      this.fileData = res.data
    } catch {}
  }
  // 上传进度
  parsePercentage(val:any) {
    return parseInt(val, 10)
  }
  // 更新模板
  handleEditFile(val:any) {
    let reportDefineId = val.reportDefineId
    if (reportDefineId) {
      let batchUpload:any = document.getElementById('editTemplate')
      batchUpload.click()
      batchUpload.addEventListener('change', async() => {
        let filesList = batchUpload.files
        if (filesList.length !== 0) {
          let choosedfile = filesList[0]
          let description = choosedfile.name
          choosedfile.description = description
          let file = new FormData()
          file.append('file', choosedfile)
          try {
            let res = await updateReportTemplate({ reportDefineId: reportDefineId, description: description }, file)
            this.getReportTemplate()
            this.$message.success('更新成功')
          } catch { this.getReportTemplate() }
        }
      })
    }
  }
  // 删除单个模板
  async handleRemoveFile(val:any) {
    if (val['reportDefineId']) {
      this.$confirm('改操作将永久删除该文件,确定继续删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      this.loading.start()
      try {
        let res = await delReportTemplate(val['reportDefineId'])
        if (res.status === 200) {
          this.fileList = this.fileList.filter(it => it.reportDefineId !== val.reportDefineId)
          this.$message.success('删除成功')
        }
      } catch {}
      this.loading.close()
    }).catch(() => {})
    }
  }
  // 清空列表
  clearFile() {
    this.$confirm('确定要清空该报表下的所有模板吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      this.loading.start()
      try {
        let res = await clearReportTemplate(this.reportId)
        this.getReportTemplate()
        this.$message.success('清空模板成功')
      } catch {}
      this.loading.close()
    }).catch(() => {})
  }
  // 上传前钩子
  beforeUpload(file:any) {
    let description = file.name
    let index = description.lastIndexOf('.')
    let typeName = description.substring(index, description.length)
    if (typeName.indexOf('.doc') === -1 && typeName.indexOf('.docx') === -1) {
      this.$message.warning('只能上传.doc/docx格式的文件')
      return false
    }
  }
  // 上传模板
  async uploadSectionFile(content:any) {
    let type = content.file.type
    content.file.description = content.file.name
    let description = content.file.name
    let params = {
      reportId: this.reportId,
      description: description
    }
    let file = new FormData()
    file.append('file', content.file)
    this.loading.start()
    try {
      let res = await addReportTemplate(params, file, content)
      this.getReportTemplate()
      this.$message.success('添加模板成功')
    } catch {
      this.getReportTemplate()
    }
    this.loading.close()
  }
}
</script>

<style lang="scss">
  .outputform-table {
    // 用来设置当前页面element全局table 选中某行时的背景色
    .el-table__body tr.current-row>td{
      background-color: #1890ff !important;
      color: white;
      button{
        color: white;
      }
    }
    tr{
      cursor: pointer;
    }
    // 表单作废时的样式
    .el-table .invalid {
      color: rgb(158, 157, 157);
      background-color: rgba(235, 235, 235, 0.6);
    }
    .el-table::before {
      display: none;
    }
  }
  // 设置上传清单中无数据时的样式
  .no-files{
    .el-upload-list {
      min-height: 158px;
      background-image: url('../../assets/image/notemplate.png');
      background-repeat: no-repeat;
      background-position: center 29px;
      position: relative;
      background-color:rgba(250,250,250,1);
    }
    .el-upload-list:after {
      content: '暂无模板，请添加';
      width: 100%;
      position: absolute;
      right: 0;
      bottom: 17px;
      text-align: center;
      font-size: 14px;
      color:rgba(191,191,191,1);
      line-height:22px;
    }
  }
  .upload-template {
    .el-upload-list {
      margin-top: 16px;
    }
    .el-upload-list__item {
      height: 48px;
      line-height: 48px;
      background-color:rgba(250,250,250,1);
    }
    .el-upload-list__item:hover {
      background-color:rgba(230,247,255,1);
    }
  }
</style>
<style lang="scss" scoped>
  .outputform-wrapper{
    height: 100%;
    display: flex;
    flex-direction: column;
    .outputform-button {
      flex-shrink: 0;
    }
    .outputform-table {
      flex-grow: 1;
      position: relative;
    }
    .update-icon.list-item-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 30px;
      display: none;
    }
    .el-icon-delete.list-item-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5px;
      display: none;
    }
    .el-upload-list__item:hover{
      .list-item-icon {
        display: inline-block;
        cursor: pointer;
      }
    }
    .template-dialog> ::v-deep .el-dialog {
      width: 640px!important;
    }
    .upload-template {
      .svg-icon {
        font-size: 16px;
      }
    }
  }
</style>
