<template>
  <div class="other-opdata">
    <resizeContent left-width="38%" :left-min-width="300" :right-min-width="450">
      <template v-slot:left>
        <div class="op-data-content">
          <div class="table-list">
            <el-table
              ref="opTable"
              :data="oplist"
              border
              highlight-current-row
              style="width: 100%"
              height="100%"
              :row-class-name="rowClassName"
              @row-click="opRowClick"
            >
              <el-table-column prop="id" label="业务号" width="65" />
              <el-table-column prop="label" label="业务名称" />
              <el-table-column label="操作" width="100">
                <template slot="header">
                  <el-button
                    type="text"
                    class="no-padding"
                    icon="el-icon-plus"
                    @click="addBusiness"
                  >添加业务</el-button>
                </template>
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    icon="el-icon-delete"
                    class="btn-delete btn-no-padding"
                    @click="deletBusiness(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
      <template v-slot:right>
        <div class="op-data-content" style="padding-right:0">
          <div class="table-list">
            <el-table
              :data="opDatalist"
              border
              style="width: 100%"
              height="100%"
              :row-class-name="rowClassName"
            >
              <el-table-column prop="targetForm" label="目标表单">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.inTableNumTo"
                    placeholder="请选择目标表单"
                    @change="targetFormChange(scope.row)"
                  >
                    <el-option
                      v-for="formItem in targetFormLists"
                      :key="formItem.formId"
                      :label="formItem.description"
                      :value="formItem.formId"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="targetField" label="目标字段">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.inFieldNumTo" placeholder="请选择目标字段">
                    <el-option
                      v-for="fieldItem in targetFields[scope.row.index]"
                      :key="fieldItem.id"
                      :label="fieldItem.description"
                      :value="fieldItem.fldId"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="orignForm" label="源表单">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.inTableNumFrom"
                    placeholder="请选择源表单"
                    @change="originFormChange(scope.row)"
                  >
                    <el-option
                      v-for="formItem in originFormLists"
                      :key="formItem.formId"
                      :label="formItem.description"
                      :value="formItem.formId"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="orignField" label="源字段">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.inFieldNumFrom" placeholder="请选择源字段">
                    <el-option
                      v-for="fieldItem in originFields[scope.row.index]"
                      :key="fieldItem.id"
                      :label="fieldItem.description"
                      :value="fieldItem.fldId"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="130">
                <template slot="header">
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    class="no-padding"
                    @click="addOtherOpData"
                  >添加</el-button>
                  <el-button
                    type="text"
                    icon="el-icon-document"
                    class="no-padding"
                    @click="saveOpDataList"
                  >保存</el-button>
                </template>
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    icon="el-icon-delete"
                    class="btn-delete btn-no-padding"
                    @click="removeDataList(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </resizeContent>
    <!-- 添加业务弹窗 -->
    <el-dialog title="选择业务" :visible.sync="addBusinessVisible">
      <div class="business-tree el-flex el-flex-column">
        <div class="tree-search el-mb-4" style="flex-shark:0">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        </div>
        <div class="tree-content" style="flex-grow:1">
          <el-tree
            ref="opTree"
            node-key="id"
            highlight-current
            draggable
            :data="businessTreeData"
            :filter-node-method="filterNode"
            @node-click="nodeClick"
          >
            <div slot-scope="{ node }" class="custom-tree-node flex-row">
              <span v-if="node.label.length<30">
                {{ node.label }}
                <el-badge
                  v-if="node.childNodes.length"
                  class="mark"
                  :value="node.childNodes.length"
                  type="primary"
                />
              </span>
              <el-tooltip v-else :content="node.label" placement="right">
                <span class="line-limit">{{ node.label }}</span>
              </el-tooltip>
            </div>
          </el-tree>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch, Ref, Inject } from 'vue-property-decorator'
import resizeContent from '@/components/ResizeContent/index.vue'
import { elDraggableDialog } from '../../directives/el-draggable-dialog/index'
import { getGroupTree } from '@/api/tree-data/treeAndRole'
import { getForm } from '@/api/va-Inputform'
import { getFormFields } from '@/api/input-form/field'
import {
  removeBusiness,
  getBusinessList,
  getDataList,
  saveFormData
} from '@/api/otherop-data'
import { ModuleState } from '@/store/modules/module'
import { Tree, Table } from 'element-ui'
import { colorfulIcons } from '../../views/icons/svg-icons'

interface IDataList {
  keyTypeCodeTo: number
  keyTypeCodeFrom: number
  inFieldNumFrom: string
  inFieldNumTo: string
  inTableNumFrom: number
  inTableNumTo: number
  index?: number
  subTabNameFrom?: any
  subTabNameTo?: any
}
@Component({
  name: 'OtherOPData',
  components: {
    resizeContent
  }
})
export default class OtherOPData extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private addBusinessVisible: boolean = false
  private filterText: string = ''
  private businessTreeData: any[] = []
  private oplist: any[] = [] // 业务列表
  private opDatalist: any[] = [] // 其他表格数据
  private targetFormLists: any[] = [] // 目标表单数据
  private targetFields: any[] = [] // 目标字段数据
  private originFormLists: any[] = [] // 源表单数据
  private originFields: any[] = [] // 源字段数据
  private selectedOpId: any = ''

  @Ref('opTree') opTree!: Tree
  @Ref('opTable') opTable!: Table
  @Watch('filterText')
  filterData(val: string) {
    this.opTree.filter(val)
  }
  @Watch('keyTypeCode')
  targetChange(val: number) {
    this.getTargetForm()
    this.getOpList()
  }
  @Watch('selectedOpId')
  businessChanged(val: string) {
    this.getOriginForm().then(() => {
      this.getopDataList()
    })
  }

  mounted() {
    this.getTargetForm()
    this.getOpList()
  }
  // 基础业务组id
  private get keyTypeCode() {
    return ModuleState.opId
  }
  // 添加业务
  async addBusiness() {
    this.loading.start()
    if (!this.businessTreeData.length) {
      try {
        let res = await getGroupTree()
        this.businessTreeData = res.data
      } catch {}
    }
    this.loading.close()
    this.addBusinessVisible = true
  }
  // 树节点点击
  nodeClick(data: any, node: any, treenode: any) {
    let type = data.type
    if (type === 'Op') {
      let hasCurrentData = false
      hasCurrentData = this.oplist.some((item: any) => {
        return String(item.id) === String(data.id)
      })
      if (!hasCurrentData) {
        this.oplist.push(data)
        this.selectedOpId = data.id
        this.opTable.setCurrentRow(data)
        this.addBusinessVisible = false
      } else {
        this.$message.warning('该业务已经选择了')
      }
    }
  }
  // 筛选树
  filterNode(value: string, data: any) {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }
  // 根据keyTypeCode获取目标表单
  getTargetForm() {
    this.loading.start()
    getForm(this.keyTypeCode)
      .then((res: any) => {
        this.targetFormLists = [...res.data]
        this.loading.close()
      })
      .catch(() => {
        this.loading.close()
      })
  }
  // 获取源表单数据
  getOriginForm() {
    this.loading.start()
    this.originFormLists = []
    return getForm(Number(this.selectedOpId))
      .then((res: any) => {
        this.originFormLists = [...res.data]
        this.loading.close()
      })
      .catch(() => {
        this.loading.close()
      })
  }
  // 根据keyTypeCode获取业务列表
  getOpList() {
    this.loading.start()
    getBusinessList({ keyTypeCodeTo: this.keyTypeCode })
      .then((res: any) => {
        this.oplist = res.data.map((item: any) => {
          return { id: item.keyTypeCode, label: item.opTypeName }
        })
        // 默认第一行选中
        this.selectedOpId = this.oplist[0].id
        this.opTable.setCurrentRow(this.oplist[0])
        this.loading.close()
      })
      .catch(() => {
        this.loading.close()
      })
  }
  // 根据keyTypeCodeFrom 获取数据列表
  async getopDataList() {
    this.loading.start()
    this.opDatalist = []
    try {
      let res = await getDataList({
        keyTypeCodeFrom: Number(this.selectedOpId),
        keyTypeCodeTo: this.keyTypeCode
      })
      if (res.data.length) {
        // 遍历目标表单和原始表单,请求每一行的字段数据
        await Promise.all(
          res.data.map(async(singleData: IDataList, index: number) => {
            let targetFld = await getFormFields(singleData.inTableNumTo)
            let originFld = await getFormFields(singleData.inTableNumFrom)
            this.targetFields.splice(index, 1, [...targetFld.data])
            this.originFields.splice(index, 1, [...originFld.data])
          })
        )
          .then(() => {
            this.loading.close()
          })
          .catch(() => {
            this.loading.close()
          })
        this.opDatalist = [...res.data]
      }
    } catch {
      this.loading.close()
    }
    this.loading.close()
  }
  // 删除业务
  deletBusiness(row: any) {
    this.$confirm('确定要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        let keyTypeCodeFrom = row.id
        let preSelected = this.selectedOpId
        this.loading.start()
        // 计算删除后该选中的某行索引
        let selectedIndex =
          preSelected - 1 < 0 ? this.oplist.length - 1 : preSelected - 1
        removeBusiness({
          keyTypeCodeFrom: keyTypeCodeFrom,
          keyTypeCodeTo: this.keyTypeCode
        })
          .then((res: any) => {
            this.oplist = this.oplist.filter((item: any) => {
              return item.id !== row.id
            })
            // 删除对应的数据列表
            let data = {
              keyTypeCodeFrom: keyTypeCodeFrom,
              keyTypeCodeTo: this.keyTypeCode,
              list: []
            }
            saveFormData(data)
              .then((res: any) => {
                this.$message.success('删除成功!')
                this.opTable.setCurrentRow(this.oplist[0])
                this.selectedOpId = this.oplist[0].id || ''
                this.loading.close()
              })
              .catch(() => {
                this.loading.close()
              })
          })
          .catch(() => {
            this.loading.close()
          })
        this.loading.close()
      })
      .catch(() => {
        this.$message.info('已取消删除')
      })
  }
  // 业务列表点击
  opRowClick(row: any) {
    this.selectedOpId = row.id
  }
  // 添加其他表格数据
  addOtherOpData() {
    let singleDataList = {
      keyTypeCodeTo: this.keyTypeCode,
      keyTypeCodeFrom: this.selectedOpId,
      inFieldNumFrom: '', // 源表单字段
      inFieldNumTo: '', // 目标表单字段
      inTableNumFrom: '',
      inTableNumTo: ''
    }
    this.opDatalist.push(singleDataList)
    this.targetFields[this.opDatalist.length - 1] = []
    this.originFields[this.opDatalist.length - 1] = []
  }
  // 删除业务数据
  removeDataList(row: any) {
    this.$confirm('确定要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading.start()
        this.opDatalist.splice(row.index, 1)
        // 更新targetFields和originFields
        // this.opDatalist.forEach(async(item:any, index:number) => {
        //   try {
        //     let targetFields = await getFormFields(item.inTableNumTo)
        //     let originFields = await getFormFields(item.inTableNumFrom)
        //     this.targetFields.splice(index, 1, [...targetFields.data])
        //     this.originFields.splice(index, 1, [...originFields.data])
        //     this.loading.close()
        //   } catch { this.loading.close() }
        // })
        this.saveOpDataList()
      })
      .catch(() => {
        this.$message.info('已取消删除')
      })
    // this.loading.close()
  }
  // 给opdataList的table行中加上index
  rowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }
  // 目标表单发生改变
  targetFormChange(row: any) {
    this.opDatalist[row.index].inFieldNumTo = ''
    this.getFormFields(row.inTableNumTo, 'fieldsTo', row.index)
  }
  // 源表单发生变化
  originFormChange(row: any) {
    this.opDatalist[row.index].inFieldNumFrom = ''
    this.getFormFields(row.inTableNumFrom, 'fieldsFrom', row.index)
  }
  // 根据formId获取字段
  async getFormFields(formId: number, fieldType: string, tableId: number) {
    this.loading.start()
    try {
      let res = await getFormFields(formId)
      if (fieldType === 'fieldsTo') {
        this.targetFields.splice(tableId, 1, [...res.data])
      } else if (fieldType === 'fieldsFrom') {
        this.originFields.splice(tableId, 1, [...res.data])
      }
    } catch {}
    this.loading.close()
  }
  // 保存成功
  async saveOpDataList() {
    this.loading.start()
    let opList = this.opDatalist.map((item: IDataList) => {
      let { index, subTabNameFrom, subTabNameTo, ...finData } = { ...item }
      return finData
    })
    let isValidata = true
    let inValidata = opList.forEach((item: any) => {
      for (let prop in item) {
        if (!(item as any)[prop]) {
          isValidata = false
          return
        }
      }
    })
    if (isValidata) {
      let data = {
        keyTypeCodeFrom: this.selectedOpId,
        keyTypeCodeTo: this.keyTypeCode,
        list: opList
      }
      try {
        let res = await saveFormData(data)
        this.getopDataList()
        this.$message.success('操作成功')
      } catch {}
      this.loading.close()
    } else {
      this.$message.warning('源数据不能为空!')
      this.loading.close()
    }
  }
}
</script>

<style lang="scss">
.other-opdata {
  .el-table--border {
    border: none !important;
  }
  .el-table--border::after {
    display: none;
  }
  .el-table--border th {
    border-right: none;
  }
  .el-table--border td {
    border-right: none;
  }
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
.other-opdata {
  display: flex;
  height: 100%;
  .op-data-content {
    height: 100%;
    padding: 16px 16px 24px 0;
    display: flex;
    flex-direction: column;
    .operate-btn {
      flex-shrink: 0;
    }
    .table-list {
      flex-grow: 1;
    }
  }
  .business-tree {
    max-height: 580px;
    .tree-content {
      overflow: auto;
    }
    &::v-deep .el-tree .mark sup {
      top: -0.1em;
    }
    &::v-deep .el-tree .el-tree-node__expand-icon.expanded {
      transform: rotate(0deg);
    }
    &::v-deep .el-tree .el-icon-caret-right:before {
      background: url($icl-folder) no-repeat 0 3px;
      @include tree-icon;
    }
    &::v-deep
      .el-tree
      .el-tree-node__children
      .el-tree-node__expand-icon.el-icon-caret-right:before {
      background: url($icf-folder) no-repeat 0 3px;
      @include tree-icon;
    }
    &::v-deep .el-tree .el-tree-node__expand-icon.el-icon-caret-right:before {
      background: url($icl-folder) no-repeat 0 3px;
      @include tree-icon;
    }
    &::v-deep
      .el-tree
      .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
      background: url($icf-folder-open) no-repeat 0 3px;
      @include tree-icon;
    }
    &::v-deep
      .el-tree
      .el-tree-node__children
      .el-tree-node
      .el-tree-node__children
      .el-tree-node__expand-icon.is-leaf::before {
      background: url($icf-file-text) no-repeat 0 3px;
      @include tree-icon;
    }
    &::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 0;
    }
  }
}
</style>
