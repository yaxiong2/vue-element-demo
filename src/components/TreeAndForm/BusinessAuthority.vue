<template>
  <div class="BusinessAuthority">

    <div class="content" style="height:100%;width:100%;position:absolute;">
      <ResizeContent :is-resizeable="false" :left-min-width="300">
        <template v-slot:left>
          <div class="left">
            <el-input
              v-model="filterText"
              placeholder="请输入"
              suffix-icon="el-icon-search"
            />
            <el-tree ref="tree" :data="treeData" :props="defaultProps" :filter-node-method="filterNode" @node-click="handleNodeClick" />
          </div>
        </template>
        <template v-slot:right>
          <div class="right">
            <el-form>
              <el-form-item style="padding-top:10px;">
                <div class="header-right">
                  <el-button type="primary" icon="el-icon-document" @click="onSubmit">保存</el-button>
                </div>
              </el-form-item>
            </el-form>
            <el-table
              ref="multipleTable"
              :data="authorityTableData"
              width="100%"
              height="calc(100% - 80px)"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                disabled
                type="selection"
                width="55"
                :selectable="handleSelectable"
              />
              <el-table-column
                prop="powerName"
                label="权限"
              />
            </el-table>
          </div>
        </template>
      </ResizeContent>

    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch, Inject } from 'vue-property-decorator'
import { getPowerList, getUserPower, getUserOriginPower } from '@/api/tree-data/rolePower'
import ResizeContent from '@/components/ResizeContent/index.vue'
import { getUserTreeData } from '@/api/system/user'
import { ModuleState } from '@/store/modules/module'
import { Table, Tree } from 'element-ui'
interface IPowerItem {
  powerId: number
  powerName:string
  [propName:string]:any
}
interface IUserNode {
  id:string
  label:string
  children?:IUserNode[]
  type?:string
}
@Component({
  name: 'BusinessAuthority',
  components: {
    ResizeContent
  }
})
export default class BusinessAuthority extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  @Ref('multipleTable') readonly multipleTableRef!:Table
  @Ref('tree') readonly treeRef!:Tree
  private authorityTableData = []
  private treeData = []
  private multipleSelection:IPowerItem[] = []
  private currentNode:IUserNode | {} = {}
  private filterText = ''
  private defaultProps = {
    children: 'children',
    label: 'label'
  }
  @Watch('filterText')
  filterTextChange(val:string) {
    this.treeRef.filter(val)
  }
  mounted() {
    this.getUserTree()
    this.getPowerList()
  }
  getUserTree() {
    getUserTreeData().then(({ data }) => {
      this.treeData = data
    })
  }
  getPowerList() {
    getPowerList(1).then(({ data }) => {
      this.authorityTableData = data
    })
  }
  filterNode(value:string, data:IUserNode) {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }
  handleSelectionChange(val:IPowerItem[]) {
      this.multipleSelection = val
  }
  onSubmit() {
    if (!(this.currentNode as any).id) {
      this.$message.error('请在左侧选择用户')
      return false
    }
    this.submitPowers()
  }
  submitPowers() {
     getUserPower({
      'keyTypeCode': ModuleState.keyTypeCode,
      'powerIds': this.multipleSelection.map(item => item.powerId),
      'userId': (this.currentNode as any).id
    }).then(({ data }) => {
      if (data) {
        this.$message.success('权限添加成功')
      }
    })
  }
  handleNodeClick(node:IUserNode) {
    this.multipleSelection.forEach(item => {
      this.multipleTableRef.toggleRowSelection(item)
    })
    this.multipleSelection = []
    if (node.type) {
      this.currentNode = node
      this.getPowerTree()
    } else {
      this.currentNode = {}
    }
  }
  getPowerTree() {
    this.loading.start()
    getUserOriginPower({
        keyTypeCode: ModuleState.keyTypeCode,
        userId: (this.currentNode as any).id
      }).then(({ data }) => {
        this.authorityTableData.filter((item:IPowerItem) => data.includes(String(item.powerId))).forEach(item => {
          this.multipleTableRef.toggleRowSelection(item)
        })
        this.loading.close()
      }).catch(() => {
        this.loading.close()
      })
  }
  handleSelectable() {
    let noDisabled = Object.keys(this.currentNode).length
    return noDisabled
  }
}
</script>
<style lang="scss">

.BusinessAuthority .el-table  .el-table_body {
  margin-bottom: 80px!important;
}
.BusinessAuthority {
  height: 100%;
}
</style>
<style scoped lang="scss">
.left {
  padding:10px 10px 10px 0;
}
.right {
  padding-left: 10px;
  height:100%;
}
</style>

