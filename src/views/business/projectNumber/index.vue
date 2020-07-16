<template>
  <div class="project-number content-box__gap el-flex el-flex-column">
    <!-- 保存编辑按钮组 -->
    <div class="title-row el-pa-3">
      <h1 class="large"><svg-icon icon-class="icl-stored" /> 项目号信息</h1>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="addProject">新增</el-button>
      </div>
    </div>
    <div class="el-flex-grow overflow-hidden">
      <div class="fill-height">
        <el-table :data="dataList" style="width: 100%" height="100%" highlight-current-row>
          <el-table-column type="index" align="center" label="序号" sortable />
          <el-table-column prop="prjTypeName" label="项目号名称" />
          <el-table-column prop="prjTypeFormat" label="项目号格式" />
          <el-table-column prop="address" label="操作" width="230px">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                class="btn-no-padding"
                type="text"
                @click="handleUpdate(scope.row)"
              >设置项目号格式</el-button>
              <el-button
                icon="el-icon-delete"
                type="text"
                class="btn-delete btn-no-padding"
                @click="handleDel(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

    <!-- dialog-业务编号格式设置 -->
    <format
      ref="format"
      style="height:0;padding:0"
      :project="project"
      :format-items-val="project.prjTypeFormat"
      :format-items-name="project.prjTypeName"
      :prj-type-define-id="project.prjTypeDefineId"
      @upList="upListFun"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator'
import { getProjectTypeIds, addProject, editProject, deleteProject } from '@/api/business/projectNumber'
import { ModuleState } from '@/store/modules/module'
import format from './format.vue'

interface interfaceProject {
  prjTypeDefineId: string
  prjTypeName: string
  prjTypeFormat: string
}

@Component({
  name: 'projectNumber',
  components: {
    format
  }
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private project: interfaceProject = {
    prjTypeDefineId: '',
    prjTypeName: '',
    prjTypeFormat: ''
  }
  private projectDetail: object = {}
  private dataListIndex: string = '0'
  private dataList: any = []

  // 列表初始化
  initData() {
    this.loading.start()
    getProjectTypeIds()
      .then((res: any) => {
        this.dataList = res.data
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 新增项目
  addProject() {
    this.loading.start()
    const data = {
      canFromCancel: true,
      prjTypeFormat: '\\9999\\#0000#',
      prjTypeName: '新建项目号'
    }
    editProject(data)
      .then((res: any) => {
        this.$message.success('新增成功')
        this.initData()
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 删除项目
  handleDel(row: any) {
    this.$confirm('确定要删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading.start()
        deleteProject(row.prjTypeDefineId)
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
          width: calc(100% - 34px);
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
      min-width: 600px !important;
    }
    .set {
      margin: 10px 0 0 0;
      .set-list {
        height: 237px;
        overflow-y: auto;
      }
      .set-button {
        display: flex;
        flex-direction: column;
        ::v-deep .el-button {
          margin: 0 0 3px 0;
        }
      }
      .mt-group {
        margin: 17px 0 -10px 0;
      }
    }
    .edit {
      height: 403px;
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
      padding: 0 !important;
      text-overflow: ellipsis;
      overflow: hidden;
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
