<!--业务基本信息  -->
<template>
  <div v-if="groupOrop==='moveOp'" class="wrapper">
    <el-form :model="form" label-width="80px" label-position="left">
      <div class="flex-b">
        <el-form-item label="业务编号">
          <el-input v-model="form.keyTypeCode" disabled />
        </el-form-item>
        <div style="width:2%" />
        <el-form-item label="业务名称">
          <el-input v-model="form.opTypeName" />
        </el-form-item>
      </div>
      <div class="flex-b">
        <el-form-item label="英文简码">
          <el-input v-model="form.opTypeEnName" />
        </el-form-item>
        <div style="width:2%" />
        <el-form-item label="业务分组">
          <el-select
            ref="selectGroup"
            v-model="group.text"
            class="select-version"
            placeholder="请选择"
            @focus="setMinWidth"
          >
            <el-option class="cus-select-tree" value>
              <el-tree
                ref="groupTree"
                :data="treeDatagroup"
                node-key="value"
                highlight-current
                :indent="5"
                default-expand-all
                @node-click="clickGroup"
              />
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="flex-b">
        <el-form-item label="编码格式">
          <el-input v-model="form.opTypeFormat" placeholder="请输入内容" />
        </el-form-item>
        <div style="width:2%" />
        <el-form-item label="许可证号">
          <el-select v-model="form.licenseVOs" multiple placeholder="请选择" @focus="setMinWidth">
            <el-option
              v-for="item in licenseData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex-b">
        <el-form-item label="项目号">
          <el-select v-model="form.projectTypeVO" placeholder="请选择" @focus="setMinWidth">
            <el-option
              v-for="item in projectData"
              :key="item.prjTypeDefineId"
              :label="item.prjTypeName"
              :value="item.prjTypeDefineId"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex-b">
        <el-form-item label="相关业务">
          <el-select
            ref="selectOp"
            v-model="form.relationVOs"
            multiple
            class="select-version"
            placeholder="请选择"
            @focus="setMinWidth"
          >
            <el-option class="cus-select-tree" value>
              <el-tree
                ref="opTree"
                :data="treeDataOp"
                node-key="id"
                show-checkbox
                :indent="5"
                highlight-current
                default-expand-all
                @check-change="clickOp"
              />
            </el-option>
          </el-select>
        </el-form-item>
        <div class="el-ml-3 el-mt-2">
          <el-switch v-model="form.canMultiRelation" />
          <span class="el-ml-2"> 允许多次启动</span>
        </div>
      </div>
      <div class="box-card">
        <div class="el-mb-4">
          <span class="el-mr-8">采用办理时间承若制</span>
          <el-switch v-model="form.ifAdoptPromises" />
        </div>
        <div class="card-flex">
          <div>
            <span>总时间预警黄灯</span>
            <el-input-number
              v-model="form.opTotalTimeYellow"
              controls-position="right"
              :precision="2"
              :min="1"
              :max="99"
              :disabled="!form.ifAdoptPromises"
            />
          </div>
          <div>
            <span>阶段预警黄灯</span>
            <el-input-number
              v-model="form.flowPhTimeYellow"
              controls-position="right"
              :precision="2"
              :min="1"
              :max="99"
              :disabled="!form.ifAdoptPromises"
            />
          </div>
          <br>
          <div class="el-mt-4">
            <span>总办理时间</span>
            <el-input-number
              v-model="form.opTotalTime"
              controls-position="right"
              :precision="2"
              :min="1"
              :max="99"
              :disabled="!form.ifAdoptPromises"
            />
          </div>
        </div>
      </div>
      <div class="project-class">
        <span class="el-mr-8">允许非项目号接件</span>
        <el-switch v-model="form.asNonPrjOp" />
      </div>
      <div class="flex-right el-mt-6">
        <el-button type="primary" icon="el-icon-document" @click="saveData">保存</el-button>
      </div>
    </el-form>
  </div>
  <div v-else-if="groupOrop==='moveGroup'" class="wrapper">
    <el-form :model="form" status-icon label-width="80px" :inline="true">
      <el-form-item label="分组编号" prop="opTypeGroupId">
        <el-input v-model="form.opTypeGroupId" disabled />
      </el-form-item>
      <el-form-item label="分组名称" prop="opTypeName">
        <el-input v-model="form.opTypeName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-document" @click="saveData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-else>
    <div>暂无数据</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from 'vue-property-decorator'
import { ModuleState } from '@/store/modules/module'
import {
  getOpdetail,
  getGroupTree,
  updateOpmain,
  modifyGroupMain
} from '@/api/tree-data/treeAndRole'
import {
  getGroupdetail,
  getProject,
  getLicense
} from '@/api/tree-data/input-form'
// 定义一个接口form
interface formData {
  opTypeGroupId?: number | null // 接收分组时的id
  asNonPrjOp?: boolean | null // 允许非项目号接件
  canMultiRelation?: boolean | null // 允许多次启动
  flowPhTimeYellow?: number | null // 阶段预警黄灯
  ifAdoptPromises?: boolean | null // 采取办理时间承若制
  keyTypeCode?: number | null // 业务编号
  licenseVOs?: any[] | null // 许可证号     [i]={text: string,value: string}
  opGroupVO?: {
    text: string // 业务分组编号
    value: string | [] // 业务分组名称
  } | null
  opTotalTime?: number | null // 总办理时间
  opTotalTimeYellow?: number | null // 总时间预警黄灯
  opTypeEnName?: string | null // 英文简码
  opTypeFormat?: string | null // 编号格式
  opTypeName?: string | null // 业务名称 or分组名称
  projectTypeVO?: any
  relationVOs?: any[] // 相关业务   [i]={text: string,value: string}
}
interface obj {
  value: string
  label: string
  children?: [obj] | undefined
}
@Component({
  name: 'Va-BasicInfo'
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private form: formData = {
    keyTypeCode: null,
    opTypeGroupId: null,
    opTypeName: '',
    opTypeEnName: '',
    opGroupVO: {
      value: '',
      text: ''
    },
    opTypeFormat: '',
    licenseVOs: null,
    projectTypeVO: null,
    relationVOs: [],
    canMultiRelation: null,
    ifAdoptPromises: null,
    opTotalTimeYellow: null,
    flowPhTimeYellow: null,
    opTotalTime: null,
    asNonPrjOp: false
  }
  private treeDataOp: any = [] // 存储tree数据
  private projectData: any = [] // 存储项目号
  private licenseData: any = [] // 存储许可证号
  private opCheckedData: any = [] // 存储选中的相关业务
  private group: any = {} // 加载
  private error: null | undefined // 为空判断
  private minWidth: number = 0
  // 储存业务id
  private get opId() {
    return ModuleState.opId
  }
  // 业务组名判断操作的是分组还是业务
  private get groupOrop() {
    return ModuleState.moveIdName
  }
  // 存储tree分组数据
  private get treeDatagroup() {
    const data = ModuleState.groupList
    return this.turnData(data)
  }

  created() {
    this.getProjectgroup()
    this.getLicensegroup()
    this.gettree()
    if (this.opId) {
      this.getDetail(this.opId)
    }
  }
  // 获取业务详情
  @Watch('opId')
  getDetail(val: any) {
    this.loading.start()
    let result: any
    if (val !== null && val !== undefined) {
      if (this.groupOrop === 'moveGroup') {
        result = getGroupdetail(val)
      } else if (this.groupOrop === 'moveOp') {
        result = getOpdetail(val)
      }
      result
        .then((res: any) => {
          if (this.groupOrop === 'moveOp') {
            const arr: [any?] = []
            // 许可证号
            if (
              res.data.licenseVOs !== null &&
              res.data.licenseVOs !== undefined
            ) {
              res.data.licenseVOs.forEach((item: any) => {
                if (item.value !== undefined && item.value !== null) {
                  arr.push(parseInt(item.value))
                }
              })
              res.data.licenseVOs = arr
            } else {
              res.data.licenseVOs = null
            }
            // 项目号
            if (res.data.projectTypeVO) {
              res.data.projectTypeVO = parseInt(res.data.projectTypeVO.value)
            } else {
              res.data.projectTypeVO = null
            }
            // 相关业务 遍历tree获取
            if (
              res.data.relationVOs !== null &&
              res.data.relationVOs !== undefined
            ) {
              let opArr: [string?] = []
              res.data.relationVOs.map((item: any) => {
                (this.$refs.opTree as any).setChecked(item.value, true)
                opArr.push(item.text)
              })
              res.data.relationVOs = opArr
            }
            (this.$refs.groupTree as any).setCurrentKey(
              res.data.opGroupVO.value
            )
            this.group = res.data.opGroupVO
          }
          this.form = { ...res.data }
        })
        .finally(() => {
          this.loading.close()
        })
    }
  }
  // 获取项目号
  getProjectgroup() {
    getProject().then((res: any) => {
      this.projectData = res.data
    })
    // eslint-disable-next-line handle-callback-err
  }
  // 获取许可证号
  getLicensegroup() {
    getLicense().then((res: any) => {
      const arr: [any?] = []
      let obj: obj = { value: '', label: '' }
      res.data.forEach((item: any) => {
        obj = { value: '', label: '' }
        obj.value = item.licenseId
        obj.label = item.licenseName
        arr.push(obj)
      })
      this.licenseData = arr
    })
  }
  // 业务树数据去掉业务层
  turnData(val: any) {
    val.forEach((items: any) => {
      items.value = items.groupId
      if (items.children) {
        items.children.forEach((item: any) => {
          item.value = item.groupId
          delete item.children
        })
      }
    })
    return val
  }
  // 获取业务树
  gettree() {
    getGroupTree().then((res: any) => {
      this.treeDataOp = res.data
    })
  }
  // 保存数据
  saveData() {
    this.loading.start()
    // //相关业务
    // 分组id
    if (this.form.opGroupVO !== null && this.form.opGroupVO !== undefined) {
      if (typeof this.form.opGroupVO.value !== 'string') {
        if (this.form.opGroupVO.value.length > 1) {
          this.form.opTypeGroupId = this.form.opGroupVO.value.splice(0, 1)[0]
        }
      } else {
        this.form.opTypeGroupId = parseInt(this.form.opGroupVO.value)
      }
    }
    // 许可证号降维
    if (this.form.licenseVOs) {
      this.form.licenseVOs = this.form.licenseVOs.flat()
    }
    let result: any
    if (this.groupOrop === 'moveGroup') {
      const data = {
        opTypeGroupId: this.form.opTypeGroupId,
        opTypeName: this.form.opTypeName
      }
      result = modifyGroupMain(data)
    } else if (this.groupOrop === 'moveOp') {
      this.form.canMultiRelation
        ? (this.form.canMultiRelation = true)
        : (this.form.canMultiRelation = false)
      const data = {
        asNonPrjOp: this.form.asNonPrjOp,
        canMultiRelation: this.form.canMultiRelation,
        flowPhTimeYellow: this.form.flowPhTimeYellow,
        ifAdoptPromises: this.form.ifAdoptPromises,
        keyTypeCode: this.form.keyTypeCode,
        licenseIds: this.form.licenseVOs,
        opTotalTime: this.form.opTotalTime,
        opTotalTimeYellow: this.form.opTotalTimeYellow,
        opTypeEnName: this.form.opTypeEnName,
        opTypeFormat: this.form.opTypeFormat,
        opTypeGroupId: this.form.opTypeGroupId,
        opTypeName: this.form.opTypeName,
        projectTypeId: this.form.projectTypeVO,
        relationKeyTypeCodes: this.opCheckedData
      }
      result = updateOpmain(data)
    }
    result
      .then((res: any) => {
        this.$message.success('保存成功')
        this.getDetail(this.opId)
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 判断一个数组几维
  dimensionArray(arr: any): any {
    if (arr instanceof Array) {
      return Math.max(
        ...arr.map(e => {
          return 1 + parseInt(this.dimensionArray(e))
        })
      )
    } else {
      return 0
    }
  }
  // 业务分组点击选择
  clickGroup(val: any) {
    if (val.label) {
      (this.$refs.selectGroup as any).visible = false
      this.group.text = val.label
    }
  }
  // 相关业务点击选择
  clickOp(val: any) {
    let res = (this.$refs.opTree as any).getCheckedNodes(true, true)
    let arrLabel: any = []
    let arr: any = []
    res.forEach((item: any) => {
      arrLabel.push(item.label)
      arr.push(Number(item.id))
    })
    this.form.relationVOs = arrLabel
    this.opCheckedData = arr
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
.wrapper {
  height: 100%;
  padding: 32px;
  overflow-y: auto;
}
.flex-right {
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.box-card {
  border-style: solid;
  border-width: 0px;
  border-color: #dfe6ec;
  border-top-width: 1px;
  border-bottom-width: 1px;
  padding: 32px 48px;
  .card-flex {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    div {
      width: 50%;
      .el-input-number--small{
        width: 130px;
      }
      span {
        display: inline-block;
        width: 120px;
        text-align: left;
        padding-right: 10px;
      }
    }
  }
}
.flex-b {
  width: 100%;
  display: flex;
  padding: 0 48px;
  .el-form-item {
    width:49%;
    .el-select {
      width: 100%;
    }
  }
}
.project-class {
  padding: 32px 48px;
  border-bottom: 1px solid #dfe6ec;
}
.select-version {
  width: 100%;
}
.cus-select-tree {
  width: 100%;
  height: auto;
  padding: 0 !important;
  background: #fff !important;
  font-weight: inherit !important;
}
::v-deep .el-select-dropdown {
  max-width: 40%;
}
::v-deep .el-select-dropdown__item {
  overflow: visible;
}
::v-deep .el-tree-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// ::v-deep .el-select__tags-text{
//   display: inline-block;
//   width: 40px;
//   overflow: hidden;
//   text-overflow:ellipsis;
//   white-space: nowrap;
//   &:hover{
//     width: auto;
//   }
// }
</style>
