<template>
  <div class="inputform-wrapper">
    <!-- 表单区域 -->
    <div class="inputform-button">
      <el-form :inline="true" label-width="78px" style="margin-top:10px" @submit.native.prevent>
        <el-form-item label="业务编号:">
          <el-input v-model="groupId" placeholder="请选择业务组" style="width: 100px" disabled />
        </el-form-item>
        <el-form-item label="业务名称:">
          <el-input v-model="businessName" placeholder="请选择业务组" style="width: 240px" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addInputForm">新增</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="deleteForm">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="inputform-table">
      <el-table
        ref="formList"
        :data="formLists"
        row-key="keyOrder"
        lazy
        height="100%"
        style="position:absolute"
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        highlight-current-row
        :row-class-name="tableRowClassName"
        @row-click="selected"
      >
        <el-table-column prop="order" label="表单编号" :show-overflow-tooltip="true" width="200" />
        <el-table-column
          prop="description"
          label="表单名称"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column label="操作" align="center" width="410">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.flagName !== 'field'"
              size="small"
              type="text"
              icon="el-icon-plus"
              @click="addField(scope.row)"
            >普通字段</el-button>
            <el-button
              v-if="scope.row.flagName !== 'field'"
              size="small"
              type="text"
              icon="el-icon-plus"
              @click="addSonField(scope.row)"
            >表中表子字段</el-button>
            <el-button
              v-if="scope.row.flagName !== 'field'"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="editInputForm(scope.row)"
            >修改</el-button>
            <el-button
              v-if="scope.row.flagName !== 'field'"
              size="small"
              type="text"
              icon="el-icon-close"
              :disabled="scope.row.status === 2"
              @click="disableForm(scope.row)"
            >作废</el-button>
            <el-button
              v-if="scope.row.flagName !== 'field'"
              size="small"
              type="text"
              icon="el-icon-check"
              :disabled="scope.row.status === 1"
              @click="recoverForm(scope.row)"
            >启用</el-button>
            <el-button
              v-if="scope.row.flagName == 'field'"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="showDeatils(scope.row)"
            >字段属性</el-button>
            <el-button
              v-if="scope.row.flagName == 'field'"
              size="small"
              type="text"
              icon="el-icon-delete"
              class="btn-delete"
              @click="removeField(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加表单弹窗  -->
    <el-dialog title="添加输入表" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" :rules="rules">
        <el-form-item label="表格编号">
          <el-input placeholder="表格编号由系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="表格名称" prop="name" class="el-mb-0">
          <el-input v-model.trim="ruleForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改输入表弹窗  -->
    <el-dialog title="修改表单" :visible.sync="editFormVisible">
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" :rules="rules">
        <el-form-item label="表格编号">
          <el-input v-model="editFormId" disabled />
        </el-form-item>
        <el-form-item label="表格名称" prop="name" class="el-mb-0">
          <el-input v-model.trim="ruleForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加普通字段弹窗 -->
    <el-dialog title="添加字段" :visible.sync="fieldVisible" :before-close="handleClose">
      <el-form
        ref="fildForm"
        :model="fildForm"
        :rules="rules"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="字段名称" prop="fldId">
          <el-input v-model="fildForm.fldId" disabled />
        </el-form-item>
        <el-form-item label="字段描述" prop="description">
          <el-input v-model.trim="fildForm.description" />
        </el-form-item>
        <el-form-item label="字段类型" prop="fldType">
          <el-select v-model="fildForm.fldType" placeholder="请选择字段类型" style="width:100%">
            <el-option label="普通字段" value="1" />
            <el-option v-if="!sonFieldVisible" label="子表从表字段" value="2" />
            <el-option label="意见从表字段" value="3" />
            <el-option label="选项从表字段" value="4" />
            <el-option label="附件从表字段" value="5" />
            <el-option label="自定义指令字段" value="6" />
            <el-option label="签名字段" value="7" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="sonFieldVisible"
          label="表中表总字段"
          prop="parentFldId"
          :rules="[
            { required: true, message: '请选择对应的表中表总字段', trigger: ['blur', 'change'] },
          ]"
        >
          <el-select v-model="fildForm.parentFldId" placeholder="请选择表中表总字段" style="width:100%">
            <el-option
              v-for="item in tableFields"
              :key="item.order"
              :label="item.description"
              :value="item.order"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型" prop="fldDataType">
          <el-select v-model="fildForm.fldDataType" placeholder="请选择数据类型" style="width:100%">
            <el-option label="字符串字段" value="1" />
            <el-option label="整形字段" value="2" />
            <el-option label="实数字段" value="3" />
            <el-option v-show="fildForm.fldType === '1'" label="布尔字段" value="4" />
            <el-option v-show="fildForm.fldType === '1'" label="日期字段" value="5" />
            <el-option v-show="fildForm.fldType === '1'" label="日期时间字段" value="6" />
            <el-option v-show="fildForm.fldType === '1'" label="时间字段" value="7" />
            <el-option label="文本字段" value="8" />
            <el-option
              v-show="fildForm.fldType === '1' || fildForm.fldType === '7'"
              label="图片字段"
              value="9"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字段长度" prop="fldDataLength">
          <el-input
            v-model="fildForm.fldDataLength"
            :disabled="fildForm.fldDataType === '2' || fildForm.fldDataType === '4' || fildForm.fldDataType === '8' || fildForm.fldDataType === '9'"
          />
        </el-form-item>
        <el-form-item label="字段精度" prop="fldDataPrecision" class="el-mb-0">
          <el-input v-model="fildForm.fldDataPrecision" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>fieldVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNow('fildForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 字段属性弹窗 -->
    <el-dialog title="字段属性" :visible.sync="showFieldsDetails">
      <el-form
        ref="fieldDetails"
        :model="fieldDetails"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="字段名称" prop="fldId">
          <el-input v-model="fieldDetails.fldId" disabled />
        </el-form-item>
        <el-form-item label="字段描述" prop="description">
          <el-input v-model="fieldDetails.description" />
        </el-form-item>
        <el-form-item label="字段类型" prop="fldType">
          <el-select v-model="fieldDetails.fldType" disabled style="width:100%">
            <el-option label="普通字段" value="1" />
            <el-option label="子表从表字段" value="2" />
            <el-option label="意见从表字段" value="3" />
            <el-option label="选项从表字段" value="4" />
            <el-option label="附件从表字段" value="5" />
            <el-option label="自定义指令字段" value="6" />
            <el-option label="签名字段" value="7" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="fieldDetails.parentFldId !== ''"
          label="表中表总字段"
          prop="parentFldId"
        >
          <el-select v-model="fieldDetails.parentFldId" style="width:100%" disabled>
            <el-option
              v-for="item in tableFields"
              :key="item.order"
              :label="item.description"
              :value="item.order"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型" prop="fldDataType">
          <el-select
            v-model="fieldDetails.fldDataType"
            :disabled="fieldDetails.fldType !=='1'"
            style="width:100%"
          >
            <el-option label="字符串字段" value="1" />
            <el-option label="整形字段" value="2" />
            <el-option label="实数字段" value="3" />
            <el-option v-show="fildForm.fldType === '1'" label="布尔字段" value="4" />
            <el-option v-show="fildForm.fldType === '1'" label="日期字段" value="5" />
            <el-option v-show="fildForm.fldType === '1'" label="日期时间字段" value="6" />
            <el-option v-show="fildForm.fldType === '1'" label="时间字段" value="7" />
            <el-option label="文本字段" value="8" />
            <el-option v-show="fildForm.fldType === '1'" label="图片字段" value="9" />
          </el-select>
        </el-form-item>
        <el-form-item label="字段长度" prop="fldDataLength">
          <el-input
            v-model="fieldDetails.fldDataLength"
            :disabled="fieldDetails.fldDataType === '2' || fieldDetails.fldDataType === '4' || fieldDetails.fldDataType === '8' || fieldDetails.fldDataType === '9' || fieldDetails.fldType !=='1'"
          />
        </el-form-item>
        <el-form-item label="字段精度" prop="fldDataPrecision" class="el-mb-0">
          <el-input
            v-model="fieldDetails.fldDataPrecision"
            :disabled="fieldDetails.fldType !=='1'"
          />
        </el-form-item>
        <span slot="footer" class="dialog-footer">
          <el-button @click="()=>showFieldsDetails=false">取 消</el-button>
          <el-button type="primary" @click="editForm">确 定</el-button>
        </span>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Watch, Inject } from 'vue-property-decorator'
// 引入操作表单的方法
// import { disableForm, recoverForm } from '@/api/input-form/form'
import {
  getForm,
  addForm,
  deleForm,
  disableForm,
  recoverForm,
  editForm
} from '@/api/va-Inputform'
// 引入字段操作方法
import {
  getFormFields,
  addFormField,
  deleteFormField,
  editFormField
} from '@/api/input-form/field'
// import { Loading } from 'element-ui'
import { ModuleState } from '@/store/modules/module'
import { Loading } from '../../extend'
// 增加和修改表单弹窗表单数据接口
interface RuleFormData {
  name: string | undefined
}

// 定义储存字段数据的接口
interface fieldDataStorage {
  [propName: string]: any[]
}

// 字段数据接口
interface FieldData {
  fldId: string | null | number
  description: string | null
  fldType: string
  fldDataType: string | null
  fldDataPrecision: number | null
  fldDataLength: number | null
  parentFldId: string
}
// 表单和字段接口
interface InputFormData {
  keyOrder: string | null
  order: number | string | null
  description: string | null
  status: null | number
  fldType: number | null
  fldDataType: number | null
  fldDataLength: number | null
  fldDataPrecision: number | null
  flagName: string | null
  hasChildren: boolean | null
  parentId: string | number | null
  parentFldId?: string
}
// 定义表单下的控件数据储存接口，注意跟 系统 控件字段数据存储的区别
interface UiFieldStorage {
  [key: string]: any[]
}

@Component({
  name: 'Va-InputForm'
})
export default class extends Vue {
  @Inject('loading') loading!: Loading
  private businessId: string = '1'
  // 储存所有表单信息
  private formLists: any[] = []
  // 标记表格是否废弃
  private onUse: boolean = true
  // 记录被点击的表格id
  private selectedId: number | null = null
  // 记录被点击表格的索引
  private formIndex: number = 0
  // 记录被点击的字段id
  private fldId: string = ''
  // 控制“排序”按钮的子按钮是否出现
  private contentShow: boolean = false
  // 控制“添加表单”弹窗是否出现
  private dialogFormVisible: boolean = false
  // 控制"修改表单" 弹窗是否出现
  private editFormVisible: boolean = false
  // 需要修改的表单的id
  private editFormId: string = ''
  // 表格描述
  private description: string | undefined = undefined
  // 记录formId
  private formId: number | undefined = undefined
  // 弹窗表格数据
  private ruleForm: RuleFormData = {
    name: ''
  }
  // 配置'添加表单'弹窗中的输入内容的规格
  private rules: object = {
    name: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
    description: [
      { required: true, message: '请输入字段描述', trigger: 'blur' }
    ]
  }
  // 记录表单状态
  private status: number | null = null
  // 记录已经懒加载的node
  private lazyLoadedId: string[] = []
  // 将所有已经懒加载的数据保存
  private formLoaded: any[] = []
  // 储存所的表中表总字段
  private tableFields: any[] = []
  // 保存加载后的字段数据
  private fieldDataStorage: fieldDataStorage = {}
  // 控制添加普通字段弹窗
  private fieldVisible: boolean = false
  // --添加表中表子字段弹窗
  private sonFieldVisible: boolean = false
  // 字段数据添加
  private fildForm: FieldData = {
    fldId: null,
    description: '',
    fldType: '1',
    fldDataType: '1',
    fldDataPrecision: null,
    fldDataLength: 80,
    parentFldId: ''
  }
  // 字段属性弹窗
  private showFieldsDetails: boolean = false
  // 字段属性
  private fieldDetails: FieldData = {
    fldId: null,
    description: '',
    fldType: '',
    fldDataType: '',
    fldDataLength: null,
    fldDataPrecision: null,
    parentFldId: ''
  }
  // 保存获取到的最初的字段属性
  private primeFieldData: InputFormData = {
    keyOrder: null,
    order: null,
    description: null,
    status: null,
    fldType: null,
    fldDataType: null,
    fldDataLength: null,
    fldDataPrecision: null,
    flagName: null,
    hasChildren: null,
    parentId: null
  }
  // 存储系统控件字段
  private systemUiFieldStorage: any[] = []
  // 存储表单控件字段数据
  private uiFieldStorage: UiFieldStorage = {}
  // 记录字段初始属性
  private primaryFldDataType: string = ''

  // 业务组输出表id
  private get groupId() {
    return ModuleState.keyTypeCode
  }
  // 业务组名
  private get businessName() {
    // return ModuleState.businessName
    return ModuleState.opName
  }
  // 记录从其他表单选择字段选中的表单id和字段id
  private otherFormField: string = ''

  @Watch('fildForm.fldDataType')
  private DataTypeChange(value: string) {
    if (value === '1') {
      this.fildForm.fldDataLength = 80
    } else if (value === '2') {
      this.fildForm.fldDataLength = 4
    } else if (value === '3') {
      this.fildForm.fldDataLength = 12
      this.fildForm.fldDataPrecision = 2
    } else if (value === '4') {
      this.fildForm.fldDataLength = 1
    } else if (value === '8' || value === '9') {
      this.fildForm.fldDataLength = 16
    } else if (value === '5' || value === '6' || value === '7') {
      this.fildForm.fldDataLength = 10
    }
  }
  @Watch('fieldDetails.fldDataType')
  private ShowDataTypeChange(value: string) {
    if (value === '1') {
      this.fieldDetails.fldDataLength = 80
    } else if (value === '2') {
      this.fieldDetails.fldDataLength = 4
    } else if (value === '3') {
      this.fieldDetails.fldDataLength = 12
      this.fildForm.fldDataPrecision = 2
    } else if (value === '4') {
      this.fieldDetails.fldDataLength = 1
    } else if (value === '8' || value === '9') {
      this.fieldDetails.fldDataLength = 16
    } else if (value === '5' || value === '6' || value === '7') {
      this.fieldDetails.fldDataLength = 10
    }
  }
  // 监听业务组变化，初始化表单
  @Watch('groupId')
  private GroupIdChanged(value: string) {
    this.initForm()
  }
  created() {
    if (this.formLists === []) {
      this.initForm()
    }
  }
  // 定义一个方法，将数据转化成table树需要的格式
  transFormData(data: any) {
    const inputFormData: any[] = []
    for (const item of data) {
      const singleFormData: InputFormData = {
        keyOrder: null,
        order: null,
        description: null,
        status: null,
        fldType: null,
        fldDataType: null,
        fldDataLength: null,
        fldDataPrecision: null,
        flagName: null,
        hasChildren: null,
        parentId: null,
        parentFldId: ''
      }
      if (item['formGroupId']) {
        // 接收的是输入表单数据
        singleFormData['keyOrder'] = 'form_' + item['formId']
        singleFormData['order'] = item['formId']
        singleFormData['status'] = item['state']
        singleFormData['flagName'] = 'form'
        singleFormData['hasChildren'] = true
      } else {
        // 接收的是字段数据
        singleFormData['keyOrder'] = item['fldId']
        singleFormData['order'] = item['fldId']
        singleFormData['fldType'] = item['fldType']
        singleFormData['fldDataType'] = item['fldDataType']
        singleFormData['fldDataLength'] = item['fldDataLength']
        singleFormData['fldDataPrecision'] = item['fldDataPrecision']
        singleFormData['parentId'] = item['formId']
        singleFormData['flagName'] = 'field'
        singleFormData['parentFldId'] = item['parentFldId']
      }
      singleFormData['description'] = item['description']
      inputFormData.push(singleFormData)
    }
    return inputFormData
  }
  // 初始化表单数据
  initForm() {
    if (this.groupId !== null) {
      // groupId存在，请求表单
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
      getForm(this.groupId as any)
        .then(res => {
          // 1.2 让加载的蒙版消失
          this.loading.close()
          if (res.status === 200) {
            const inputFormData = this.transFormData(res.data)
            // 1.3 将所有数据保存到formList
            this.formLists = inputFormData
          } else {
            this.$message.error('表单初始化失败')
          }
        })
        .catch(error => {
          this.loading.close()
          this.$message.error('表单初始化失败' + error)
        })
    }
  }
  // 表单字段懒加载
  async load(tree: any, treeNode: any, resolve: any) {
    // 将懒加载的节点储存起来
    const keyOrder = tree.keyOrder
    if (this.lazyLoadedId.indexOf(keyOrder) === -1) {
      this.lazyLoadedId.push(keyOrder)
      const data = { tree, treeNode, resolve }
      this.formLoaded.push(data)
    }
    const formId = tree['order']
    // 请求该表单的字段
    const fieldData = await this.getFormField(formId)
    resolve(fieldData)
  }
  // 请求表单字段
  async getFormField(formId: number) {
    try {
      const res = await getFormFields(formId)
      if (res.status === 200) {
        // 将数组按照fldId尾号数进行大小排序
        const fildDatas = res.data
        fildDatas.sort((object1: any, object2: any) => {
          const value1 = object1.fldId
          const value2 = object2.fldId
          const tagIndex1 = value1.lastIndexOf('_') + 1
          const tagIndex2 = value2.lastIndexOf('_') + 1
          const lastNum1 = value1.substr(tagIndex1, value1.length)
          const lastNum2 = value2.substr(tagIndex2, value2.length)
          return lastNum1 - lastNum2
        })
        const fieldData = this.transFormData(fildDatas)
        // 将所有的表中表总字段储存
        this.tableFields = []
        for (const item of fieldData) {
          if (String(item.fldType) === '2') this.tableFields.push(item)
        }
        // 将懒加载的字段按照formId储存起来
        this.fieldDataStorage[formId] = fieldData
        return fieldData
      } else {
        this.$message.error('请求字段失败')
        return
      }
    } catch {
      this.$message.error('请求字段失败')
      window.location.reload()
    }
  }
  // 记录表格点击
  tableRowClassName({ row, rowIndex }: any) {
    if (row.status === 2) {
      return 'invalid'
    }
    // 把每一行的索引放进row
    row.index = rowIndex
  }
  // 监听表单点击
  selected(row: any) {
    // 2.1记录被选择的id和索引
    this.selectedId = row.order
    this.formIndex = row.index
    this.description = row.description
    if (row['flagName'] === 'form') {
      this.formId = row.order
    } else {
      this.formId = row.parentId
      this.fldId = row.order
    }
  }
  // 监听新增按钮点击
  addInputForm() {
    if (!this.groupId) {
      this.$message('请先选择对应的业务组')
    } else {
      this.dialogFormVisible = true
    }
  }
  // 新增表单
  submitForm(formName: string) {
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        // 表示输入的数据格式符合要求 => 进行保存数据操作
        // 2.1展现正在加载蒙版
        // const loading = this.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        this.loading.start()
        // 2.2- 发起增加表单申请
        addForm({
          description: this.ruleForm.name,
          keyTypeCode: this.groupId
        })
          .then(res => {
            // 2.3- 让加载的蒙版消失
            this.loading.close()
            if (res.status === 200) {
              // 添加表格成功
              // 2.4 -初始化表单
              this.initForm()
            } else {
              this.$message.error('添加表格失败')
            }
          })
          .catch(error => {
            this.loading.close()
            this.$message.error(error)
            // window.location.reload()
          })

        // 3-让弹窗窗口消失
        this.dialogFormVisible = false
      } else {
        // 输入的数据格式不符合要求
        return false
      }
    })
    // 4-清空表单内容
    ;(this.$refs[formName] as any).resetFields()
  }
  // 修改表单
  confirmEdit(ruleForm: string) {
    (this.$refs[ruleForm] as any).validate(async(valid: any) => {
      if (valid) {
        // const loading = this.$loading({
        //   lock: true,
        //   text: '正在修改...',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        this.loading.start()
        try {
          let res = await editForm({
            formId: this.editFormId,
            formName: this.ruleForm.name
          })
          if (res.status === 200) {
            this.initForm()
          } else {
            this.$message.error('修改表单失败')
          }
        } catch {
          Vue.prototype.$message.error('修改表单失败')
        }
        this.ruleForm.name = ''
        this.loading.close()
        this.editFormVisible = false
      } else {
        return false
      }
    })
  }
  // 取消修改
  cancelEdit() {
    this.ruleForm.name = ''
    this.editFormId = ''
    this.editFormVisible = false
  }
  // 删除表单
  deleteForm() {
    // 4.1- 判断是否选择了表单
    if (!this.selectedId) {
      // 没有选择表单
      this.$alert('请选择需要删除的表单', {
        confirmButtonText: '确定',
        showClose: false
      })
    } else {
      // 已选择表单
      // 4.2- 询问用户是否确定要删除表单
      this.$confirm(
        '此操作将删除选中的表单或选中字段对应的表单, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 4.3- 发起删除操作
          // 4.3.1展现正在加载蒙版
          // const loading = this.$loading({
          //   lock: true,
          //   text: 'Loading',
          //   spinner: 'el-icon-loading',
          //   background: 'rgba(0, 0, 0, 0.7)'
          // })
          this.loading.start()
          // 4.3.2- 获取需要删除表格的id
          const formId = this.formId
          // 4.3.3 -进行删除
          deleForm(formId as number)
            .then(res => {
              this.loading.close()
              if (res.status === 200) {
                // 删除成功
                // 4.3.3 -初始化表单
                this.initForm()
              } else {
                this.$message.error('删除失败')
              }
            })
            .catch(error => {
              window.location.reload()
              this.loading.close()
              this.$message.error(error)
            })
        })
        .catch(() => {})
    }
  }
  // 废除表格
  disableForm(row: any) {
    // 5.2展现正在加载蒙版
    // const loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    this.loading.start()
    const order = row.order
    // 5.3 发起废除表格请求
    disableForm(order)
      .then(res => {
        this.loading.close()
        if (res.status === 200) {
          this.$message.success('操作成功')
          // 5.4 初始化表格
          this.initForm()
        } else {
          this.$message.error('操作失败')
        }
      })
      .catch(err => {
        this.loading.close()
        this.$message.error(err)
      })
  }
  // 恢复表格
  recoverForm(row: any) {
    // 5.2展现正在加载蒙版
    // const loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    this.loading.start()
    const order = row.order
    // 5.3 发起恢复表格请求
    recoverForm(order)
      .then(res => {
        if (res.status === 200) {
          this.loading.close()
          // 5.5 初始化表格
          this.initForm()
          this.$message.success('操作成功')
        } else {
          this.$message.error('操作失败')
        }
      })
      .catch(err => {
        this.loading.close()
        this.$message.error(err)
      })
  }
  // 修改输入表
  editInputForm(row: any) {
    this.editFormId = row.order
    this.ruleForm.name = row.description
    this.editFormVisible = true
  }
  // 重置‘增加表单’弹窗内容
  resetForm(formName: string) {
    (this.$refs[formName] as any).resetFields()
  }
  // 添加表中表子字段
  addSonField(row: any) {
    this.sonFieldVisible = true
    this.addField(row)
  }
  // 添加字段
  async addField(row: any) {
    this.formId = row.order
    const formId = row.order
    if (this.fieldDataStorage[formId] !== undefined) {
      // 已经加载过
      const storagedField = this.fieldDataStorage[formId]
      // 将所有的表中表总字段储存
      this.tableFields = []
      for (const item of storagedField) {
        if (String(item.fldType) === '2') this.tableFields.push(item)
      }
      this.toAddField(storagedField, formId)
    } else {
      // 没有加载过
      const fieldData = await this.getFormField(formId)
      this.toAddField(fieldData, formId)
    }
  }
  // 定义一个函数，根据传入的fieldData计算字段id，并且发起添加字段请求
  toAddField(existedField: any, formId: number | string) {
    let currentIndex
    // 判断数组是否为空
    if (existedField.length === 0) {
      // 创建第一个表单
      currentIndex = 1
    } else {
      // 不为空
      // 取出最后一个字段fldId的尾数
      const num = existedField.length - 1
      const lastFldId = existedField[num].order
      // 获取最后一个'_'的索引
      const lastTagIndex = lastFldId.lastIndexOf('_') + 1
      const idLastNum = Number(lastFldId.substr(lastTagIndex, lastFldId.length))
      currentIndex = idLastNum + 1
    }
    // 定义字段的名称
    const fldId = 'Fld_' + formId + '_' + currentIndex
    // let fldId = 'InFld_'+formId+'_'+currentIndex
    this.fildForm.fldId = fldId
    // 2.5 还原添加表单默认值
    this.fildForm.description = ''
    this.fildForm.fldType = '1'
    this.fildForm.fldDataType = '1'
    this.fildForm.fldDataPrecision = 0
    this.fildForm.fldDataLength = 80
    this.fildForm.parentFldId = ''
    // 展现蒙版
    this.fieldVisible = true
  }
  // 立即添加字段
  addNow(fildForm: string) {
    (this.$refs[fildForm] as any).validate((valid: any) => {
      if (valid) {
        // 3.0 -让蒙版内容消失
        this.fieldVisible = false
        // 3.1 展现加载蒙版
        // const loading = this.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        this.loading.start()
        // 隐藏添加字段弹窗中的选择表中表总字段
        this.sonFieldVisible = false
        // 3.2-将数据转换为发送请求需要的类型
        const description = this.fildForm.description
        const fldDataLength = Number(this.fildForm.fldDataLength)
        const fldDataPrecision = this.fildForm.fldDataPrecision || 0
        const fldDataType = Number(this.fildForm.fldDataType)
        const fldId = this.fildForm.fldId
        const fldType = Number(this.fildForm.fldType)
        const formId = this.formId
        const parentFldId = this.fildForm.parentFldId
        // 添加字段
        addFormField([
          {
            description: description,
            fldDataLength: fldDataLength,
            fldDataPrecision: fldDataPrecision,
            fldDataType: fldDataType,
            fldId: fldId,
            fldType: fldType,
            formId: formId,
            parentFldId: parentFldId
          }
        ])
          .then(res => {
            if (res.status === 200) {
              // 请求成功
              this.$message.success('添加成功')
              // 3.5 初始化字段
              this.reLoad()
            } else {
              this.loading.close()
              this.$message.error('添加字段失败')
            }
          })
          .catch(error => {
            this.loading.close()
            this.$message.error('添加字段失败' + error)
          })
      }
    })
  }
  // 关闭添加字段弹窗
  handleClose(done: any) {
    this.sonFieldVisible = false
    done()
  }
  // 定义一个方法，更新懒加载
  reLoad() {
    // 清空保存的selectedId, 避免bug
    this.selectedId = null
    this.uiFieldStorage = {}
    // const loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    this.loading.start()
    // 重新懒加载更新的树
    for (const node of this.formLoaded) {
      const id = node.tree.keyOrder
      const { tree, treeNode, resolve } = node
      this.$set(
        (this.$refs.formList as any).store.states.lazyTreeNodeMap,
        id,
        []
      )
      this.load(tree, treeNode, resolve)
    }
    this.loading.close()
  }
  // 删除字段
  removeField(row: any) {
    this.formId = row.parentId
    this.fldId = row.order
    this.$confirm('确定要删除该字段吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        // 发起删除
        // 展现蒙版
        // const loading = this.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        this.loading.start()
        deleteFormField(this.formId as number, [this.fldId])
          .then(res => {
            if (res.status === 200) {
              this.reLoad()
              this.$message.success('删除成功')
            }
          })
          .catch(err => {
            this.loading.close()
            this.$message.error('删除失败' + err)
          })
      })
      .catch(err => {
        this.$message.error(err)
      })
  }
  // 获取字段属性
  showDeatils(row: any) {
    this.primeFieldData = row
    this.fieldDetails.fldId = row.order
    this.fieldDetails.description = row.description
    this.fieldDetails.fldType = String(row.fldType)
    this.fieldDetails.fldDataType = String(row.fldDataType)
    this.primaryFldDataType = String(row.fldDataType)
    this.fieldDetails.fldDataLength = row.fldDataLength
    this.fieldDetails.fldDataPrecision = row.fldDataPrecision
    this.fieldDetails.parentFldId = row.parentFldId
    const formId = row.parentId
    const fldId = row.order
    this.showFieldsDetails = true
  }
  // 修改字段
  editForm() {
    if (this.fieldDetails.fldType === '1') {
      // 发起修改
      if (
        String(this.primaryFldDataType) !==
        String(this.fieldDetails.fldDataType)
      ) {
        this.$confirm(
          '修改数据类型可能会造成数据精度缺失或其他异常问题，是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.editFldDetails()
          })
          .catch(() => {})
      } else {
        this.editFldDetails()
      }
    } else {
      this.$message.warning('只有普通字段类型才能修改')
    }
  }
  // 确定修改字段属性
  editFldDetails() {
    this.showFieldsDetails = false
    // const loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    this.loading.start()
    editFormField([
      {
        description: this.fieldDetails.description,
        fldDataLength: this.fieldDetails.fldDataLength,
        fldDataPrecision: this.fieldDetails.fldDataPrecision,
        fldDataType: this.fieldDetails.fldDataType,
        fldId: this.fieldDetails.fldId,
        fldType: this.fieldDetails.fldType,
        formId: this.formId
      }
    ])
      .then(res => {
        if (res.status === 200) {
          // 9.3 -让蒙版内容消失以及初始化表格
          this.$message.success('修改成功')
          const tempData = this.uiFieldStorage
          this.reLoad()
          this.uiFieldStorage = tempData // 修改不会改变控件属性，所以讲原控件数据保存，避免再次请求
        }
      })
      .catch(res => {
        this.loading.close()
        this.$message.error('更新失败')
      })
  }
  // 重置字段详情
  resetFieldDetails() {
    this.fieldDetails.fldId = this.primeFieldData.order
    this.fieldDetails.description = this.primeFieldData.description
    this.fieldDetails.fldType = String(this.primeFieldData.fldType)
    this.fieldDetails.fldDataType = String(this.primeFieldData.fldDataType)
    this.fieldDetails.fldDataLength = this.primeFieldData.fldDataLength
    this.fieldDetails.fldDataPrecision = this.primeFieldData.fldDataPrecision
  }
  // 定义一个方法，根据表单id和字段id查找对应的控件对象
  findUiField(fldId: string, uiData: any[]) {
    for (const item of uiData) {
      if (item['fldId'].indexOf(fldId) !== -1) {
        return item
      }
    }
  }
  mounted() {
    this.initForm()
  }
}
</script>

<style lang="scss">
.inputform-table {
  // 用来设置当前页面element全局table 选中某行时的背景色
  .el-table__body tr.current-row > td {
    background-color: #1890ff !important;
    color: white;
    button {
      color: white;
    }
  }
  tr {
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
</style>
<style lang="scss" scoped>
.inputform-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .inputform-button {
    flex-shrink: 0;
  }
  .inputform-table {
    flex-grow: 1;
    position: relative;
  }
}
</style>
