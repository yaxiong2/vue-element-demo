<template>
  <div class="el-flex el-flex-column">
    <div class="el-pa-4">
      <el-form :inline="true" label-width="68px">
        <el-form-item label="用户名称">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号码"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item class="form-button">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button
            v-show="currentRole !== &quot;guard&quot;"
            v-hasPermi="['system:user:add']"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="20" class="content-box__gap overflow-hidden">
      <!--部门数据-->
      <el-col :span="5" :xs="24" class="depatData">
        <div class="searchBar">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="treeContent">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!--用户数据-->
      <el-col :span="19" :xs="24" class="el-py-4">
        <el-table :data="userList">
          <el-table-column label="用户编号" align="center" prop="userId" />
          <el-table-column label="用户名称" align="center" prop="userName" />
          <el-table-column label="用户昵称" align="center" prop="nickName" />
          <el-table-column label="部门" align="center" prop="dept.deptName" />
          <el-table-column label="手机号码" align="center" prop="phone" width="120" />
          <el-table-column v-if="currentRole !== 'guard'" label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="220"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['system:user:edit']"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1&& currentRole !== 'guard'"
                v-hasPermi="['system:user:remove']"
                type="text"
                icon="el-icon-delete"
                class="btn-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                v-hasPermi="['system:user:resetPwd']"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
              >重置</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" :disabled="!isAdmin" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <!-- :options="deptOptions" -->
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                placeholder="请选择归属部门"
                :disabled="!isAdmin"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号码"
                maxlength="11"
                :disabled="!isAdmin"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
                :disabled="!isAdmin"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" :disabled="!isAdmin" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                :disabled="!isAdmin"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择" :disabled="!isAdmin">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="currentRole !== 'guard'" :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :disabled="!isAdmin"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col v-show="currentRole !== &quot;guard&quot;" :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择" :disabled="!isAdmin">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="currentRole == &quot;guard&quot;" :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择" :disabled="!isGuard">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-else v-show="form.userId !== undefined" :span="24">
            <el-form-item label="所属角色">
              <el-select v-model="form.roleIds" multiple placeholder="尚未设置角色" :disabled="!isGuard">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
                :disabled="!isAdmin"
              />
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

<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator'
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  updateUserRole
} from '@/api/system/user'
import { treeselect } from '@/api/system/dept'
import { listPost } from '@/api/system/post'
import { listRole } from '@/api/system/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import store from '@/store/index'
// import { Message } from 'element-ui';
import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'User',
  components: {
    Treeselect
  }
})
export default class extends Vue {
  private currentRole: string = '' // 储存登录的角色
  // private loading:Boolean = true // 遮罩层
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private total: Number = 0 // 总条数
  private userList: any = null // 用户表格数据
  private title: string = '' // 弹出层标题
  private deptOptions: string[] = [] // 部门树选项
  private open: Boolean = false // 是否显示弹出层
  private deptName: string = '' // 部门名称
  private initPassword: string = '' // 默认密码
  private dateRange: any[] = [] // 日期范围
  private statusOptions: any[] = [] // 状态数据字典
  private sexOptions: any[] = [] // 性别状态字典
  private postOptions: any[] = [] // 岗位选项
  private roleOptions: any[] = [] // 角色选项
  private roleList: any = '' // 所有角色列表
  private form = {
    userId: undefined,
    deptId: 100,
    userName: undefined,
    nickName: undefined,
    password: '',
    phone: undefined,
    email: undefined,
    sex: undefined,
    status: '0',
    remark: undefined,
    postIds: [],
    roleIds: []
  } // 表单参数
  private defaultProps = {
    children: 'children',
    label: 'label'
  }
  private queryParams = {
    // 查询参数
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phone: undefined,
    status: undefined,
    deptId: undefined
  }
  private rules = {
    // 表单校验
    userName: [
      { required: true, message: '用户名称不能为空', trigger: 'blur' }
    ],
    nickName: [
      { required: true, message: '用户昵称不能为空', trigger: 'blur' }
    ],
    deptId: [{ required: true, message: '归属部门不能为空', trigger: 'blur' }],
    password: [
      { required: true, message: '用户密码不能为空', trigger: 'blur' }
    ],
    email: [
      {
        type: 'email',
        message: "'请输入正确的邮箱地址",
        trigger: ['blur', 'change']
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
  private isAdmin: boolean = false // 是不是管理员
  private isGuard: boolean = false // 是不是保密员
  getUserRoles() {
    UserModule.roles &&
      UserModule.roles.map((item: string) => {
        if (item === 'admin') {
          this.isAdmin = true
        } else if (item === 'guard') {
          this.isGuard = true
        }
      })
  }

  @Watch('deptName', { immediate: true })
  private onDeptNameChange(value: string) {
    // console.log(this.$refs.tree)
    // (this.$refs.tree as Array).filter(value);
  }

  created() {
    this.getUserRoles()
    this.currentRole = UserModule.roles === null ? '' : UserModule.roles[0]
    this.getList()
    this.getTreeselect()
    getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    getDicts('sys_user_sex').then(response => {
      this.sexOptions = response.data
    })
    getConfigKey('sys.user.initPassword').then(response => {
      this.initPassword = response.data
    })
  }

  /** 查询用户列表 */
  private getList() {
    this.loading.start()
    listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
      response => {
        response = response.data
        this.userList = (response as any).rows
        this.total = Number((response as any).total)
        this.loading.close()
      }
    )
  }

  /** 查询部门下拉树结构 */
  getTreeselect() {
    treeselect().then(response => {
      this.deptOptions = response.data
    })
  }
  // 筛选节点
  filterNode(value: any, data: any) {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }
  // 节点单击事件
  handleNodeClick(data: any) {
    this.queryParams.deptId = data.id
    this.getList()
  }
  /** 查询岗位列表 */
  getPosts() {
    listPost().then((response: any) => {
      this.postOptions = response.rows
    })
  }
  /** 查询角色列表 */
  getRoles() {
    listRole().then(response => {
      response = response.data
      this.roleOptions = (response as any).rows
      // 将所有的角色名改造成一个字符串
      const roles: any[] = []
      for (const value of this.roleOptions) {
        roles.push(value.roleName)
      }
      this.roleList = roles.join()
    })
  }
  // 用户状态修改
  handleStatusChange(row: any) {
    const text = row.status === '0' ? '启用' : '停用'
    this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(function() {
        return changeUserStatus(row.userId, row.status)
      })
      .then(res => {
        this.$message({ message: text + '成功', type: 'success' })
      })
      .catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
  }
  // 取消按钮
  cancel() {
    this.open = false
    this.reset()
  }
  // 表单重置
  reset() {
    this.form = {
      userId: undefined,
      deptId: 100,
      userName: undefined,
      nickName: undefined,
      password: '',
      phone: undefined,
      email: undefined,
      sex: undefined,
      status: '0',
      remark: undefined,
      postIds: [],
      roleIds: []
    }
  }
  /** 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1
    this.getList()
  }
  /** 新增按钮操作 */
  handleAdd() {
    this.reset()
    this.getTreeselect()
    // 如果为安全保密员，则不需要获取岗位信息
    if (this.currentRole !== 'guard') {
      this.getPosts()
    }
    this.getRoles()
    this.open = true
    this.title = '添加用户'
    this.form.password = this.initPassword
  }
  /** 修改按钮操作 */
  handleUpdate(row: any) {
    this.reset()
    this.getTreeselect()
    // 如果为安全保密员，则不需要获取岗位信息
    if (this.currentRole !== 'guard') {
      this.getPosts()
    }
    this.getRoles()
    getUser(row.userId).then((response: any) => {
      this.form = response.data.user
      this.form.postIds = response.data.user.postIds
      this.form.roleIds = response.data.roleIds.map(String)
      this.open = true
      this.title = '修改用户'
      this.form.password = ''
    })
  }
  /** 重置密码按钮操作 */
  handleResetPwd(row: any) {
    (this as any)
      .$prompt('请输入"' + row.userName + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      .then(({ value }: any) => {
        resetUserPwd(row.userId, value).then(response => {
          if ((response as any).status === 200) {
            this.$message({
              showClose: true,
              message: '修改成功，新密码是：' + value,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: (response as any).msg,
              type: 'error'
            })
          }
        })
      })
      .catch(() => {})
  }
  /** 提交按钮 */
  submitForm() {
    (this.$refs['form'] as any).validate((valid: any) => {
      if (valid) {
        if (this.form.userId !== undefined) {
          if (this.currentRole === 'guard') {
            console.log(222, 'guard')
            updateUserRole(this.form).then(response => {
              if ((response as any).status === 200) {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                this.open = false
                this.getList()
              } else {
                this.$message({
                  showClose: true,
                  message: (response as any).msg,
                  type: 'error'
                })
              }
            })
          } else if (this.currentRole === 'admin') {
            console.log(111, 'admin')
            console.log(this.form)
            updateUser(this.form).then(response => {
              if ((response as any).status === 200) {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                this.open = false
                this.getList()
              } else {
                this.$message({
                  showClose: true,
                  message: (response as any).msg,
                  type: 'error'
                })
              }
            })
          }
        } else {
          addUser(this.form).then(response => {
            if ((response as any).status === 200) {
              this.$message({
                showClose: true,
                message: '新增成功',
                type: 'success'
              })
              this.open = false
              this.getList()
            } else {
              this.$message({
                showClose: true,
                message: (response as any).msg,
                type: 'error'
              })
            }
          })
        }
      }
    })
  }
  /** 删除按钮操作 */
  handleDelete(row: any) {
    this.$confirm('是否确认删除名称为"' + row.userName + '"的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(function() {
        return delUser(row.userId)
      })
      .then(() => {
        this.getList()
        this.$message({ showClose: true, message: '删除成功', type: 'success' })
      })
      .catch(function() {})
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  height: 100%;
  .el-col {
    height: 100%;
    overflow: auto;
  }
  // 部门数据布局
  .depatData {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    .searchBar {
      flex-shrink: 0;
    }
    .treeContent {
      flex-grow: 1;
      overflow-y: auto;
    }
  }
}
</style>
