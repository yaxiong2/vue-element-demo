<template>
  <div class="wrapper">
    <!-- 业务类及业务组的创建 -->
    <el-col>
      <el-form :inline="true" label-width="88px" @submit.native.prevent>
        <el-form-item label="业务组名称">
          <el-input
            v-model="paramas"
            placeholder="请输入关键词检索..."
            clearable

            style="width: 240px"
            @keyup.enter.native="checkInfo"
            @input="noParamas"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="checkInfo">
            搜索
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addMainGroup()">
            新增
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableDom"
        height="calc(100vh - 160px)"
        highlight-current-row
        :data="groupLists"
        :expand-row-keys="expendKey"
        row-key="keyOrder"

        :lazy="true"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @row-click="selected"
        @expand-change="expanded"
      >
        <el-table-column prop="order" label="业务编号" :show-overflow-tooltip="true" width="100" />
        <el-table-column prop="name" label="业务名称" :show-overflow-tooltip="true" align="center" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
          <template slot-scope="scope">
            <el-button

              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="scope.row.flagName !== 'keyTypeCode'"

              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
            >
              新增子组
            </el-button>
            <el-button

              type="text"
              icon="el-icon-delete"
              @click="remove(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!-- 添加或者修改弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="450px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item v-if="upNameShow" label="归属业务组" :label-width="formLabelWidth" prop="upName" style="margin-top:20px">
          <el-input v-model="form.upName" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="业务组编号" :label-width="formLabelWidth" prop="order" style="margin-top:20px">
          <el-input v-model="form.order" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item
          label="业务组名称"
          :label-width="formLabelWidth"
          prop="name"
          :rules="[{ required: true, message: '业务名称不能为空',trigger:'blur'}]"
          style="margin-top:20px"
        >
          <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入业务组名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:20px">
        <el-button @click="cancel">
          取 消
        </el-button>
        <el-button type="primary" @click="submit">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Watch, Inject } from 'vue-property-decorator'
import PubSub from 'pubsub-js'
import VaInputForm from '@/components/input-form/Va-InputForm.vue'
import { getGroupMain, getOpGroup, getGroup, addGroupMain, addOpGroup, addGroup, modifyGroupMain, modifyOpGroup, modifyGroup, removeGroupMain, removeOpGroup, removeGroup, getAllOpGroup, getAllGroup } from '@/api/group-role/groupAndRole'
import { ModuleState } from '@/store/modules/module'
import { Loading } from '../../extend'

// 弹窗表格接口
interface FormData {
  upName:string,
  name: string,
  order: number | null,
}
// 定义一个对象接口，用来储存对应的upId下的子数据
interface ChildrenData {
  [upId:string]:any[]
}

@Component({
  name: 'Va-CreateGroup'
})

export default class extends Vue {
  private formLabelWidth:string = '100px' // 弹窗label宽度
  private title:string = '添加业务' // 弹窗标题
  private dialogFormVisible:boolean = false // 控制弹窗是否出现
  private form:FormData = { // 弹窗表格内容
    upName: '',
    name: '',
    order: null
  }
  private paramas:string = '' // 搜索参数
  private groupLists:any[] = [] // 最终table树展示的数据
  private mainGroupStorage:any[] =[]// 储存第一次进来时加载的业务主组数据
  private opGroupStorage:any[] = [] // 储存第一次加载的所有业务组数据
  private opTypeStorage:any[] = [] // 储存第一次加载的所有基础业务数据
  private addName:string = '' // 记录被点击的业务id名称
  private selectedId:number | null = null // 记录被点击行的id
  private upId :number | null = null // 记录业务组和基础业务组的上级id
  private currentName:string = '' // 记录添加按钮选中的组名
  private updateName:string = '' // 记录修改按钮选中的组名
  private operateName:string = '' // 记录当前操作的方法，'添加'/'修改'
  private upNameShow:boolean = true // 控制弹窗表格中的归属业务是否出现
  private maxFormGroupId:number |null = null // 添加基础业务组时的formGrouId
  // private loading:any = '' // 定义全局的加载蒙版
  @Inject('loading') loading!: Loading
  private searchedMainGroup:any[] = [] // 满足搜索条件的业务主组
  private serarchedGroup:any[] = [] // 满足搜索条件的业务组
  private searchedOptype:any[] = [] // 满足搜索条件的基础业务组
  private expendKey:any[] = [] // 需要自动展开的行

  created() {
    this.getData()
  }
  getData() {
    this.groupLists = []
    this.mainGroupStorage = []
    this.opGroupStorage = []
    this.opTypeStorage = []
    // 展现正在加载蒙版
    //  const loading = this.$loading({
    //       lock: true,
    //       text: 'Loading',
    //       spinner: 'el-icon-loading',
    //       background: 'rgba(0, 0, 0, 0.7)'
    //     })
    this.loading.start()
    getGroupMain().then(res => { // 获取业务主组数据
      if (res.status === 200) {
        const data = res.data
        for (const item of data) {
          // 转化成table表单格式的数据
          const endData = this.transFormData(item, 'mainGroupId', 'mainGroupIdName')
          // 将业务主组数据转换后保存起来
          this.mainGroupStorage.push(endData)
        }
        // 获取所有业务组数据
        getAllOpGroup().then(res => { // 加载业务组数据
          if (res.status === 200) {
            for (const item of res.data) {
              // 转化成table表单格式的数据
              const endData = this.transFormData(item, 'opTypeGroupId', 'opTypeGroupName')
              // 将业务组数据转换后保存起来
              this.opGroupStorage.push(endData)
            }
            // 获取所有基础业务组数据
            getAllGroup().then(res => { // 加载业务组数据
              if (res.status === 200) {
                for (const item of res.data) {
                // 转化成table表单格式的数据
                  const endData = this.transFormData(item, 'keyTypeCode', 'opTypeName')
                  // 将业务组数据转换后保存起来
                  this.opTypeStorage.push(endData)
                }
                // 将基础业务组按照upId分类成一个对象
                const basicGroupDataObject = this.divideByUpId(this.opTypeStorage)
                // 将基础业务组放到对应的业务组中
                const groupData = this.parentDataWithChildren(basicGroupDataObject, this.opGroupStorage)
                // 将业务组按照upId分类成一个对象
                const groupDataObject = this.divideByUpId(groupData)
                // 将业务组数据放到对应的业务主组数据中
                const mainGroupData = this.parentDataWithChildren(groupDataObject, this.mainGroupStorage)
                this.groupLists = mainGroupData
                this.loading.close()
              } else {
                this.loading.close()
                this.$message.error('获取基础业务组数据失败')
              }
            })
              .catch(err => {
                this.loading.close()
                this.$message.error('获取基础业务组数据失败' + err)
              })
          } else {
            this.loading.close()
            this.$message.error('获取业务组数据失败')
          }
        })
          .catch(err => {
            this.loading.close()
            this.$message.error('请求服务器业务主组数据失败' + err)
          })
      } else {
        this.loading.close()
        this.$message.error('获取业务主组数据失败')
      }
    })
      .catch(err => {
        this.loading.close()
        this.$message.error('请求服务器业务主组数据失败' + err)
      })
  }
  // 定义一个方法，将子组数据放入到对应的父级数据的children中
  parentDataWithChildren(sonDataObject:any, allParentData:any[]) {
    const parentData = allParentData
    const finalParentData = []
    for (const singleUpData of parentData) {
      const order = singleUpData['order']
      singleUpData['children'] = sonDataObject[order]
      finalParentData.push(singleUpData)
    }
    return finalParentData
  }
  // 添加主组
  addMainGroup() {
    this.upNameShow = false
    this.addName = 'addMainGroup'
    this.operateName = 'add'
    // 获取最大id
    const maxId = this.findMaxId(this.mainGroupStorage, 'order')
    this.form.order = maxId + 1
    this.dialogFormVisible = true
    this.form.name = ''
  }
  // 监听添加子组按钮点击
  handleAdd(row:any) {
    this.form.name = ''
    this.upNameShow = true
    this.addName = row.flagName
    this.form.upName = row.name
    this.selectedId = row.order
    this.upId = row.upId
    this.operateName = 'add'
    // 计算对应的某个组的最大的id
    if (row.flagName === 'mainGroupId') { // 添加业务组
      getAllOpGroup().then(res => { // 重新加载所有业务组数据，计算最大业务组最大id
        if (res.status === 200) {
          for (const item of res.data) {
            // 转化成table表单格式的数据
            const endData = this.transFormData(item, 'opTypeGroupId', 'opTypeGroupName')
            // 将业务组数据转换后保存起来
            this.opGroupStorage.push(endData)
          }
          const maxId = this.findMaxId(this.opGroupStorage, 'order')
          this.form.order = maxId + 1
          this.dialogFormVisible = true
        } else {
          this.$message.error('获取业务组编号失败')
        }
      })
    } else { // 添加基础业务组
      getAllGroup().then(res => {
        if (res.status === 200) {
          for (const item of res.data) {
            // 转化成table表单格式的数据
            const endData = this.transFormData(item, 'keyTypeCode', 'opTypeName')
            // 将业务组数据转换后保存起来
            this.opTypeStorage.push(endData)
          }
          const maxId = this.findMaxId(this.opTypeStorage, 'order')
          const maxGroupId = this.findMaxId(this.opTypeStorage, 'formGroupId')
          this.maxFormGroupId = maxGroupId + 1
          this.form.order = maxId + 1
          this.dialogFormVisible = true
        } else {
          this.$message.error('获取业务组编号失败')
        }
      })
    }
  }
  // 监听修改按钮点击
  handleUpdate(row:any) {
    this.title = '修改业务'
    this.upNameShow = false
    this.selectedId = row.order
    this.upId = row.upId
    this.updateName = row.flagName
    this.form.name = row.name
    this.form.order = row.order
    this.operateName = 'update'
    this.dialogFormVisible = true
  }
  // 监听删除
  remove(row:any) {
    // 需满足没有子数据才能被删除
    if (row.children === undefined || row.children.lenght === 0) {
      const id = row.order
      const type = row.flagName
      let result
      if (type === 'mainGroupId') {
        result = removeGroupMain(id)
      } else if (type === 'opTypeGroupId') {
        result = removeOpGroup(id)
      } else {
        result = removeGroup(id)
      }
      result.then(res => {
        if (res.status === 200) {
          this.$message.success('删除成功')
          this.getData()
        }
      }).catch(err => {
        this.$message.error('删除失败' + err)
      })
    } else {
      this.$message.warning('该组包含子数据,不可删除')
    }
  }
  // 提交
  submit() {
    let result
    this.dialogFormVisible = false
    if (this.addName === 'addMainGroup' || this.updateName === 'mainGroupId') { // 操作业务主组
      // 获取数据
      const mainGroupId = this.form.order
      const mainGroupIdName = this.form.name
      const data = {
        'companyNum': 1,
        'mainGroupId': mainGroupId,
        'mainGroupIdName': mainGroupIdName
      }
      // 判断是添加还是修改，进行相应的操作
      if (this.operateName === 'add') {
        result = addGroupMain(data)
      } else {
        result = modifyGroupMain(data)
      }
      result.then(res => {
        if (res.status === 200) {
          // 重新获取数据
          this.getData()
          this.$message.success('操作成功')
          this.upNameShow = true
        } else {
          this.$message.error('操作失败')
          this.upNameShow = true
        }
      }).catch(err => {
        this.$message.error('操作失败' + err)
        this.upNameShow = true
      })
    } else if (this.addName === 'mainGroupId' || this.updateName === 'opTypeGroupId') { // 操作业务组
      // 获取数据
      let mainGroupId = this.selectedId
      const opTypeGroupId = this.form.order
      const opTypeGroupName = this.form.name
      if (this.operateName === 'update') {
        mainGroupId = this.upId
      }
      const data = {
        'companyNum': 1,
        'mainGroupId': mainGroupId,
        'opTypeGroupId': opTypeGroupId,
        'opTypeGroupName': opTypeGroupName
      }
      // 判断是添加还是修改，进行相应的操作
      if (this.operateName === 'add') {
        result = addOpGroup(data)
      } else {
        result = modifyOpGroup(data)
      }
      result.then(res => {
        if (res.status === 200) {
          this.getData()
          this.$message.success('操作成功')
        } else {
          this.$message.error('操作失败')
        }
      }).catch(err => {
        this.$message.error('操作失败' + err)
      })
    } else if (this.addName === 'opTypeGroupId' || this.updateName === 'keyTypeCode') { // 添加基础业务
      // 获取操作基础业务的数据
      const keyTypeCode = this.form.order
      const opTypeName = this.form.name
      let opTypeGroupId = this.selectedId
      const formGroupId = this.maxFormGroupId
      if (this.operateName === 'update') {
        opTypeGroupId = this.upId
      }
      const data = {
        'keyTypeCode': keyTypeCode,
        'opTypeName': opTypeName,
        'ifAdoptPromises': true,
        'ifNet': true,
        'isStat': true,
        'formGroupId': formGroupId,
        'opTypeGroupId': opTypeGroupId,
        'canFromCancel': true,
        'canInMutiProjectNum': true,
        'isProcess': true,
        'isNonPrjOp': true,
        'isPaperless': true,
        'isIntoEndingBox': false
      }
      // 判断是添加还是修改，进行相应的操作
      if (this.operateName === 'add') {
        result = addGroup(data)
      } else {
        result = modifyGroup(data)
      }
      result.then(res => {
        if (res.status === 200) {
          this.getData()
          this.$message.success('操作成功')
        } else {
          this.$message.error('操作失败')
        }
      }).catch(err => {
        this.$message.error('操作失败' + err)
      })
    }
    // 清空判断条件，避免错误
    this.addName = ''
    this.updateName = ''
    this.operateName = ''
  }
  // 取消
  cancel() {
    this.dialogFormVisible = false
    setTimeout(() => { // 主要解决取消后弹窗阴影问题
      this.addName = ''
      this.updateName = ''
      this.operateName = ''
    }, 200)
  }
  // 定义一个方法,将数据转换为table的数据格式
  transFormData(obj:any, idName:string, propName:string) {
    interface FinalData {
      order:number | null
      name:string | null
      flagName:string | null
      // hasChildren?:boolean | null
      upId?:number | null
      formGroupId?:number | null
      keyOrder?:any
    }
    const tableData:FinalData = {
      order: null,
      name: null,
      flagName: null,
      upId: null,
      // hasChildren:null,
      formGroupId: null,
      keyOrder: null
    }
    const order = obj[idName]
    tableData['order'] = order
    tableData['name'] = obj[propName]
    tableData['flagName'] = idName
    if (idName === 'mainGroupId') {
      // tableData['hasChildren'] = true
      tableData['keyOrder'] = 'mainGroup_' + order
    } else if (idName === 'opTypeGroupId') {
      tableData['upId'] = obj['mainGroupId']
      tableData['keyOrder'] = 'opTypeGroup_' + order
      // tableData['hasChildren'] = true
    } else {
      tableData['formGroupId'] = obj['formGroupId']
      tableData['keyOrder'] = 'opTypeKey_' + order
      tableData['upId'] = obj['opTypeGroupId']
    }
    return tableData
  }
  // 搜索
  checkInfo() {
    // 清空储存，以防错误
    this.expendKey.splice(0, this.expendKey.length)
    this.searchedMainGroup = []
    this.serarchedGroup = []
    this.searchedOptype = []
    this.groupLists = []
    // this.loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    this.loading.start()
    if (this.paramas) {
      // 筛选业务主组
      this.findElement(this.mainGroupStorage, this.paramas, this.searchedMainGroup)
      // 筛选业务组
      this.findElement(this.opGroupStorage, this.paramas, this.serarchedGroup)
      // 在基础业务组中查找
      this.findElement(this.opTypeStorage, this.paramas, this.searchedOptype)
      // 将基础业务组的数据按照upId分类
      const searchedBasicGroupDataObject = this.divideByUpId(this.searchedOptype)
      // 获取包含这些数据的业务组
      const groupDataArry = this.addChildrenData(searchedBasicGroupDataObject, this.opGroupStorage, this.serarchedGroup)
      // 将业务组的数据按照upId分类
      const dividedGroupData = this.divideByUpId(groupDataArry)
      // 获取包含这些数据的业务主组数据
      const mainGroupDataArry = this.addChildrenData(dividedGroupData, this.mainGroupStorage, this.searchedMainGroup)
      if (mainGroupDataArry.length === 0) {
        this.groupLists = this.mainGroupStorage
        this.loading.close()
        this.$message('未搜索到该数据')
      } else {
        this.loading.close()
        this.groupLists = mainGroupDataArry
      }
    } else {
      this.getData()
      this.loading.close()
    }
  }
  // 当输入框中没有搜索文字时，执行的方法
  noParamas() {
    if (this.paramas.length === 0) {
      this.checkInfo()
    }
  }
  // 定义一个方法，根据参数找到数组中的某个元素,并且储存满足条件的上一级子数据
  /**
   * arry 后台请求的所有数据
   * params 查询参数
   * storageObj 满足条件的对象需要存储的位置
   */
  findElement(arry:any[], paramas:string, storagePosition:any[]) {
    for (const item of arry) {
      if (item['name'].indexOf(paramas) !== -1) {
        storagePosition.push(item)
      }
    }
  }
  // 定义一个方法，将数据按照upId分类
  divideByUpId(dataArry:any[]) {
    const groupData:ChildrenData = {}
    for (const item of dataArry) {
      const upId = item['upId']
      if (!groupData[upId]) {
        groupData[upId] = []
      }
      groupData[upId].push(item)
    }
    return groupData
  }
  // 定义一个方法，将子数据放入到对应的父级节点的children中，且要将重复的整合
  /**
   * childrenData 根据上级order,既本级的upId分组的满足搜索条件的对象
   * parentData 所有上一级的数据组，这样可以根据childrenData中的order找到所有符合条件的上级
   * searchedParentData 所有本级符合搜索条件的对象
   */
  addChildrenData(childrenData:any, parentData:any[], searchedParentData:any[]) {
    // 将传入的搜索到的数据保存
    const SearchStorage = searchedParentData
    // 根据子节点中的upId， 得到所有对应的父节点
    const upIdArrys = Object.keys(childrenData)
    // 根据子节点的upId， 在所有父节数据中筛选order 等于这个upId的数据
    let selectedParentData = []
    for (const key of upIdArrys) {
      for (const item of parentData) {
        if (item['order'] === Number(key)) {
          item.children = childrenData[key]
          selectedParentData.push(item)
        }
      }
    }
    // 遍历所selectedParentData， 获取所有的keyOrder，该值后续默认展开
    for (const item of selectedParentData) {
      const expendKeyOrder = item['keyOrder']
      if (this.expendKey.indexOf(expendKeyOrder) === -1) {
        this.expendKey.push(expendKeyOrder)
      }
    }
    // 将满足搜索条件的父节点数据和selectedParentData进行整合，删除相同的部分
    const sameItem = []
    const selectedkeyOrder:any[] = []
    selectedParentData.forEach(value => {
      selectedkeyOrder.push(value['keyOrder'])
    })
    for (const searchedItem of SearchStorage) {
      const searchedKeyOrder = searchedItem['keyOrder']
      if (selectedkeyOrder.indexOf(searchedKeyOrder) !== -1) { // 表示元素相同，需要将该元素过滤
        sameItem.push(searchedKeyOrder)
      }
    }
    // 删除相同的部分
    for (let i = SearchStorage.length - 1; i >= 0; i--) {
      const keyOrder = SearchStorage[i]['keyOrder']
      if (sameItem.indexOf(keyOrder) !== -1) {
        SearchStorage.splice(i, 1)
      }
    }
    // 遍历剩下的搜索到的父节点数据，删除起children数据
    for (const lastItem of SearchStorage) {
      lastItem['children'] = null
    }
    selectedParentData = selectedParentData.concat(SearchStorage)
    return selectedParentData
  }
  // 定义一个方法，查找最大的id
  findMaxId(arr:any[], idName:string) {
    let maxId = 0
    for (const item of arr) {
      maxId = item[idName] > maxId ? item[idName] : maxId
    }
    return maxId
  }
  // 监听展开按钮点击
  expanded(row:any, expanded:any) {
    const keyOrder = row.keyOrder
    if (expanded) { // 展开
      if (this.expendKey.indexOf(keyOrder) === -1) {
        this.expendKey.push(keyOrder)
      }
    } else { // 关闭
      // 将该行的keyOrder 从expendKey中去除
      const index = this.expendKey.indexOf(keyOrder)
      this.expendKey.splice(index, 1)
    }
  }
  // 记录表格点击
  selected(row:any) {
    const keyOrder = row.keyOrder
    if (row.flagName === 'keyTypeCode') {
      const formGroupId = row.formGroupId
      const formName = row.name
      const keyTypeCode = row.order
      ModuleState.SetGroupId(formGroupId)
      ModuleState.SetBusinessName(formName)
      ModuleState.setKeyTypeCode(keyTypeCode)
    }
  }
}
</script>
<style lang="scss">
  .wrapper{
    .is-top{
      margin-bottom: 0;
    }
    //选中时的背景颜色
     tr.current-row>td{
      cursor: pointer;
      background-color: #1890ff !important;
      color: white !important;
      button{
        color:white
      }
      .el-icon-arrow-right{
        color: white;
      }
    }
    // 设置表格的高度
    tr{
      padding: 0;
      cursor: pointer;
      td{
          height: 40px;
          padding: 0;
          font-size: 14px
      }
    }
    // 设置增删改查按钮的的样式
    .cell>.el-button--mini:nth-child(2){
      margin-left: 0;
      padding: 0;
    }

    // 设置表格table表头的字体大小
    th .cell{
      font-size: 14px;
    }
  }
</style>
