<template>
  <div class="wrapper">
    <el-col style="padding-left:0">
      <!--业务组展示区域及操作按钮  -->
      <el-form :inline="true" label-width="78px" @submit.native.prevent>
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
          <el-button type="primary" icon="el-icon-delete" @click="deleteForm">删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单展示区域 -->
      <el-table
        ref="formList"
        :data="formLists"
        row-key="keyOrder"
        height="calc(100vh - 180px)"
        highlight-current-row
        :row-class-name="tableRowClassName"

        @row-click="selected"
      >
        <el-table-column prop="order" label="输出表编号" :show-overflow-tooltip="true" width="200" />
        <el-table-column prop="description" label="输出表名称" :show-overflow-tooltip="true" align="center" />
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-plus"
              @click="templateManager(scope.row)"
            >模板管理</el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-close"
              :disabled="scope.row.endTime !== null"
              @click="disableForm(scope.row)"
            >作废</el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-check"
              :disabled="scope.row.endTime === null"
              @click="recoverForm(scope.row)"
            >启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!-- 增加输出表弹窗 -->
    <el-dialog title="添加输出表" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="addOutputForm" label-width="100px" :rules="rules" :model="addOutputFormData">
        <el-form-item label="模块名称">
          <el-input v-model="moduleName" disabled />
        </el-form-item>
        <el-form-item label="表格名称" prop="outputFormName" style="margin-top:30px">
          <el-input v-model.trim="addOutputFormData.outputFormName" />
        </el-form-item>
        <el-form-item style="margin-top:30px">
          <el-button type="primary" @click="submitForm('addOutputForm')">确认</el-button>
          <el-button @click="resetForm('addOutputForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 模板管理弹窗 -->
    <el-dialog title="模板管理" :visible.sync="dialogModuleVisible" width="500px">
      <span>模板管理</span>
    </el-dialog>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Watch, Inject } from 'vue-property-decorator'
// 引入操作表单的方法
import { getForm, addForm, deleForm, disableForm, recoverForm } from '@/api/input-form/form'
import { getOutputForm, addOutputForm, removeOutputForm, disabledOutputForm, recoverOutputForm } from '@/api/output-form/outputForm'
import { ModuleState } from '@/store/modules/module'
import { Message } from 'element-ui'
import { Loading } from '../../extend'

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
  name: 'Va-outputForm'
})
export default class extends Vue {
  @Inject('loading') loading!: Loading
  // 储存所有输出表
  private formLists:any[] = []
  // 模块id
  private moduleId:string = ''
  // 记录被点击的表格id
  private selectedId:number | null = null
  // 记录被点击表格的模块Id
  private selectedModuleId: string = ''
  // 控制“添加表单”弹窗是否出现
  private dialogFormVisible:boolean = false
  // 模板管理弹窗是否出现
  private dialogModuleVisible:boolean = false
  // 表格描述
  private description:string |undefined = undefined
  // 添加输出表数据
  private addOutputFormData:addOutputFormData = {
    outputFormName: ''
  }
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
    return ModuleState.businessName
  }
  // 基础业务组id
  private get keyTypeCode() {
    return ModuleState.keyTypeCode
  }
  // 模块名
  private get moduleName() {
    return ModuleState.moduleName
  }
  // 模块id前缀名称
  private get moduleIdName() {
    return ModuleState.moduleIdName
  }
  @Watch('keyTypeCode')
  keyTypeCodeChange() {
    // this.initForm()
  }
  created() {
    this.initForm()
  }
  // 定义一个方法，将数据转化成table树需要的格式
  transFormData(data:any) {
    const inputFormData:any[] = []
    for (const item of data) {
      const singleFormData:OutputFormData = {
        keyOrder: null,
        order: null,
        description: '',
        endTime: '',
        orderIndex: null,
        parentId: '',
        organId: ''
      }
      singleFormData.keyOrder = item.reportId
      singleFormData.order = item.reportId
      singleFormData.description = item.reportName
      singleFormData.endTime = item.endTime
      singleFormData.orderIndex = item.orderIndex
      singleFormData.parentId = item.keyTypeCode
      singleFormData.organId = item.organId
      inputFormData.push(singleFormData)
    }
    return inputFormData
  }
  // 初始化表单数据
  initForm() {
    if (this.keyTypeCode) { // keyTypeCode存在，请求表单
      // 清空保存的selectedId, 避免bug
      this.selectedId = null
      this.formLists = []
      // 1.1展现正在加载蒙版
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      this.loading.start()
      getOutputForm({
        keyTypeCode: this.keyTypeCode
      }).then(res => {
        // 1.2 让加载的蒙版消失
        this.loading.close()
        if (res.status === 200) {
          const outputFormData = this.transFormData(res.data)
          // 1.3 将所有数据保存到formList
          this.formLists = outputFormData
        } else {
          this.$message.error('输出表初始化失败')
        }
      }).catch(error => {
        this.loading.close()
        this.$message.error('输出表初始化失败' + error)
      })
    }
  }
  // 记录表格点击
  tableRowClassName({ row, rowIndex }:any) {
    if (row.endTime !== null) {
      return 'invalid'
    }
    // 把每一行的索引放进row
    row.index = rowIndex
  }
  // 监听表单点击
  selected(row:any) {
    // 2.1记录被选择的id和索引
    this.selectedId = row.order
    this.selectedModuleId = row.organId
    this.description = row.description
  }
  // 监听新增按钮点击
  addInputForm() {
    if (!this.keyTypeCode) {
      this.$message('请先选择对应的业务组')
    } else {
      this.dialogFormVisible = true
    }
  }
  // 新增表单
  submitForm(formName:string) {
    (this.$refs[formName] as any).validate((valid:any) => {
      if (valid) { // 表示输入的数据格式符合要求 => 进行添加输出表操作
        // 计算模块id
        if (this.formLists.length !== 0) { // 已建立过输出表，计算输出表模块Id
          let maxIdEndNumber = 1
          for (const item of this.formLists) {
            const organdId = item.organId
            const IdEndNum = Number(organdId.split('_')[1])
            maxIdEndNumber = maxIdEndNumber < IdEndNum ? IdEndNum : maxIdEndNumber
          }
          maxIdEndNumber += 1
          this.moduleId = `${this.moduleIdName}_${maxIdEndNumber}`
        } else { // 尚未有输出表
          this.moduleId = `${this.moduleIdName}_1`
        }
        // 让弹窗窗口消失
        this.dialogFormVisible = false
        // 展现正在加载蒙版
        // const loading = this.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        this.loading.start()
        // 2.2- 发起增加表单申请
        addOutputForm({
          reportName: this.addOutputFormData.outputFormName.toString(),
          organId: this.moduleId,
          keyTypeCode: this.keyTypeCode
        }).then(res => {
            // 让加载的蒙版消失
            this.loading.close()
            if (res.status === 200) { // 添加表格成功
              // 2.4 -初始化表单
              this.$message.success('添加成功')
              this.initForm()
            } else {
              this.$message.error('添加表格失败')
          }
        }).catch(error => {
          this.loading.close()
          this.$message.error(error)
        })
      }
    })
  }
  // 删除表单
  deleteForm() {
    // 判断是否选择了表单
    if (!this.selectedId) { // 没有选择表单
      this.$alert('请选择需要删除的表单', {
      confirmButtonText: '确定',
      showClose: false
      })
    } else { // 已选择表单
      // 询问用户是否确定要删除表单
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发起删除操作
        // const loading = this.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        this.loading.start()
        removeOutputForm(String(this.selectedId)).then(res => {
          this.loading.close()
          this.$message.success('删除成功')
          this.initForm()
        }).catch(err => {
          this.loading.close()
          this.$message.error(err)
        })
      })
    }
  }
  // 废除表格
  disableForm(row:any) {
    // 5.2展现正在加载蒙版
    // const loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    // this.loading.start()
    const organId = row.organId
    const reportId = row.order
    // disabledOutputForm(reportId, {
    //   organId: organId
    // }).then(res => {
    //   loading.close()
    //   if (res.status === 200) {
    //     this.$message.success('操作成功')
    //     this.initForm()
    //   } else {
    //     this.$message.error('操作失败')
    //   }
    // }).catch(err => {
    //   loading.close()
    //   this.$message.error(err)
    // })
  }
  // 恢复表格
  recoverForm(row:any) {
    // 5.2展现正在加载蒙版
    // const loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    // this.loading.start()
    const organId = row.organId
    const reportId = row.order
    // 5.3 发起恢复表格请求
    // recoverOutputForm(reportId, {
    //   organId: organId
    // }).then(res => {
    //   loading.close()
    //   if (res.status === 200) {
    //     this.$message.success('操作成功')
    //     this.initForm()
    //   } else {
    //     this.$message.error('操作失败')
    //   }
    // }).catch(err => {
    //   loading.close()
    //   this.$message.error(err)
    // })
  }
  // 重置‘增加表单’弹窗内容
  resetForm(formName:string) {
      (this.$refs[formName] as any).resetFields()
  }
  // 模板管理
  templateManager(row:any) {
    this.$message('该功能尚未实现')
  }
}
</script>

<style lang="scss">
  .wrapper{
    // 设置表单操作按钮和表单显示区域的距离
    .el-form-item--medium{
      margin-bottom: 5px;
    }
    /* 用来设置当前页面element全局table 选中某行时的背景色*/
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
  }
</style>
