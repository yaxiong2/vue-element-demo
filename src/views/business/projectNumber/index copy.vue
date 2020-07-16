<template>
  <div class="project-number app-container">
    <!-- 保存编辑按钮组 -->
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addProject">新增</el-button>
      <!-- <el-button type="primary"  icon="el-icon-delete" @click="deleteProject">删除</el-button> -->
      <el-button type="primary" icon="el-icon-document" @click="editProject">保存</el-button>
    </div>
    <!-- 项目号类型&基本信息 -->
    <div class="businessWrap">
      <div class="leftTree">
        <p class="title">项目号类型列表</p>
        <el-divider class="line" />
        <el-menu :default-active="dataListIndex" class="el-menu-vertical-demo">
          <span v-for="(item, index) in dataList" :key="index">
            <el-menu-item :index="index + ''" @click="projectItemFun(item.prjTypeDefineId)">
              <i class="el-icon-document-copy" />
              <span slot="title" class="title-wid">
                <span class="span">
                  {{ item.prjTypeName }}
                </span>
                <span class="delete btn-delete" @click="deleteProject">
                  <i class="el-icon-delete btn-delete" />
                  <span>删除</span>
                </span>
              </span>
            </el-menu-item>
          </span>
        </el-menu>
      </div>
      <div class="rightContent">
        <div class="groupInfo">
          <p class="title">项目号基本信息</p>
          <el-divider class="line" />
          <div class="project-detail">
            <el-divider class="vertical" direction="vertical" />
            <div class="project">
              <el-form ref="project" :model="project" label-width="80px">
                <el-form-item class="item" label="编号">
                  <el-input v-model="project.prjTypeDefineId" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item class="item" label="名称">
                  <el-input v-model="project.prjTypeName" placeholder="请输入" />
                </el-form-item>
                <el-form-item class="item" label="格式">
                  <el-input v-model="project.prjTypeFormat" disabled placeholder="请输入">
                    <el-button slot="append" @click="setFun()">设置</el-button>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog-业务编号格式设置 -->
    <format
      ref="format"
      :project="project"
      :format-items-val="project.prjTypeFormat"
      :prj-type-define-id="project.prjTypeDefineId"
      @setFormat="setFormat"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator'
import { getProjectTypeIds, getDetail, addProject, editProject, deleteProject } from '@/api/business/projectNumber'
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
  initData(type: number) {
    this.loading.start()
    getProjectTypeIds()
      .then((res: any) => {
        this.dataList = res.data
        if (!type) this.getDetail(res.data[0].prjTypeDefineId)
        // if (type === 2) this.getDetail((Number(this.project.prjTypeDefineId) - 1).toString())
        if (type === 2) this.getDetail(this.dataList[Number(this.dataListIndex)].prjTypeDefineId.toString())
        if (type === 3) this.getDetail(res.data[res.data.length - 1].prjTypeDefineId)
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 项目列表切换
  projectItemFun(item: any) {
    // this.formatValList = [
    //   {
    //     index: 3,
    //     value: 'A',
    //     text: 'A'
    //   }
    // ]
    // this.setListIndexNew = 0
    this.getDetail(item)
  }
  // 项目详情
  getDetail(item: any) {
    getDetail(item).then((res: any) => {
      this.project = res.data
      // this.formatItemsVal = res.data.prjTypeFormat
      // this.prjTypeDefineId = res.data.prjTypeDefineId
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
        this.initData(3)
        this.dataListIndex = this.dataList.length.toString()
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 编辑项目
  editProject() {
    this.loading.start()
    const data = {
      canFromCancel: true,
      prjTypeDefineId: this.project.prjTypeDefineId,
      prjTypeFormat: this.project.prjTypeFormat,
      prjTypeName: this.project.prjTypeName
    }
    editProject(data)
      .then((res: any) => {
        this.$message.success('保存成功')
        this.initData(1)
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 删除项目
  deleteProject() {
    this.$confirm('确定要删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading.start()
        deleteProject(this.project.prjTypeDefineId)
          .then((res: any) => {
            this.$message.success('删除成功')
            this.dataListIndex = (Number(this.dataListIndex) - 1).toString()
            this.initData(2)
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
    this.initData(0)
  }
  setFun() {
    (this.$refs.format as any).openDialog()
  }
  setFormat(value: string) {
    this.project.prjTypeFormat = value
  }
}
</script>

<style lang="scss" scoped>
.project-number {
  height: 100%;
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
