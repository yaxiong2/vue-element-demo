<template>
  <div style="height:100%;overflow: auto" class="el-flex el-flex-column">
    <el-form :inline="true" class="el-pa-4">
      <el-form-item label="部门名称">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="form-button">
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button
          v-hasPermi="['system:dept:add']"
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <div class="content-box__gap el-flex-grow overflow-hidden">
      <div class="fill-height">
        <el-table
          height="100%"
          :data="deptList"
          row-key="deptId"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="deptName" label="部门名称" width="200" />
          <el-table-column prop="orderNum" label="排序" width="200" />
          <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="200">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['system:dept:edit']"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-hasPermi="['system:dept:add']"
                type="text"
                icon="el-icon-plus"
                @click="handleAdd(scope.row)"
              >新增</el-button>
              <el-button
                v-if="scope.row.parentId != 0"
                v-hasPermi="['system:dept:remove']"
                class="btn-delete"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col v-if="form.parentId !== 0" :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Inject } from 'vue-property-decorator'
import {
  listDept,
  getDept,
  treeselect,
  delDept,
  addDept,
  updateDept
} from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

// 指定查询参数接口
interface QueryParams {
  deptName: string
  status: string
}
// 表单接口
interface FormData {
  deptId: number | undefined
  parentId: number | undefined
  deptName: string | undefined
  orderNum: number | undefined
  leader: string | undefined
  phone: string | undefined
  email: string | undefined
  status: string | undefined
  [key: string]: any
}

@Component({
  name: 'Dept',
  components: {
    Treeselect
  }
})
export default class extends Vue {
  // 遮罩层
  // private loading:boolean = true
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  // 表格树数据
  private deptList: any[] = []
  // 部门部门树选项
  private deptOptions: string[] = []
  // 弹出层标题
  private title: string = ''
  // 是否显示弹出层
  private open: boolean = false
  // 状态数据字典
  private statusOptions: any[] = []
  // 查询参数
  private queryParams: QueryParams = {
    // 查询参数
    deptName: '',
    status: ''
  }
  // 表单参数
  private form: FormData = {
    deptId: undefined,
    parentId: 100,
    deptName: undefined,
    orderNum: undefined,
    leader: undefined,
    phone: undefined,
    email: undefined,
    status: '0'
  }
  // 表单校验
  private rules: object = {
    parentId: [
      { required: true, message: '上级部门不能为空', trigger: 'blur' }
    ],
    deptName: [
      { required: true, message: '部门名称不能为空', trigger: 'blur' }
    ],
    orderNum: [
      { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
    ],
    email: [
      {
        type: 'email',
        message: "'请输入正确的邮箱地址",
        trigger: ['blur', 'blur']
      }
    ],
    phone: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur'
      }
    ]
  }

  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then((response: any) => {
      this.statusOptions = response.data
    })
  }
  /** 查询部门列表 */
  getList() {
    // this.loading = true
    this.loading.start()
    listDept(this.queryParams).then(response => {
      this.deptList = response.data
      // this.loading = false
      this.loading.close()
    })
  }
  /** 查询部门下拉树结构 */
  getTreeselect() {
    treeselect().then(response => {
      this.deptOptions = response.data
    })
  }
  // 字典状态字典翻译
  statusFormat(row: any, column: any) {
    return this.selectDictLabel(this.statusOptions, row.status)
  }
  // 取消按钮
  cancel() {
    this.open = false
    this.reset()
  }
  // 表单重置
  reset() {
    this.form = {
      deptId: undefined,
      parentId: 100,
      deptName: undefined,
      orderNum: undefined,
      leader: undefined,
      phone: undefined,
      email: undefined,
      status: '0'
    }
  }
  /** 搜索按钮操作 */
  handleQuery() {
    this.getList()
  }
  /** 新增按钮操作 */
  handleAdd(row: any) {
    this.reset()
    this.getTreeselect()
    if (row !== undefined) {
      this.form.parentId = row.deptId
    }
    this.open = true
    this.title = '添加部门'
  }
  /** 修改按钮操作 */
  handleUpdate(row: any) {
    this.reset()
    this.getTreeselect()
    getDept(row.deptId).then(response => {
      this.form = response.data
      this.open = true
      this.title = '修改部门'
    })
  }
  /** 提交按钮 */
  submitForm() {
    (this.$refs['form'] as any).validate((valid: any) => {
      if (valid) {
        if (this.form.deptId !== undefined) {
          updateDept(this.form).then((response: any) => {
            if (response.status === 200) {
              this.$message.success('修改成功')
              this.open = false
              this.getList()
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          addDept(this.form).then((response: any) => {
            if (response.status === 200) {
              this.$message.success('新增成功')
              this.open = false
              this.getList()
            } else {
              this.$message.error(response.msg)
            }
          })
        }
      }
    })
  }
  /** 删除按钮操作 */
  handleDelete(row: any) {
    this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(function() {
        return delDept(row.deptId)
      })
      .then(() => {
        this.getList()
        this.$message.success('删除成功')
      })
      .catch(function() {})
  }
}
</script>
<style lang="scss" scoped>
</style>
