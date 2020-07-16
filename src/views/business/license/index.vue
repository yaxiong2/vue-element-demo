<template>
  <div class="project-number content-box__gap el-flex el-flex-column">
    <!-- 保存编辑按钮组 -->
    <div class="title-row el-pa-3">
      <h1 class="large"><svg-icon icon-class="icl-stored" /> 许可证信息</h1>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="addProject">新增</el-button>
      </div>
    </div>
    <el-table :data="dataList" style="width: 100% flex-grow:1" highlight-current-row>
      <el-table-column type="index" align="center" label="序号" sortable />
      <el-table-column prop="licenseName" label="许可证名称" />
      <el-table-column prop="licenseFormat" label="许可证格式" />
      <el-table-column prop="address" label="操作" width="230px">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            class="btn-no-padding"
            type="text"
            @click="handleUpdate(scope.row)"
          >设置许可证格式</el-button>
          <el-button
            icon="el-icon-delete"
            type="text"
            class="btn-delete btn-no-padding"
            @click="handleDel(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  -->
    <setFormat
      ref="format"
      :project="project"
      :license-format="project.licenseFormat"
      :license-name="project.licenseName"
      :license-id="project.licenseId"
      style="height:0;padding:0"
      @upList="upListFun"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator'
import setFormat from './setFormat.vue'
import {
  getProjectTypeIds,
  getDetail,
  addProject,
  editProject,
  deleteProject,
  indexList,
  editIndexVal
} from '@/api/business/license'
import { ModuleState } from '@/store/modules/module'
import { Loading } from '../../../extend'

interface interfaceProject {
  licenseId: number
  licenseName: string
  licenseFormat: string
}

@Component({
  name: 'license',
  components: {
    setFormat
  }
})
export default class extends Vue {
  @Inject('loading') loading!: Loading
  private project: interfaceProject = {
    licenseId: 0,
    licenseName: '',
    licenseFormat: ''
  }
  private projectDetail: object = {}
  private dataListIndex: string = '0'
  private dataList: object[] = []

  initData() {
    this.loading.start()
    getProjectTypeIds().then((res: any) => {
      this.dataList = res.data
      this.loading.close()
    }).catch(e => {
      this.loading.close()
    })
  }

  // 新增
  addProject() {
    this.loading.start()
    const data = {
      licenseFormat: '\\9999\\#0000#',
      licenseName: '新建许可证'
    }
    addProject(data)
      .then((res: any) => {
        this.$message.success('新增成功')
        this.initData()
      })
      .finally(() => {
        this.loading.close()
      })
  }

  created() {
    this.initData()
  }
  // el-table
  handleUpdate(row: any) {
    this.project = row
    ;(this.$refs.format as any).openDialog()
  }
  upListFun() {
    this.initData()
  }
  // 删除
  handleDel(row: any) {
    this.$confirm('确定要删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading.start()
        deleteProject(row.licenseId)
          .then((res: any) => {
            this.$message.success('删除成功')
            this.initData()
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
</script>

<style lang="scss" scoped>
.project-number {
  height: 100%;
  .title-row {
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    padding-top: 12px;
  }
  .businessWrap {
    height: 100%;
    display: flex;
    padding-top: 10px;
    * {
      margin: 0;
      padding: 0;
    }
    .leftTree {
      width: 260px;
      flex-shrink: 0;
      ::v-deep .el-menu-item {
        height: 27px;
        line-height: 27px;
        padding: 0 !important;
        display: flex;
        i {
          margin-top: 7px;
        }
        .title-wid {
          // width: calc(100% - 34px);
          display: flex;
          .span {
            width: 80%;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          i {
            margin-top: 0;
          }
        }
      }
      .title {
        margin: 12px 0 10px 0;
      }
      .el-menu-vertical-demo {
        height: calc(100% - 59px);
        padding: 10px 0;
        overflow: auto;
      }
    }
    .rightContent {
      flex-shrink: 1;
      flex-grow: 1;
      margin-left: 20px;
      .title {
        margin: 12px 0 10px 0;
      }
      .project-detail {
        height: 99%;
        display: flex;
        .vertical {
          height: 94%;
        }
        .project {
          margin: 20px 0 0 10px;
          width: 400px;
          .item {
            margin: 20px 0 0 0;
          }
        }
      }
      .groupInfo {
        height: 100%;
      }
    }
  }
  ::v-deep .el-card.is-always-shadow {
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  .code-dialog {
    ::v-deep .el-dialog {
      min-width: 720px !important;
    }
    .set {
      margin: 10px 0 0 0;
      .set-list {
        height: 193px;
        overflow-y: auto;
        ::v-deep .el-submenu__title {
          height: 22px;
          line-height: 22px;
          padding: 0 8px !important;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        // ::v-deep .el-submenu .el-menu {
        //   margin: 0px 0px 0px 8px;
        // }
        .svg-icon-style {
          width: 20px;
          margin-right: 6px;
        }
        .menu-index-item {
          margin-left: -14px;
        }
        .show-index-list {
          margin: 0 0 0 22px;
          .index-item {
            margin: 4px 0 0 16px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
      .set-button {
        display: flex;
        flex-direction: column;
        ::v-deep .el-button {
          margin: 0 0 7px 0;
        }
        .delete_bottom {
          margin: 0 !important;
        }
      }
      .mt-group {
        margin: 25px 0 -10px 0;
      }
      .move-btn {
        margin: 12px 5px 2px 5px;
      }
    }
    .edit {
      height: 407px;
      .content {
        .title {
          margin: 20px 0 0 10px;
        }
        .edit-radio {
          display: flex;
          flex-direction: column;
          margin: 0 0 10px 26px;
          ::v-deep .el-radio {
            margin: 20px 0 0 0;
          }
        }
      }
      .content-format {
        .title {
          margin: 20px 0 0 0;
        }
        .input-format {
          margin: 20px 0;
        }
      }
      .content-code {
        .title {
          margin: 20px 0 0 0;
        }
        .select-max {
          margin: 12px;
        }
        .title-radio {
          margin: 10px 0 0 0;
        }
        .code-radio {
          margin: 0 0 0 10px;
          display: flex;
          flex-direction: column;
          ::v-deep .el-radio {
            margin: 20px 0 0 0;
          }
        }
      }
    }
    ::v-deep .el-menu-item {
      height: 22px;
      line-height: 22px;
      padding: 0 8px !important;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .no-active ::v-deep .el-menu-item {
      color: #333 !important;
    }
    ::v-deep .el-card__body {
      padding: 10px;
    }
    ::v-deep .el-menu {
      border-right-width: 0;
    }
  }
}
</style>
