<template>
  <div class="role">
    <div class="role-content">
      <div class="role-left el-pt-2">
        <el-select
          ref="selectVersion"
          v-model="checkedData"
          class="select-version"
          placeholder="请选择"
          @focus="setMinWidth"
        >
          <el-option class="cus-select-tree" value>
            <el-tree
              ref="versionRole"
              :data="roleVersion"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="clickVersion"
            />
          </el-option>
        </el-select>
        <div>
          <el-tooltip content="新增">
            <el-button type="text" size="mini" @click="addRole">
              <svg-icon icon-class="ic-plus" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="修改">
            <el-button type="text" size="mini" :disabled="activeRoleid===null" @click="modifyRole">
              <svg-icon icon-class="icl-edit" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button type="text" size="mini" :disabled="activeRoleid===null" @click="deleteRole">
              <svg-icon icon-class="icl-delete" />
            </el-button>
          </el-tooltip>
        </div>
        <el-input
          v-model="filterText"
          placeholder="请输入关键词检索..."
          clearable
          style="width:100%;margin:5px 0 5px 0"
          suffix-icon="el-icon-search"
        />
        <div class="role-table">
          <el-tree
            :data="roleTreedata"
            node-key="roleId"
            :props="{label:'roleName'}"
            highlight-current
            :indent="10"
            default-expand-all
            @node-click="getNoderole"
          >
            <div slot-scope="{ node }" class="custom-tree-node">
              <span v-if="node.label.length<30">
                {{ node.label }}
                <el-badge
                  v-if="node.childNodes.length"
                  class="mark"
                  :value="node.childNodes.length"
                  type="primary"
                />
                <!-- <i v-if="node.childNodes.length" class="tree-item-desc">{{ node.childNodes.length }}</i> -->
              </span>
              <el-tooltip v-else :content="node.label" placement="right">
                <span class="line-limit">{{ node.label }}</span>
              </el-tooltip>
            </div>
          </el-tree>
        </div>
      </div>

      <div class="role-right">
        <el-tabs v-model="activeName" class="role-tabs" @tab-click="handleClick">
          <el-tab-pane label="输入表权限" name="input" />
          <el-tab-pane label="输出表权限" name="output" />
          <el-tab-pane label="操作权限" name="operation" />
          <el-tab-pane label="人员角色配置" name="person" />
          <el-tab-pane label="角色可上传材料类型" name="role" />
          <el-tab-pane v-if="activeRoleType===2" label="箱子配置" name="configure" />
        </el-tabs>
        <!-- 箱子配置 -->
        <div v-show="activeName === 'configure'" class="table-content">
          <el-table :data="configureTabledata" height="calc(100%)" highlight-current-row>
            <el-table-column label="关联" width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" @change="boxChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="boxId" label="箱子编号" width="100" sortable />
            <el-table-column
              prop="boxName"
              label="箱子名称"
              :show-overflow-tooltip="true"
              min-width="150"
              sortable
            />
            <!-- <el-table-column label="描述" :show-overflow-tooltip="true" min-width="150">
              <template slot-scope="scope">
                <span class="line-limit">{{ scope.row.powerHelp }}</span>
              </template>
            </el-table-column>-->
          </el-table>
        </div>
        <!-- 输入表权限 -->
        <div v-show="activeName === 'input'" class="table-content">
          <ResizeContent
            :is-resizeable="true"
            left-width="50%"
            left-min-width="300"
            right-min-width="300"
          >
            <template v-slot:left>
              <el-table
                :data="roleInputTabledata"
                height="calc(100%)"
                highlight-current-row
                @row-click="getinputField"
              >
                <el-table-column
                  prop="formTbName"
                  label="表格名称"
                  sortable
                  :show-overflow-tooltip="true"
                  min-width="150"
                />
                <el-table-column label="查阅" width="50">
                  <template slot-scope="scope">
                    <el-checkbox
                      :checked="scope.row.formWriteable === 0"
                      :value="scope.row.formWriteable === 0"
                      @change="inputChange(scope.row, 0)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="填写" width="50">
                  <template slot-scope="scope">
                    <el-checkbox
                      :checked="scope.row.formWriteable === 1"
                      :value="scope.row.formWriteable === 1"
                      @change="inputChange(scope.row, 1)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template v-slot:right>
              <!-- 输入表字段 -->
              <el-table :data="roleTextdata" height="calc(100%)" highlight-current-row>
                <el-table-column
                  prop="description"
                  label="字段名称"
                  :show-overflow-tooltip="true"
                  sortable
                  min-width="150"
                />
                <el-table-column label="查阅" width="50">
                  <template slot-scope="scope">
                    <el-checkbox
                      :checked="scope.row.fldWriteable === 0"
                      :value="scope.row.fldWriteable === 0"
                      @change="fldChange(scope.row, 0)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="填写" width="50">
                  <template slot-scope="scope">
                    <el-checkbox
                      :checked="scope.row.fldWriteable === 1"
                      :value="scope.row.fldWriteable === 1"
                      @change="fldChange(scope.row, 1)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </ResizeContent>
        </div>
        <!-- 输出表权限 -->
        <div v-show="activeName === 'output'" class="table-content">
          <el-table :data="roleOutputTabledata" height="calc(100%)" highlight-current-row>
            <el-table-column
              prop="reportTbName"
              label="表格名称"
              :show-overflow-tooltip="true"
              min-width="150"
              sortable
            />
            <el-table-column label="浏览" width="50">
              <template slot-scope="scope">
                <el-checkbox
                  :checked="scope.row.writeable === 0"
                  :value="scope.row.writeable === 0"
                  @change="outputChange(scope.row, 0)"
                />
              </template>
            </el-table-column>
            <el-table-column label="打印" width="50">
              <template slot-scope="scope">
                <el-checkbox
                  :checked="scope.row.writeable === 1"
                  :value="scope.row.writeable === 1"
                  @change="outputChange(scope.row, 1)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 操作权限 -->
        <div v-show="activeName === 'operation'" class="table-content">
          <el-table :data="roleOperationTabledata" height="calc(100%)" highlight-current-row>
            <el-table-column label="允许" width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" @change="powerChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column
              prop="powerName"
              label="权限名称"
              :show-overflow-tooltip="true"
              min-width="150"
              sortable
            />
            <el-table-column label="描述" :show-overflow-tooltip="true" min-width="150">
              <template slot-scope="scope">
                <span class="line-limit">{{ scope.row.powerHelp }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 人员角色配置信息 -->
        <div v-show="activeName === 'person'" class="table-content">
          <div class="flex-end">
            <el-button type="primary" icon="el-icon-document" @click="personSave">保存</el-button>
            <el-button type="primary" @click="expandOpen(1)">
              <svg-icon icon-class="ic-indent" />全部展开
            </el-button>
            <el-button type="primary" @click="expandOpen(0)">
              <svg-icon icon-class="ic-outdent" />全部收缩
            </el-button>
          </div>
          <el-input v-model="personText" placeholder="请输入关键词检索..." clearable />
          <el-tree
            ref="personTree"
            node-key="id"
            class="person-tree"
            show-checkbox
            :data="personTreedata"
            :filter-node-method="personNode"
            highlight-current
            :default-checked-keys="personChecked"
            :default-expand-all="expandAll"
            :indent="suojin"
            @check="getClicked"
          />
        </div>
        <!-- 角色可上传材料类型 -->
        <div v-show="activeName === 'role'" class="table-content">
          <div class="flex-end">
            <el-button type="primary" icon="el-icon-document" @click="saveMaterial">保存</el-button>
          </div>
          <el-table
            ref="roleMaterial"
            :data="roleMaterialTabledata"
            height="calc(100% - 52px)"
            highlight-current-row
          >
            <el-table-column width="55" label="允许">
              <template slot-scope="scope">
                <el-checkbox
                  :checked="scope.row.uploadable === true"
                  @change="changeMaterial(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="materialTitle"
              label="材料名称"
              :show-overflow-tooltip="true"
              min-width="150"
              sortable
            />
            <el-table-column width="100" label="材料类型">
              <template slot-scope="scope">
                <span>{{ scope.row.asArchive === true?"成果材料":"申报材料" }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 角色修改弹框 -->
    <el-dialog :title="ifaddRole === 'modify' ? '修改角色' : '新增角色'" :visible.sync="roleDialogVisible">
      <el-form label-width="80px" label-position="left">
        <el-form-item
          label="角色名称"
          :rules="[{ required: true, message: '请填写角色名称', trigger: 'blur' }]"
        >
          <el-input
            v-if="ifaddRole === 'modify'"
            v-model="modifyroleForm.roleName"
            autocomplete="off"
          />
          <el-input v-else v-model="addroleForm.roleName" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="角色类型"
          :rules="[{ required: true, message: '请选择角色类型', trigger: 'blur' }]"
          class="el-mb-0"
        >
          <el-select
            v-if="ifaddRole === 'modify'"
            v-model="modifyroleForm.roleType"
            placeholder="请选择角色类型"
            style="width:100%"
          >
            <el-option
              v-for="item in roleTypes"
              :key="item.roleType"
              :label="item.roleName"
              :value="item.roleType"
            />
          </el-select>
          <el-select v-else v-model="addroleForm.roleType" placeholder="请选择角色类型" style="width:100%">
            <el-option
              v-for="item in roleTypes"
              :key="item.roleType"
              :label="item.roleName"
              :value="item.roleType"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator'
import { ModuleState } from '@/store/modules/module'
import {
  getRoleTree,
  modifyRole,
  removeRole,
  getRoleFormlist,
  setRoleFormInfo,
  getRoleInputField,
  setInputFiled,
  getRoleOutput,
  setOutputRole,
  getRolePower,
  setPowerRole,
  getBoxRoleUsers,
  setBoxRoleUsers,
  getRoleMaterial,
  setRoleMaterial,
  getRoleVersion,
  getRoleBox,
  addRoleBox,
  deleteRoleBox,
  getRoleUsers,
  setRoleUsers
} from '@/api/tree-data/roleManagement'
import { bpmQuery } from '@/api/material'
import ResizeContent from '@/components/ResizeContent/index.vue'
import { getPowerList } from '@/api/tree-data/rolePower'
import { getFormFields } from '@/api/input-form/field'
import { getUserTreeData } from '@/api/system/user'

interface personData {
  // 定义一个人员配置选中的接口
  keyTypeCode: number
  roleId: number
  userIds: Array<string>
}
// 遍历版本树 筛选procDefId!==null
function screenTree(oldArr: any) {
  const newArr = oldArr.filter(
    (x: any) => x.procDefId !== null || x.children !== null
  )
  newArr.forEach(
    (x: any) => x.children && (x.children = screenTree(x.children))
  )
  return newArr
}
@Component({
  name: 'Rolemanagement',
  components: {
    ResizeContent
  }
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private filterText: string = '' // 角色关键词
  private personText: string = '' // 人员配置关键词
  private roleTreedata: any = [
    {
      roleName: '流程角色',
      children: []
    },
    {
      roleName: '箱子角色',
      children: []
    }
  ] // 角色树数据
  private personTreedata: any = [] // 人员配置树

  private roleInputTabledata: any = [] // 角色输入表权限表数据
  private roleOutputTabledata: any = [] // 角色输出表权限表数据
  private roleOperationTabledata: any = [] // 角色操作表权限表数据
  private roleMaterialTabledata: any = [] // 角色材料表数据
  private roleOperation: any = [] // 公用角色权限数据
  private roleTextdata: any = [] // 角色输入表权限字段
  private suojin: number = 8 // 角色列表缩进
  private roleDialogVisible: boolean = false // 角色修改弹框
  private ifaddRole: string = '' // 角色是否修改添加
  private expandAll: boolean = false // 人员配置树是否展开
  private personChecked: [string?] = [] // 默认人员配置树选中
  private defaultActive: string = '0' // 默认选中角色
  private checkedVersion: string = '' // 角色默认选中的版本
  private checkedData: string = '' // 角色默认选中的版本
  private roleVersion: Array<object> = [] // 角色版本树
  private minWidth: number = 0
  private activeRoleType: number = 1 // 记录角色类型  1 流程角色 2 箱子角色// 公共角色权限类型 1:业务权限 2:阶段权限 3:查询权限
  private roleTypes: object = [
    { roleType: 1, roleName: '流程角色' },
    { roleType: 2, roleName: '箱子角色' }
  ]
  private personCheckedData: personData = {
    // 存储人员配置树选中的数据
    keyTypeCode: NaN,
    roleId: NaN,
    userIds: []
  }
  // 获取 keytypecode
  private get keytypecode() {
    return ModuleState.opId
  }

  private defaultProps: any = {
    children: 'children',
    label: 'roleName'
  }
  private modifyroleForm: any = {} // 修改角色表单
  private activeProcDefId: string = '' // 记录当前procDefId
  private activeRoleid: number | null = null // 记录当前点击的角色id
  private addroleForm: any = {
    roleName: '',
    keyTypeCode: this.keytypecode,
    procDefId: this.activeProcDefId,
    roleId: '',
    roleType: this.activeRoleType
  } // 添加角色表单
  private activeName: string = 'input'
  private activeInputid: string = '' // 记录当前点击的输入表id
  private materialChecked: any = {
    keyTypeCode: this.keytypecode,
    materials: this.roleMaterialTabledata,
    roleId: this.activeRoleid
  } // 记录选中的材料
  // 箱子配置
  private configureTabledata: any = [
    { boxId: 1, boxName: '查询箱', sortIndex: 1 },
    { boxId: 2, boxName: '在办箱', sortIndex: 2 },
    { boxId: 3, boxName: '预办箱', sortIndex: 3 },
    { boxId: 4, boxName: '已办箱', sortIndex: 4 },
    { boxId: 5, boxName: '办结箱', sortIndex: 5 },
    { boxId: 6, boxName: '督办箱', sortIndex: 6 },
    { boxId: 7, boxName: '会签箱', sortIndex: 7 }
  ]
  private boxCheckedArr: any = []
  private nodeItemObj: any = {}

  @Watch('personText')
  getPersonText(val: string | null, oldval: string | null) {
    const persontrees: any = this.$refs.personTree
    persontrees.filter(val)
  }
  personNode(value: string, data: any) {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }
  handleClick(tab: any) {
    this.activeName = tab.name
    if (this.activeRoleid !== null && !isNaN(this.activeRoleid)) {
      switch (this.activeName) {
        case 'input':
          this.getInputlist(this.activeRoleid)
          break
        case 'output':
          this.getOutputList(this.activeRoleid)
          break
        case 'operation':
          this.getRolePowerList(this.activeRoleid)
          break
        case 'person':
          getUserTreeData().then((res: any) => {
            this.personTreedata = res.data
          })
          this.getPersonTree(this.activeRoleid)
          break
        case 'role':
          this.getMaterial(this.activeRoleid)
          break
        case 'configure':
          this.boxCheckedList(this.keytypecode, this.activeRoleid)
          break
      }
    } else {
      this.$message.warning('请先点击角色')
    }
  }
  created() {
    this.getRolelist(this.keytypecode)
    this.getroleOperation(this.activeRoleType + 1)
  }
  // 获取角色权限公共数据
  getroleOperation(powerType: number) {
    getPowerList(powerType).then((res: any) => {
      this.roleOperation = []
      this.roleOperation = res.data
    })
  }
  // 选择版本
  clickVersion(val: any) {
    if (val.procDefId && this.activeProcDefId !== val.procDefId) {
      (this.$refs.selectVersion as any).visible = false
      this.checkedData = val.label
      this.activeProcDefId = val.procDefId
      this.getRoleLists(this.activeProcDefId)
      this.configureTabledata = [
        { boxId: 1, boxName: '查询箱', sortIndex: 1 },
        { boxId: 2, boxName: '在办箱', sortIndex: 2 },
        { boxId: 3, boxName: '预办箱', sortIndex: 3 },
        { boxId: 4, boxName: '已办箱', sortIndex: 4 },
        { boxId: 5, boxName: '办结箱', sortIndex: 5 },
        { boxId: 6, boxName: '督办箱', sortIndex: 6 },
        { boxId: 7, boxName: '会签箱', sortIndex: 7 }
      ]
    } else if (val.procDefId === null && val.children === null) {
      (this.$refs.selectVersion as any).visible = false
      this.checkedData = val.label
      this.activeProcDefId = val.procDefId
      this.roleTreedata = [
        {
          roleName: '流程角色',
          children: []
        },
        {
          roleName: '箱子角色',
          children: []
        }
      ]
      this.roleInputTabledata = []
      this.roleOutputTabledata = []
      this.roleOperationTabledata = []
      this.roleMaterialTabledata = []
      this.roleTextdata = []
      this.configureTabledata = []
      this.activeRoleid = null
    }
  }
  // 获取角色版本列表
  @Watch('keytypecode')
  getRolelist(val: number) {
    getRoleVersion(val).then((res: any) => {
      this.roleVersion = screenTree(res.data)
      if (this.activeProcDefId === '') {
        this.activeProcDefId = (this
          .roleVersion[0] as any).children[0].procDefId
        this.checkedData = (this.roleVersion[0] as any).children[0].label
        this.checkedVersion = (this.roleVersion[0] as any).children[0].id
        ;(this.$refs.versionRole as any).setCurrentKey(this.checkedVersion)
      }
      this.getRoleLists(this.activeProcDefId)
    })
  }
  // 获取角色列表
  getRoleLists(val: string) {
    if (val) {
      getRoleTree(this.keytypecode, val, 1).then((res: any) => {
        this.roleTreedata[0].children = res.data
        this.getNoderole(this.roleTreedata[0].children[0])
      })
      getRoleTree(this.keytypecode, val, 2).then((res: any) => {
        this.roleTreedata[1].children = res.data
        this.nodeItemObj = this.roleTreedata[0]
      })
    }
  }
  // 获取当前点击角色
  getNoderole(val: any) {
    if (!val.children) {
      this.activeRoleType = val.roleType
      this.modifyroleForm = val
      this.nodeItemObj = val
      if (this.activeRoleid !== val.roleId) {
        switch (this.activeName) {
          case 'configure':
            if (this.activeRoleType === 1) {
              this.activeName = 'input'
            }
            this.boxCheckedList(val.keyTypeCode, val.roleId)
            break
          case 'input':
            this.getInputlist(val.roleId)
            break
          case 'output':
            this.getOutputList(val.roleId)
            break
          case 'operation':
            this.getRolePowerList(val.roleId)
            break
          case 'person':
            this.getPersonTree(val.roleId)
            break
          case 'role':
            this.getMaterial(val.roleId)
            break
        }
        this.activeRoleid = val.roleId
        this.activeRoleType = val.roleType
      }
    } else {
      this.modifyroleForm = {}
    }
  }
  // 修改角色
  modifyRole() {
    if (!this.modifyroleForm.roleId) {
      this.$message.warning('请先点击要修改的角色')
    } else {
      this.ifaddRole = 'modify'
      this.roleDialogVisible = true
    }
  }
  // 添加角色
  addRole() {
    this.ifaddRole = 'add'
    this.roleDialogVisible = true
    this.addroleForm.keyTypeCode = this.keytypecode
    this.addroleForm.procDefId = this.activeProcDefId
  }
  // 修改弹窗保存
  save() {
    console.log(this.addroleForm)
    this.loading.start()
    let obj = {}
    this.ifaddRole === 'modify'
      ? (obj = this.modifyroleForm)
      : (obj = this.addroleForm)
    modifyRole(obj)
      .then((res: any) => {
        this.ifaddRole === 'modify'
          ? this.$message.success('修改成功')
          : this.$message.success('新增成功')
        this.getRolelist(this.keytypecode)
      })
      .finally(() => {
        this.roleDialogVisible = false
        this.loading.close()
      })
  }
  // 删除角色
  deleteRole() {
    if (!this.modifyroleForm.roleId) {
      this.$message.warning('请先点击要删除的角色')
    } else {
      let roleId = this.modifyroleForm.roleId
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading.start()
          removeRole([roleId])
            .then((res: any) => {
              this.$message.success('删除成功!')
              this.getRolelist(this.keytypecode)
            })
            .finally(() => {
              this.loading.close()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
  // 获取业务角色输入表权限列表
  getInputlist(roleId: number) {
    this.roleInputTabledata = []
    getRoleFormlist(this.keytypecode, roleId).then((res: any) => {
      this.roleInputTabledata = res.data
      this.getinputField(this.roleInputTabledata[0])
    })
  }
  // 获取输出表权限
  getOutputList(roleId: number) {
    this.roleOutputTabledata = []
    getRoleOutput(this.keytypecode, roleId).then((res: any) => {
      this.roleOutputTabledata = res.data
    })
  }
  // 输入表权限改变
  inputChange(data: any, val: any) {
    this.loading.start()
    if (data.formWriteable === val) {
      data.formWriteable = null
    } else {
      data.formWriteable = val
    }
    data.roleId = this.activeRoleid
    setRoleFormInfo(data)
      .then((res: any) => {
        this.getInputlist(this.activeRoleid!)
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 输入表字段权限改变
  fldChange(data: any, val: any) {
    this.loading.start()
    if (data.fldWriteable === val) {
      data.fldWriteable = null
    } else {
      data.fldWriteable = val
    }
    data.roleId = this.activeRoleid
    let obj: object = {
      fldId: data.fldId,
      fldWriteable: data.fldWriteable,
      formId: data.formId,
      id: null,
      keyTypeCode: this.keytypecode,
      roleId: this.activeRoleid
    }
    setInputFiled(obj)
      .then((res: any) => {
        this.getinputField({
          keyTypeCode: this.keytypecode,
          roleId: this.activeRoleid,
          formId: this.activeInputid
        })
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 获取输入表点击当前行的输入表字段
  getinputField(row: any) {
    this.roleTextdata = []
    let arr: any = []
    getFormFields(row.formId).then((res: any) => {
      arr = res.data
      getRoleInputField(this.keytypecode, this.activeRoleid!, row.formId).then(
        (res: any) => {
          res.data.forEach((item: any) => {
            arr.forEach((el: any) => {
              if (item.fldId === el.fldId) {
                el.fldWriteable = item.fldWriteable
                el.id = item.id
              }
            })
          })
          this.roleTextdata = arr
        }
      )
    })
    this.activeInputid = row.formId
  }
  // 输出表权限改变
  outputChange(data: any, val: any) {
    this.loading.start()
    if (data.writeable === val) {
      data.writeable = null
    } else {
      data.writeable = val
    }
    data.roleId = this.activeRoleid
    setOutputRole(data)
      .then((res: any) => {
        this.getOutputList(this.activeRoleid!)
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 获取角色权限列表
  getRolePowerList(roleId: number) {
    this.getroleOperation(this.activeRoleType + 1)
    getRolePower(this.keytypecode, roleId, this.activeRoleType + 1).then(
      (res: any) => {
        this.roleOperationTabledata = []
        let arr: any = []
        this.roleOperation.forEach((el: any) => {
          res.data.forEach((item: any) => {
            if (item.powerId === el.powerId) {
              el.checked = item.checked
            }
          })
        })
        this.roleOperationTabledata = this.roleOperation
      }
    )
  }
  // 角色权限列表权限改变
  powerChange(data: any) {
    this.loading.start()
    this.roleOperationTabledata = []
    data.keyTypeCode = this.keytypecode
    data.roleId = this.activeRoleid
    setPowerRole(data)
      .then((res: any) => {
        this.$message.success('修改成功')
        this.getRolePowerList(this.activeRoleid!)
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 控制人员配置树是否展开
  expandOpen(val: number) {
    if (val === 1) {
      this.expandAll = true
    } else {
      this.expandAll = false
    }
    let personTree: any = this.$refs.personTree
    for (let i = 0; i < personTree.store.root.childNodes.length; i++) {
      personTree.store.root.childNodes[i].expanded = this.expandAll
    }
  }
  // 获取人员配置树
  getPersonTree(roleId: number) {
    this.personChecked = []
    if (this.activeRoleType === 1) {
      getRoleUsers(this.keytypecode, roleId).then((res: any) => {
        this.personChecked = res.data
        ;(this.$refs.personTree as any).setCheckedKeys(this.personChecked)
      })
    } else if (this.activeRoleType === 2) {
      getBoxRoleUsers(this.keytypecode, roleId).then((res: any) => {
        this.personChecked = res.data
        ;(this.$refs.personTree as any).setCheckedKeys(this.personChecked)
      })
    }
  }
  // 获取当前选中人员 修改选中状态
  getClicked(val: any, arr: any) {
    let regexp = /_/
    for (let index = arr.checkedKeys.length - 1; index >= 0; index--) {
      if (regexp.test(arr.checkedKeys[index])) {
        arr.checkedKeys.splice(index, 1)
      }
    }
    this.personCheckedData = {
      keyTypeCode: this.keytypecode,
      roleId: this.activeRoleid!,
      userIds: arr.checkedKeys
    }
  }
  // 保存修改人员配置
  personSave() {
    if (this.personCheckedData.userIds.length !== 0) {
      this.loading.start()
      let result: any
      if (this.activeRoleType === 1) {
        result = setRoleUsers(this.personCheckedData)
      } else if (this.activeRoleType === 2) {
        result = setBoxRoleUsers(this.personCheckedData)
      }
      result
        .then((res: any) => {
          this.$message.success('保存成功')
        })
        .finally(() => {
          this.loading.close()
        })
    } else {
      this.$message.warning('请先选择')
    }
  }
  // 获取与业务相关的材料
  getMaterial(roleId: number) {
    this.roleMaterialTabledata = []
    getRoleMaterial(this.keytypecode, roleId).then((res: any) => {
      this.roleMaterialTabledata = res.data
      this.roleMaterialTabledata.forEach((item: any) => {
        item.roleId = roleId
      })
      this.materialChecked.roleId = roleId
    })
  }
  // 获取选中材料行
  changeMaterial(val: any) {
    val.uploadable ? (val.uploadable = false) : (val.uploadable = true)
    this.materialChecked.materials = this.roleMaterialTabledata.filter(
      (item: any) => {
        return item.uploadable === true
      }
    )
  }
  // 材料更改保存
  saveMaterial() {
    this.loading.start()
    setRoleMaterial(this.materialChecked)
      .then(res => {
        this.$message.success('保存成功')
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 箱子配置 - 添加角色与箱子关联信息
  boxChange(data: any) {
    this.loading.start()
    let dt = {
      ...data,
      ...this.nodeItemObj
    }
    if (data.checked) {
      this.addRoleBox(dt)
    } else {
      this.deleteRoleBox(
        this.nodeItemObj.keyTypeCode,
        this.nodeItemObj.roleId,
        data.boxId
      )
    }
  }
  // deleteRoleBox
  deleteRoleBox(keyTypeCode: number, roleId: number, boxId: number) {
    deleteRoleBox(keyTypeCode, roleId, boxId)
      .then((res: any) => {
        this.boxCheckedList(
          this.nodeItemObj.keyTypeCode,
          this.nodeItemObj.roleId
        )
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // addRoleBox
  addRoleBox(dt: any) {
    addRoleBox(dt)
      .then((res: any) => {
        this.boxCheckedList(
          this.nodeItemObj.keyTypeCode,
          this.nodeItemObj.roleId
        )
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 箱子配置 - 获取业务角色与箱子关联信息列表
  boxCheckedList(keyTypeCode: number, roleId: number) {
    this.loading.start()
    getRoleBox(keyTypeCode, roleId)
      .then((res: any) => {
        // this.getRolePowerList(this.activeRoleid)
        this.boxCheckedArr = res.data
        this.configureTabledata = this.configureTabledata.map((q: any) => {
          if (this.boxCheckedArr.includes(q.boxId.toString())) {
            q.checked = true
          } else {
            q.checked = false
          }
          return q
        })
      })
      .finally(() => {
        this.loading.close()
      })
  }
  setMinWidth(val: any) {
    if (this.minWidth !== val.srcElement.clientWidth) {
      this.minWidth = val.srcElement.clientWidth
      let dom: any = document.getElementsByClassName('el-select-dropdown__item')
      for (let index = 0; index < dom.length; index++) {
        const element = dom[index]
        element.style.width = val.srcElement.clientWidth + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.role {
  height: 100%;
  .role-content {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .role-left {
      width: 260px;
      min-width: 260px;
      height: 100%;
      .role-table {
        height: calc(100% - 105px);
        overflow: auto;
      }
    }
    .role-right {
      width: 100%;
      padding-left: 10px;
      height: 100%;
      .table-content {
        height: 100%;
        padding-bottom: 40px;
        .person-tree {
          height: 100%;
          overflow-y: auto;
          padding-bottom: 80px;
        }
      }
    }
  }
}
.both-flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  .title {
    display: inline-block;
    width: 95px !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.point:hover {
  cursor: pointer;
}
.el-table::before {
  z-index: inherit;
  height: 0;
}
.line-limit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flex-end {
  width: 100%;
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
}
.select-version {
  width: 100%;
}
.cus-select-tree {
  height: auto;
  padding: 0 !important;
  background: #fff !important;
  font-weight: inherit !important;
}
</style>
<style lang="scss" scoped>
$icl-folder: '../../assets/image/tree/icl-folder@2x.png';
$icf-folder-open: '../../assets/image/tree/icf-folder-open@2x.png';
$icf-file-text: '../../assets/image/tree/icf-file-text@2x.png';
$icf-folder: '../../assets/image/tree/icf-folder@2x.png';
@mixin tree-icon {
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  font-size: 16px;
  background-size: 16px;
  background-size: 100%;
  background-position-y: top;
  background-repeat: no-repeat;
  margin-right: 5px;
}
.role-table {
  ::v-deep .el-tree-node__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ::v-deep .el-tree .mark sup {
    top: -0.1em;
  }
  ::v-deep .el-tree .el-tree-node__expand-icon.expanded {
    transform: rotate(0deg);
  }
  ::v-deep .el-tree .el-icon-caret-right:before {
    background: url($icl-folder) no-repeat 0 3px;
    @include tree-icon;
  }
  ::v-deep
    .el-tree
    .el-tree-node__children
    .el-tree-node__expand-icon.el-icon-caret-right:before {
    background: url($icf-file-text) no-repeat 0 3px;
    @include tree-icon;
  }
  ::v-deep .el-tree .el-tree-node__expand-icon.el-icon-caret-right:before {
    background: url($icl-folder) no-repeat 0 3px;
    @include tree-icon;
  }
  ::v-deep
    .el-tree
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    background: url($icf-folder-open) no-repeat 0 3px;
    @include tree-icon;
  }
  ::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 0;
  }
}
</style>
