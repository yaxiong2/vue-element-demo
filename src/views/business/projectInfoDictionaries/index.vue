<!-- 项目信息管理 -->
<template>
  <div class="wrapper content-box__gap">
    <header style="position:relative">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="项目分区" name="zone" />
        <el-tab-pane label="项目类型" name="type" />
        <el-tab-pane label="建设单位机构类型" name="build" />
      </el-tabs>
      <el-button type="primary" icon="el-icon-plus" class="button-right" @click="openDialog('add')">新增</el-button>
    </header>

    <div class="table-content">
      <el-table
        v-show="activeName==='zone'"
        :data="zoneTableData"
        style="width:100%"
        height="calc(100% - 0px)"
        border
        highlight-current-row
      >
        <el-table-column label="显示序号" prop="districtId" width="120" sortable />
        <el-table-column label="分区名称" prop="districtName" sortable />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              class="btn-no-padding"
              @click="openDialog('updata',scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              class="btn-delete btn-no-padding"
              @click="deleteProjectInfo(scope.row.districtId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-show="activeName==='type'"
        :data="typeTableData"
        style="width:100%"
        height="calc(100% - 0px)"
        border
        highlight-current-row
      >
        <el-table-column label="项目类型" prop="prjKindName" sortable />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              class="btn-no-padding"
              @click="openDialog('updata',scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              class="btn-delete btn-no-padding"
              @click="deleteProjectInfo(scope.row.prjKindId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-show="activeName==='build'"
        :data="buildTableData"
        style="width:100%"
        height="calc(100% - 0px)"
        border
        highlight-current-row
      >
        <el-table-column label="机构类型名称" prop="companyTypeName" sortable />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              class="btn-no-padding"
              @click="openDialog('updata',scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              class="btn-delete btn-no-padding"
              @click="deleteProjectInfo(scope.row.companyTypeCode)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改添加弹窗 -->
    <el-dialog :title="dialogTitle+dialogMainTitle" :visible.sync="dialogProjectVisible">
      <el-form ref="form" :model="activeRow" label-width="68px" label-position="left">
        <el-form-item v-if="dialogTitle!=='添加'" label="编号">
          <el-input v-model="activeRow.code" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item v-show="activeName==='zone'" label="英文标识" prop="enName">
          <el-input v-model="activeRow.enName" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="名称"
          class="el-mb-0"
          prop="name"
          :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]"
        >
          <el-input v-model="activeRow.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogProjectVisible=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator'
import {
  getProjectList,
  addProject,
  deleteProject,
  updateProject,
  getSubjectList,
  addSubject,
  updateSubject,
  deleteSubject,
  getDistrictList,
  addDistrict,
  updateDistrict,
  deleteDistrict
} from '@/api/project-info/project'
@Component({
  name: 'projectInfoDictionaries'
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private activeName: string = 'zone'
  private zoneTableData: any = [] // 项目分区的表格数据
  private typeTableData: any = [] // 项目类型的表格数据
  private buildTableData: any = [] // 建设单位机构类型的表格数据
  private dialogProjectVisible: boolean = false
  private activeRow: any = {
    code: '',
    name: '',
    enName: ''
  } // 弹窗数据
  private dialogTitle: string = '' // 弹窗是添加还是修改
  private dialogMainTitle: string = '' // 弹窗是什么类型
  handleClick() {
    this.activeRow = {
      code: '',
      name: '',
      enName: ''
    }
  }
  // 打开弹窗
  openDialog(val: string, data?: any) {
    if (data) {
      switch (this.activeName) {
        case 'zone':
          this.activeRow = {
            code: data.districtId,
            name: data.districtName,
            enName: data.districtEnName
          }
          break
        case 'type':
          this.activeRow = {
            code: data.prjKindId,
            name: data.prjKindName
          }
          break
        case 'build':
          this.activeRow = {
            code: data.companyTypeCode,
            type: data.companyTypeGroupCode,
            name: data.companyTypeName
          }
          break
      }
    }
    switch (this.activeName) {
      case 'zone':
        this.dialogMainTitle = '项目分区'
        break
      case 'type':
        this.dialogMainTitle = '项目类型'
        break
      case 'build':
        this.dialogMainTitle = '单位机构类型'
        break
    }
    if (val === 'add') {
      this.dialogTitle = '添加'
      this.activeRow = {
        code: '',
        name: '',
        enName: ''
      }
      this.dialogProjectVisible = true
    } else {
      this.dialogTitle = '修改'
      if (this.activeRow.name === '') {
        this.$message.warning('请先点击要修改的行')
      } else {
        this.dialogProjectVisible = true
      }
    }
  }
  // 修改提交
  submit() {
    this.loading.start()
    switch (this.activeName) {
      // 操作项目分区
      case 'zone':
        if (this.dialogTitle === '添加') {
          let data = {
            districtName: this.activeRow.name,
            companyId: 0,
            districtEnName: this.activeRow.enName
          }
          addDistrict(data)
            .then((res: any) => {
              this.$message.success('添加成功')
              this.getDistrictTypeList()
            })
            .finally(() => {
              this.loading.close()
            })
        } else {
          let data = {
            districtId: this.activeRow.code,
            districtName: this.activeRow.name,
            companyId: 0,
            districtEnName: this.activeRow.enName
          }
          updateDistrict(data)
            .then((res: any) => {
              this.$message.success('修改成功')
              this.getDistrictTypeList()
            })
            .finally(() => {
              this.loading.close()
            })
        }
        break
      // 项目信息操作
      case 'type':
        if (this.dialogTitle === '添加') {
          let data = {
            prjKindId: this.activeRow.code,
            prjKindName: this.activeRow.name
          }
          addSubject(data)
            .then((res: any) => {
              this.$message.success('添加成功')
              this.getSubjectTypeList()
            })
            .finally(() => {
              this.loading.close()
            })
        } else {
          let data = {
            prjKindId: this.activeRow.code,
            prjKindName: this.activeRow.name
          }
          updateSubject(data)
            .then((res: any) => {
              this.$message.success('修改成功')
              this.getSubjectTypeList()
            })
            .finally(() => {
              this.loading.close()
            })
        }
        break
      // 单位机构操作
      case 'build':
        if (this.dialogTitle === '添加') {
          let data = {
            companyTypeCode: this.activeRow.code,
            companyTypeGroupCode: null,
            companyTypeName: this.activeRow.name
          }
          addProject(data)
            .then((res: any) => {
              this.$message.success('添加成功')
              this.getProjectTypeList()
            })
            .finally(() => {
              this.loading.close()
            })
        } else {
          let data = {
            companyTypeCode: this.activeRow.code,
            companyTypeGroupCode: this.activeRow.type,
            companyTypeName: this.activeRow.name
          }
          updateProject(data)
            .then((res: any) => {
              this.$message.success('修改成功')
              this.getProjectTypeList()
            })
            .finally(() => {
              this.loading.close()
            })
        }
        break
    }
    this.dialogProjectVisible = false
  }
  // 删除当前行
  deleteProjectInfo(code: number) {
    let result: any
    this.$confirm('确定要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading.start()
        switch (this.activeName) {
          case 'zone':
            result = deleteDistrict(code)
            break
          case 'type':
            result = deleteSubject(code)
            break
          case 'build':
            result = deleteProject(code)
            break
        }
        result
          .then((res: any) => {
            this.$message.success('删除成功!')
            switch (this.activeName) {
              case 'zone':
                this.getDistrictTypeList()
                break
              case 'type':
                this.getSubjectTypeList()
                break
              case 'build':
                this.getProjectTypeList()
                break
            }
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
  created() {
    this.getProjectTypeList()
    this.getSubjectTypeList()
    this.getDistrictTypeList()
  }
  // 获取单位机构类型的列表
  getProjectTypeList() {
    this.buildTableData = []
    getProjectList().then((res: any) => {
      this.buildTableData = res.data
    })
  }
  // 获取项目类型信息的列表
  getSubjectTypeList() {
    this.typeTableData = []
    getSubjectList().then((res: any) => {
      this.typeTableData = res.data
    })
  }
  // 获取项目分区的列表
  getDistrictTypeList() {
    this.zoneTableData = []
    getDistrictList().then((res: any) => {
      this.zoneTableData = res.data
    })
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  position: relative;
}
::v-deep .el-tabs__nav-wrap {
  padding: 0px 24px;
  padding-top: 14px;
}
.table-content {
  width: 100%;
  height: calc(100% - 70px);
  padding: 8px 24px 24px;
}
.button-right {
  position: absolute;
  right: 25px;
  top: 15px;
}
.el-table::before {
  z-index: inherit;
  height: 0;
}
::v-deep .el-table__header-wrapper {
  border-right: 1px solid #dfe6ec;
  height: 51px;
  thead > tr > th:nth-last-child(2) {
    border-right: 0px;
  }
}
::v-deep .el-table--group::after,
::v-deep .el-table--border::after {
  width: 0;
}
::v-deep .el-table--border th:first-child,
::v-deep .el-table--border td:first-child {
  border-left: 1px solid #dfe6ec;
}
::v-deep .el-table--group,
.el-table--border {
  border-left: 0;
}
</style>
