<template>
  <div style="height:100%;overflow: auto" class="el-flex el-flex-column">
    <el-form :inline="true" class="el-pa-4">
      <el-form-item label="菜单名称">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.visible" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="dict in visibleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="form-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button v-hasPermi="['system:menu:add']" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="content-box__gap el-flex-grow overflow-hidden">
      <div class="fill-height">
        <el-table
          height="100%"
          :data="menuList"
          row-key="menuId"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="130px" />
          <el-table-column prop="icon" label="图标" align="center" width="100px">
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="排序" width="60px" />
          <el-table-column prop="perms" label="权限标识" width="130px" :show-overflow-tooltip="true" />
          <el-table-column prop="component" label="组件路径" width="180px" :show-overflow-tooltip="true" />
          <el-table-column prop="visible" label="可见" :formatter="visibleFormat" width="80px" />
          <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['system:menu:edit']"

                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-hasPermi="['system:menu:add']"

                type="text"
                icon="el-icon-plus"
                @click="handleAdd(scope.row)"
              >新增</el-button>
              <el-button
                v-if="scope.row.parentId != 0"
                v-hasPermi="['system:menu:remove']"
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

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col v-if="form.parentId !== 0" :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :load-options="loadOptions"
                :options="menuOptions"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'" label="权限标识">
              <el-input v-model="form.perms" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in visibleOptions"
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

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator'
import { listMenu, getMenu, treeselect, delMenu, addMenu, updateMenu } from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect/index.vue'

interface MenuData {
  children:Array<MenuData>
  component:any
  createBy: any
  createTime: string
  dataScope: any
  icon: string
  isFrame: string
  menuId: Number
  menuName: string
  menuType:string
  orderNum: string
  parentId: Number
  parentName: null
  path: string
  perms: string
  remark: any
  searchValue: any
  updateBy: any
  updateTime: any
  visible: string
}

interface VisibleOptionsData {
  createBy: string
  createTime: string
  cssClass: string
  dataScope: any
  default: true
  dictCode: Number
  dictLabel: string
  dictSort: Number
  dictType: string
  dictValue: string
  isDefault: string
  listClass: string
  remark: string
  searchValue: any
  status: string
  updateBy: any
  updateTime: any
}

interface Form {
  menuId: any,
  parentId: Number,
  menuName: string,
  icon: string,
  menuType: string,
  orderNum: any,
  isFrame: string,
  visible: string
}

@Component({
  name: 'Menu',
  components: {
    Treeselect,
    IconSelect
  }
})

export default class extends Vue {
  // private loading:Boolean = true // 遮罩层
  @Inject('loading') loading!:{close:()=>{}, start:()=>{}}
  private menuList:Array<MenuData> = [] // 菜单表格树数据
  private menuOptions:any[] = []// 菜单树选项
  private title:string = '' // 弹出层标题
  private open:Boolean = false // 是否显示弹出层
  private visibleOptions:Array<VisibleOptionsData> = [] // 菜单状态数据字典
  private queryParams:object = { // 查询参数
    menuName: undefined,
    visible: undefined
  }
  private form:Form = { // 表单参数
    menuId: undefined,
    parentId: 0,
    menuName: '',
    icon: '',
    menuType: 'M',
    orderNum: undefined,
    isFrame: '1',
    visible: '0'
  }
  private rules:object = { // 表单校验
      menuName: [
        { required: true, message: '菜单名称不能为空', trigger: 'blur' }
      ],
      orderNum: [
        { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
      ]
  }

  created() {
    this.getList()
    this.getDicts('sys_show_hide').then((response:any) => {
      this.visibleOptions = response.data
    })
  }
  // 选择图标
    selected(name:string) {
      this.form.icon = name
    }
    /** 查询菜单列表 */
    getList() {
      this.loading.start()
      listMenu(this.queryParams).then(response => {
        this.menuList = response.data
        this.loading.close()
      })
    }
    /** 查询菜单下拉树结构 */
    async loadOptions() {
        treeselect().then(response => {
            this.menuOptions = response.data
          })
    }
    // 菜单显示状态字典翻译
    visibleFormat(row:any, column:any) {
      if (row.menuType === 'F') {
        return ''
      }
      return this.selectDictLabel(this.visibleOptions, row.visible)
    }
    // 取消按钮
    cancel() {
      this.open = false
      // this.reset();
    }
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: '',
        icon: '',
        menuType: 'M',
        orderNum: undefined,
        isFrame: '1',
        visible: '0'
      }
    }
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    }
    /** 新增按钮操作 */
    handleAdd(row:any) {
      this.reset()
      // this.getTreeselect();
      this.loadOptions()
      if (row != null) {
        this.form.parentId = row.menuId
      }
      this.open = true
      this.title = '添加菜单'
    }
    /** 修改按钮操作 */
    handleUpdate(row:any) {
      this.reset()
      // this.getTreeselect();
      this.loadOptions()

      getMenu(row.menuId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改菜单'
      })
    }
    /** 提交按钮 */
    submitForm() {
      (this.$refs['form'] as any).validate((valid:any) => {
        if (valid) {
          if (this.form.menuId !== undefined) {
            updateMenu(this.form).then((response:any) => {
              if (response.status === 200) {
                this.$message.success('修改成功')
                this.open = false
                this.getList()
              } else {
                this.$message.error(response.msg)
              }
            })
          } else {
            addMenu(this.form).then((response:any) => {
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
    handleDelete(row:any) {
      this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delMenu(row.menuId)
        }).then(() => {
          this.getList()
          this.$message.success('删除成功')
        }).catch(function() {})
    }
}

</script>
