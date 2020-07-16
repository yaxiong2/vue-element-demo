<!--业务定义侧边栏 -->
<template>
  <div class="treeWrapper">
    <div style="width:100%;">
      <el-input
        v-model="filterText"
        placeholder="请输入关键词检索..."
        prefix="业务组名称"
        clearable
        style="width:100%;"
        suffix-icon="el-icon-search"
      />
    </div>
    <div class="el-my-3 opbtn">
      <el-tooltip content="新增类别">
        <el-button type="text" size="mini" @click="append(-1)">
          <svg-icon icon-class="ic-plus" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="上移">
        <el-button :disabled="!showType" type="text" size="mini" @click="() => move('top')">
          <svg-icon icon-class="icl-dir-top" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="下移">
        <el-button :disabled="!showType" type="text" size="mini" @click="() => move('bottom')">
          <svg-icon icon-class="icl-dir-bottom" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="新增分组">
        <el-button
          :disabled="currentNode.level !== 1"
          type="text"
          size="mini"
          @click="() => append(currentData)"
        >
          <svg-icon icon-class="icl-plus-circle" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="新增业务">
        <el-button
          :disabled="currentNode.level !== 2"
          type="text"
          size="mini"
          @click="() => addop(currentData)"
        >
          <svg-icon icon-class="icl-file-add" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="修改名称">
        <el-button
          :disabled="!currentData.groupId"
          type="text"
          size="mini"
          @click="() => update(currentData)"
        >
          <svg-icon icon-class="icl-edit" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="删除文件">
        <el-button
          :disabled="!showType"
          type="text"
          size="mini"
          @click="() => remove(currentNode, currentData)"
        >
          <svg-icon icon-class="icl-delete" />
        </el-button>
      </el-tooltip>
    </div>
    <!-- 业务类及业务组的创建 -->
    <div class="block">
      <el-tree
        ref="tree"
        node-key="id"
        highlight-current
        draggable
        :data="groupLists"
        :indent="indent"
        :filter-node-method="filterNode"
        :default-expanded-keys="groupKey"
        :allow-drop="allowDrop"
        @node-click="getTreeNode"
        @node-drag-start="handleDragStart"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
      >
        <div slot-scope="{ node }" class="custom-tree-node flex-row">
          <span v-if="node.label.length<24">
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
    <!-- 添加或者修改弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="95px" label-position="left">
        <el-form-item
          v-if="upNameShow"
          label="归属业务组"
          prop="upName"
        >
          <el-input v-model="form.upName" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item
          :label="opCode"
          prop="order"
        >
          <el-input v-model="form.order" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item
          :label="opName"
          prop="name"
          :rules="[
            { required: true, message: opName + '不能为空', trigger: 'blur' }
          ]"
          class="el-mb-0"
        >
          <el-input v-model.trim="form.name" autocomplete="off" :placeholder="placeholderName" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Inject } from 'vue-property-decorator'
import {
  getGroupTree,
  addGroupMain,
  addOpmain,
  modifyGroupMain,
  updateOpmain,
  removeGroupMain,
  removeOpmain,
  moveGroupMain,
  moveOpmain
} from '@/api/tree-data/treeAndRole'
import { ModuleState } from '@/store/modules/module'
import qs from 'qs'

// 弹窗表格接口
interface FormData {
  upName: string
  name: string
  order: number | null
}

@Component({
  name: 'Va-CreateGroup'
})
export default class extends Vue {
  private title: string = '添加业务' // 弹窗标题
  private opName: string = '' // 弹窗是否是添加业务or业务组
  private opCode: string = '' // 弹窗是否是业务编号or业务组编号
  private placeholderName: string = '' // 弹窗是否是添加业务or业务组
  private dialogFormVisible: boolean = false // 控制弹窗是否出现
  private form: FormData = {
    // 弹窗表格内容
    upName: '',
    name: '',
    order: null
  }
  private groupLists: any[] = [] // 最终table树展示的数据
  private addName: string = '' // 记录被点击的业务id名称
  private operateName: string = '' // 记录当前操作的方法，'添加'/'修改'
  private upNameShow: boolean = true // 控制弹窗表格中的归属业务是否出现
  // private loading: boolean = true // 定义全局的加载蒙版
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private filterText: string = '' // 搜索关键词
  private groupKey: any[] = [] // 默认打开的组
  private indent: number = 10 // tree父子水平方向的缩进
  // 节点移动
  private mine: number | null = null // tree节点的id
  private nodearr: number[] = [] // tree节点所有同级的id
  private moveGroup: string = '' // 判断移动的是分组还是业务
  private currentNode: any = {}
  private currentData: any = {}
  // 默认展开的节点id
  private currentId = ''
  created() {
    this.getData()
  }
  handleDragStart(node: any, ev: any) {
    console.log('drag start', node)
  }
  handleDragEnd(draggingNode: any, dropNode: any, dropType: any, ev: any) {
    console.log('拖拽结束', draggingNode.parent, dropNode.parent)
    console.log('tree drag end: ', dropNode && dropNode.label, dropType)
  }
  handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {
    console.log('tree drop: ', dropNode.label, dropType)
  }
  allowDrop(draggingNode: any, dropNode: any, type: any) {
    if (draggingNode.parent.data.id === dropNode.parent.data.id) {
      return type !== 'inner'
    } else {
      return false
    }
  }
  allowDrag(draggingNode: any) {
    return draggingNode.data.label.indexOf('三级 3-2-2') === -1
  }
  // 获取树数据
  getData() {
    // 展现正在加载蒙版
    this.loading.start()
    this.groupLists = []
    getGroupTree()
      .then(res => {
        this.groupLists = res.data
        const a = JSON.parse((this.$route.query.expandKeys as any) || '[]')
        this.currentId = res.data && res.data[0] && res.data[0].id
        this.$nextTick(() => {
          let t = a.slice(-1)[0] || this.currentId
          this.groupKey = a
          ;(this.$refs.tree as any).setCurrentKey(t)
          const currentData = (this.$refs.tree as any).getCurrentNode()
          const currentNode = (this.$refs.tree as any).getNode(t)
          this.$nextTick(() => {
            currentData &&
              currentNode &&
              this.handleNodeClick(currentData, currentNode, undefined)
          })
        })
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 添加子组
  append(row: any) {
    this.operateName = 'add'
    this.opName = '业务组名称'
    this.title = '添加业务组'
    this.opCode = '业务组编号'
    this.placeholderName = '请输入业务组名称'
    this.addName = 'addSonGroup'
    if (row === -1) {
      this.currentNode = {}
      this.currentData = {}
      this.upNameShow = false
      this.form = {
        upName: '',
        name: '',
        order: row
      }
    } else {
      this.upNameShow = true
      this.form = {
        upName: row.label,
        name: '',
        order: row.groupId
      }
    }
    this.dialogFormVisible = true
  }
  // 添加业务
  addop(row: any) {
    this.upNameShow = true
    this.opName = '业务名称'
    this.title = '添加业务'
    this.opCode = '业务编号'
    this.placeholderName = '请输入业务名称'
    this.operateName = 'add'
    this.addName = 'addop'
    this.form = {
      upName: row.label,
      name: '',
      order: row.groupId
    }
    this.dialogFormVisible = true
    this.form.name = ''
  }
  // 删除
  remove(node: any, data: any) {
    let result: any
    this.$confirm('确定要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        if (data.groupId) {
          result = removeGroupMain(data.groupId)
        } else {
          result = removeOpmain(data.id)
        }
        result
          .then((res: any) => {
            this.$message.success('删除成功')
          })
          .then(() => {
            this.getData()
            this.groupKey = [node.parent.data.id]
            this.currentNode = {}
            this.currentData = {}
          })
      })
      .catch(() => {
        this.$message.info('已取消删除')
      })
  }
  // 修改
  update(data: any) {
    if (data.groupId) {
      this.title = '修改业务组'
      this.opName = '业务组名称'
      this.opCode = '业务组编号'
    }
    this.operateName = 'update'
    this.dialogFormVisible = true
    this.upNameShow = false
    const id = data.groupId | data.id
    this.form = {
      upName: '',
      name: data.label,
      order: id
    }
  }
  // 提交
  submit() {
    const name = this.form.name
    const id = this.form.order
    let result: any
    // 添加操作
    if (this.operateName === 'add') {
      // 添加分组
      if (this.addName === 'addSonGroup') {
        const data = {
          parentGroupId: id,
          opTypeName: name
        }
        result = addGroupMain(data)
      } else {
        // 添加业务
        const data = {
          opTypeGroupId: id,
          opTypeName: name
        }
        result = addOpmain(data)
      }
      // 修改操作
    } else if (this.operateName === 'update') {
      const data = {
        opTypeGroupId: id,
        opTypeName: name
      }
      result = modifyGroupMain(data)
    }
    result
      .then((res: any) => {
        this.$message.success('操作成功')
        this.upNameShow = true
      })
      .then(() => {
        // 重新获取数据
        this.getData()
        this.groupKey = [id, '_' + id]
      })
    this.upNameShow = true
    this.dialogFormVisible = false
  }
  // 取消
  cancel() {
    this.dialogFormVisible = false
    setTimeout(() => {
      // 主要解决取消后弹窗阴影问题
      this.operateName = ''
    }, 200)
    this.$message.warning('已取消')
  }
  // 搜索业务(监听开启之后搜索按钮回车将无用)
  @Watch('filterText')
  getfilterText(val: string) {
    const tree: any = this.$refs.tree
    tree.filter(val)
  }
  // 树节点筛选 返回true则显示
  filterNode(value: any, data: any) {
    if (!value) return true
    return Boolean(
      [data.label, data.id, data.code].filter(item => {
        return String(item)
          .toLowerCase()
          .includes(value.toLowerCase())
      }).length
    )
  }
  // 显示新增类别
  get showType() {
    return !!Object.keys(this.currentNode).length
  }
  handleNodeClick(data: any, node: any, treenode: any) {
    this.currentData = data
    this.currentNode = node
    this.nodearr = []
    this.mine = null
    const arr = node.parent.childNodes
    if (data.groupId) {
      this.moveGroup = 'moveGroup'
      this.mine = data.groupId
      arr.forEach((item: any) => {
        this.nodearr.push(item.data.groupId)
      })
    } else {
      this.moveGroup = 'moveOp'
      this.mine = data.id
      arr.forEach((item: any) => {
        this.nodearr.push(item.data.id)
      })
    }
    ModuleState.setKeyTypeCode(node.data.id)
    ModuleState.setopId(this.mine!)
    ModuleState.setopName(data.label)
    ModuleState.setmoveIdName(this.moveGroup)
    ModuleState.setgroupList(this.groupLists)
  }
  // 获取当前节点的所有兄弟节点的id
  getTreeNode(data: any, node: any, treenode: any) {
    this.handleNodeClick(data, node, treenode)
    let pointer = node
    let expandKeys = []
    while (pointer.data.id) {
      expandKeys.unshift(pointer.data.id)
      pointer = pointer.parent
    }
    this.groupKey = expandKeys
    let { tab } = this.$route.query
    if (!tab) tab = 'basicInfo'
    const routeParams = {
      ...this.$route.query,
      tab,
      expandKeys: JSON.stringify(expandKeys)
    }
    this.$router.push(this.$route.path + '?' + qs.stringify(routeParams))
  }
  // 编辑一个方法交换两元素位置
  swapArray(index1: number, index2: number) {
    this.nodearr[index1] = this.nodearr.splice(
      index2,
      1,
      this.nodearr[index1]
    )[0]
    return this.nodearr
  }
  // 节点移动
  move(type: string) {
    let result
    const index = this.nodearr.findIndex((item: any) => item === this.mine)
    if (type === 'top') {
      if (index === 0) {
        this.$message.warning('已经到顶了,不能上移')
        return
      }
      if (this.moveGroup === 'moveGroup') {
        const data = {
          decreaseOpTypeGroupId: this.nodearr[index - 1],
          increaseOpTypeGroupId: this.mine
        }
        result = moveGroupMain(data)
      } else {
        const data = {
          decreaseKeyTypeCode: this.nodearr[index - 1],
          increaseKeyTypeCode: this.mine
        }
        result = moveOpmain(data)
      }
      this.swapArray(index, index - 1)
    } else {
      if (index === this.nodearr.length - 1) {
        this.$message.warning('已经到底了,不能下移')
        return
      }
      if (this.moveGroup === 'moveGroup') {
        const data = {
          decreaseOpTypeGroupId: this.mine,
          increaseOpTypeGroupId: this.nodearr[index + 1]
        }
        result = moveGroupMain(data)
      } else {
        const data = {
          decreaseKeyTypeCode: this.mine,
          increaseKeyTypeCode: this.nodearr[index + 1]
        }
        result = moveOpmain(data)
      }
      this.swapArray(index, index + 1)
    }
    result
      .then((res: any) => {
        this.$message.success('操作成功')
      })
      .then(() => {
        // 重新获取数据
        this.getData()
        this.groupKey = [this.mine, '_' + this.mine]
      })
  }
}
</script>
<style lang="scss" scoped>
// icf-file-text@2x
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
::v-deep .el-tree .el-tree-node__children .el-tree-node__expand-icon.el-icon-caret-right:before {
  background: url($icf-folder) no-repeat 0 3px;
  @include tree-icon;
}
::v-deep .el-tree .el-tree-node__expand-icon.el-icon-caret-right:before {
  background: url($icl-folder) no-repeat 0 3px;
  @include tree-icon;
}
::v-deep .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url($icf-folder-open) no-repeat 0 3px;
  @include tree-icon;
}
::v-deep .el-tree .el-tree-node__children .el-tree-node .el-tree-node__children .el-tree-node__expand-icon.is-leaf::before{
  background: url($icf-file-text) no-repeat 0 3px;
  @include tree-icon;
}
::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
}
.opbtn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #dfe6ec;
  background: #e9eef7;
  border-right: 0;
  border-left: 0;
}
.treeWrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .block {
    flex-grow: 1;
    overflow-y: auto;
  }
  .flex-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .line-limit {
    max-width: 310px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tree-item-desc {
    font-style: normal;
    margin-left: 10px;
  }
}
</style>
