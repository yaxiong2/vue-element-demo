<template>
  <div class="project-number app-container">
    <!-- dialog-业务编号格式设置 -->
    <el-dialog class="code-dialog" title="项目号设置" :visible.sync="showCodeDialog">
      <el-row :gutter="16" type="flex" justify="space-between">
        <el-col :span="12">
          <div class="box-card col-one">
            <div slot="header" class="clearfix">
              <span>项目号名称</span>
            </div>
            <el-input v-model="valName" />
          </div>
          <div class="box-card set">
            <div slot="header" class="clearfix">
              <span>项目号格式设置</span>
            </div>
            <el-row type="flex" :gutter="10">
              <el-col :span="14">
                <el-card class="box-card set-list">
                  <el-menu :default-active="setListIndex" class="el-menu-vertical-demo">
                    <el-menu-item
                      v-for="(item, index) in setListArr"
                      :key="item.index"
                      :index="item.index"
                      @click="setListOpen(item.index, index, item)"
                    >
                      <i :class="item.icon" />
                      <span slot="title">{{ item.value }}</span>
                    </el-menu-item>
                  </el-menu>
                </el-card>
              </el-col>
              <el-col :span="10">
                <div class="set-button">
                  <el-button
                    size="mini"
                    plain
                    :disabled="objDisabled.year"
                    @click="addSetFun('year')"
                  >添加年份</el-button>
                  <el-button
                    size="mini"
                    plain
                    :disabled="objDisabled.code"
                    @click="addSetFun('code')"
                  >添加编号</el-button>
                  <el-button size="mini" plain @click="addSetFun('format')">添加代码</el-button>
                  <el-button size="mini" plain icon="el-icon-delete" @click="deleteSetItem">删除</el-button>
                </div>
                <div class="set-button mt-group">
                  <el-button size="mini" plain icon="el-icon-top" @click="topMoveFun()">上移</el-button>
                  <el-button size="mini" plain icon="el-icon-bottom" @click="bottomMoveFun()">下移</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="box-card col-one">
            <div slot="header" class="clearfix">
              <span>项目号格式</span>
            </div>
            <el-input disabled :value="showInputVal" />
          </div>
          <div class="box-card edit">
            <div slot="header" class="clearfix">
              <span>格式输入</span>
            </div>
            <div v-show="setListIndexItem.label === '年份'" class="content">
              <div class="title">请选择年份表达式：</div>
              <el-radio-group v-model="yearRadio" class="edit-radio">
                <el-radio :label="99">数字2位年份：99</el-radio>
                <el-radio :label="9999">数字4位年份：1999</el-radio>
                <el-radio :label="29">汉子两位年份：九九</el-radio>
                <el-radio :label="49">汉子4位年份：一九九九</el-radio>
              </el-radio-group>
            </div>
            <div v-show="setListIndexItem.label === '编号'" class="content-code">
              <div class="title">输入编号最大位数：</div>
              <el-select v-model="codeMaxVal" placeholder="请选择" class="select-max">
                <el-option v-for="item in codeMaxList" :key="item" :label="item" :value="item" />
              </el-select>
              <div class="title-radio">选择编号表达方式：</div>
              <el-radio-group v-model="codeRadio" class="code-radio">
                <el-radio :label="9">不足位不补零：如 1</el-radio>
                <el-radio :label="0">不足位补零：如 0001</el-radio>
              </el-radio-group>
            </div>
            <div v-show="setListIndexItem.label === '代码'" class="content-format">
              <div class="title">输入代码内容：</div>
              <span v-for="item in formatValList" :key="item.index">
                <!-- <el-input class="input-format" placeholder="请输入" v-model="formatVal"></el-input> -->
                <el-input
                  v-if="item.index === Number(setListIndex)"
                  v-model="item.value"
                  class="input-format"
                  placeholder="请输入"
                />
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCodeDialog = false">取 消</el-button>
        <el-button type="primary" @click="trueValue()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject, Prop } from 'vue-property-decorator'
import { editProject } from '@/api/business/projectNumber'
import { ModuleState } from '@/store/modules/module'

interface interfaceProject {
  prjTypeDefineId: string
  prjTypeName: string
  prjTypeFormat: string
}

@Component({
  name: 'format'
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }

  @Prop() private project!: any
  @Prop({ default: '' }) private formatItemsVal!: string
  @Prop({ default: '' }) private formatItemsName!: string
  @Prop({ default: 0 }) private prjTypeDefineId!: number

  private showCodeDialog: boolean = false
  private yearRadio: number = 99
  private formatVal: string = ''
  private showYear: boolean = false
  private showCode: boolean = false
  private showformat: boolean = false
  private setListIndex: string = '1'
  private formatValList: any = [
    {
      index: 3,
      value: 'A',
      text: 'A'
    }
  ]
  private codeMaxList: any[] = [4, 5, 6, 7, 8, 9]
  private codeMaxVal: string = '4'
  private codeRadio: number = 0
  private objDisabled: any = {
    year: false,
    code: false
  }
  private setListIndexNew: number = 0
  private defaultSetListArr: object[] = [
    {
      icon: 'el-icon-date',
      label: '年份',
      index: '1',
      value: '年份',
      text: `\\${this.yearFun(this.yearRadio)}\\`
    },
    {
      icon: 'el-icon-postcard',
      label: '编号',
      index: '2',
      value: '编号',
      text: `#${this.codeValEnd}#`
    },
    {
      icon: 'el-icon-notebook-2',
      label: '代码',
      index: '3',
      value: this.formatValList[0].value,
      text: this.formatValList[0].value
    }
  ]
  private setListArr: any[] = []

  private setListIndexItem: any = {}
  private clickFirstItem: boolean = false
  private valName: string = this.formatItemsName
  // 编号格式计算
  private get codeValEnd() {
    const codeMax = 10 ** Number(this.codeMaxVal)
    const codeVal = this.codeRadio ? codeMax - 1 : JSON.stringify(codeMax).replace(/1/, '')
    return codeVal
  }
  @Watch('formatItemsName')
  changeFormatItemsName(val: any) {
    this.valName = this.formatItemsName
  }
  // 监听编号格式字符串分别赋值
  @Watch('prjTypeDefineId')
  changePrjTypeDefineId(val: any) {
    this.formatValList = [
      {
        index: 3,
        value: 'A',
        text: 'A'
      }
    ]

    let value: any = this.formatItemsVal
    // 正则字符串转数组格式初始化遍历
    const p = /([^#\\_%\^]*)(?<year>\\[9\u4e5d]{2,4}\\)([^#\\_%\^]*)(?<index>#\d+#)([^#\\_%\^]*)/
    const p2 = /([^#\\_%\^]*)(?<index>#\d+#)([^#\\_%\^]*)(?<year>\\[9\u4e5d]{2,4}\\)([^#\\_%\^]*)/
    let objArr: any = []
    let arr: any = []
    let group: any = {}
    if (p.test(value)) {
      objArr = value.match(p)
      arr = objArr.slice(1, 6)
      group = objArr['groups']
    } else {
      objArr = value.match(p2)
      arr = objArr.slice(1, 6)
      group = objArr['groups']
    }
    this.setListIndex = '1'
    this.setListIndexItem.label = '年份'
    this.setListArr = []
    arr.map((q: any) => {
      if (!q) return
      if (q === group.year) {
        const str = q.match(/\\(\S*)\\/)[1]
        if (str) {
          switch (str) {
            case '9999':
              this.yearRadio = 9999
              break
            case '99':
              this.yearRadio = 99
              break
            case '九九':
              this.yearRadio = 29
              break
            case '九九九九':
              this.yearRadio = 49
              break
            default:
          }
          const newObj = JSON.parse(JSON.stringify(this.defaultSetListArr[0]))
          newObj.index = (this.setListArr.length + 1).toString()
          newObj.text = q
          this.setListArr.push(newObj)
        }
      } else if (q === group.index) {
        const code = value.match(/#(\S*)#/)[1]
        if (code) {
          this.codeRadio = 0
          this.codeMaxVal = code.length
          if (code.slice(1, 1)) {
            this.codeRadio = code.slice(1, 1)
          }
          const newObj = JSON.parse(JSON.stringify(this.defaultSetListArr[1]))
          newObj.index = (this.setListArr.length + 1).toString()
          this.setListArr.push(newObj)
        }
      } else {
        const formIndex = this.hasIndex(this.setListArr, '代码')
        const isIndex = this.setListArr.length.toString()
        if (formIndex !== '0') {
          this.formatValList.push({
            index: Number(isIndex) + 1,
            value: q,
            text: q
          })
        } else {
          this.formatValList[0].index = Number(isIndex) + 1
          this.formatValList[0].value = q
          this.formatValList[0].text = q
        }
        const newObj = JSON.parse(JSON.stringify(this.defaultSetListArr[2]))
        newObj.index = (this.setListArr.length + 1).toString()
        newObj.value = q
        newObj.text = q
        this.setListArr.push(newObj)
      }
    })
    this.objDisabledFun()
  }

  // 监听代码input输入
  @Watch('formatValList', { deep: true })
  changeFormatValList(value: any) {
    const indexNew = this.setListIndexNew
    if (!this.setListArr[indexNew]) return
    value.map((q: any) => {
      if (q.index === Number(this.setListArr[indexNew].index)) {
        this.setListArr[indexNew].text = q.value
        this.setListArr[indexNew].value = q.value
      }
    })
  }
  // 编号表达方式动态变化
  @Watch('codeRadio')
  changeCodeRadio(value: any) {
    const codeMax = 10 ** Number(this.codeMaxVal)
    const codeVal = this.codeRadio ? codeMax - 1 : JSON.stringify(codeMax).replace(/1/, '')
    this.setListArr.map((q: any) => {
      if (q.label === '编号') {
        q.text = `#${codeVal}#`
      }
    })
  }
  // 编号最大位数动态变化
  @Watch('codeMaxVal')
  changeCodeMaxVal(value: any) {
    const codeMax = 10 ** Number(this.codeMaxVal)
    const codeVal = this.codeRadio ? codeMax - 1 : JSON.stringify(codeMax).replace(/1/, '')
    this.setListArr.map((q: any) => {
      if (q.label === '编号') {
        q.text = `#${codeVal}#`
      }
    })
  }
  // 年份表达
  @Watch('yearRadio')
  changeYearRadio(value: any) {
    this.setListArr.map((q: any) => {
      if (q.label === '年份') {
        q.text = `\\${this.yearFun(value)}\\`
      }
    })
  }

  // 年份格式转换
  yearFun(value: any) {
    return JSON.stringify(value)
      .replace(/29/g, '九九')
      .replace(/49/g, '九九九九')
  }
  // 预览值展示
  private get showInputVal() {
    const arr = this.setListArr.map((q: any) => {
      return q.text
    })
    return arr.join('')
  }
  // 格式预览监听
  setListOpen(key: any, index: any, item: any) {
    this.setListIndex = key
    this.setListIndexNew = index
    if (index === 0) {
      this.clickFirstItem = true
    } else {
      this.clickFirstItem = false
    }
    this.setListIndexItem = item
  }
  // 数组中是否有某对象
  hasObject(arr: any, key: string) {
    const result = arr.some((item: any) => {
      if (item.label === key) {
        return true
      }
    })
    return result
  }
  hasIndex(arr: any, key: string) {
    const result = arr.map((item: any) => {
      if (item.label === key) {
        return item
      }
    })
    result.sort((a: any, b: any) => {
      return b.index - a.index
    })
    return result[0] ? result[0].index : '0'
  }
  // 添加列表对象
  addSetFun(value: string) {
    switch (value) {
      case 'year': {
        const isTrue = this.hasObject(this.setListArr, '年份')
        if (!isTrue) {
          this.setListArr.push(this.defaultSetListArr[0])
          this.objDisabled.year = true
        }
        break
      }
      case 'code': {
        const isCode = this.hasObject(this.setListArr, '编号')
        if (!isCode) {
          this.setListArr.push(this.defaultSetListArr[1])
          this.objDisabled.code = true
        }
        break
      }
      default: {
        const isIndex = this.hasIndex(this.setListArr, '代码')
        if (isIndex !== '0') {
          this.formatValList.push({
            index: Number(isIndex) + 1,
            value: 'A',
            text: 'A'
          })
          const newObj = JSON.parse(JSON.stringify(this.defaultSetListArr[2]))
          newObj.index = (Number(isIndex) + 1).toString()
          newObj.value = 'A'
          newObj.text = 'A'
          this.setListArr.push(newObj)
        } else {
          this.formatValList = [
            {
              index: 3,
              value: 'A',
              text: 'A'
            }
          ]
          this.setListArr.push(this.defaultSetListArr[2])
        }
      }
    }
    if (this.setListArr && this.setListArr.length > 1) {
      // this.setListIndex = (Number(this.setListIndex) + 1).toString()
      this.setListIndex = this.setListArr.length.toString()
      this.setListIndexNew = this.setListArr.length - 1
    }
  }
  // 删除列表对象
  deleteSetItem() {
    if (this.setListArr.length === 0) return
    if (this.setListIndexNew === 0 && !this.clickFirstItem) {
      this.setListArr.splice(Number(this.setListIndex) - 1, 1)
    } else {
      this.setListArr.splice(this.setListIndexNew, 1)
    }
    this.objDisabledFun()
    this.formatValList = [
      {
        index: 3,
        value: 'A',
        text: 'A'
      }
    ]

    if (this.setListArr && this.setListArr.length > 0) {
      this.setListIndex = (Number(this.setListIndex) - 1).toString()
    }
    if (this.setListIndexNew > 0) {
      this.setListIndexNew = Number(this.setListIndexNew) - 1
    }
  }
  // 按钮禁止操作
  objDisabledFun() {
    const resultA = this.hasObject(this.setListArr, '年份')
    const resultB = this.hasObject(this.setListArr, '编号')
    if (!resultA) {
      this.objDisabled.year = false
    } else {
      this.objDisabled.year = true
    }
    if (!resultB) {
      this.objDisabled.code = false
    } else {
      this.objDisabled.code = true
    }
  }
  // 移动方法
  swapItemsFun(arr: any, index1: any, index2: any) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
  }
  // 向上移动
  topMoveFun() {
    if (this.setListArr.length > 1 && this.setListIndexNew !== 0) {
      this.swapItemsFun(this.setListArr, this.setListIndexNew, this.setListIndexNew - 1)
      this.setListIndexNew = this.setListIndexNew - 1
    }
  }
  // 向下移动
  bottomMoveFun() {
    if (this.setListArr.length > 1 && this.setListIndexNew < this.setListArr.length - 1) {
      this.swapItemsFun(this.setListArr, this.setListIndexNew, this.setListIndexNew + 1)
      this.setListIndexNew = this.setListIndexNew + 1
    }
  }
  // 编辑项目
  editProject() {
    this.loading.start()
    const data = {
      canFromCancel: true,
      prjTypeDefineId: this.prjTypeDefineId,
      prjTypeFormat: this.showInputVal,
      prjTypeName: this.valName
    }
    editProject(data)
      .then((res: any) => {
        this.$message.success('保存成功')
        this.$emit('upList')
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 弹窗值赋值给项目
  trueValue() {
    this.showCodeDialog = false
    this.editProject()
  }
  openDialog() {
    this.showCodeDialog = true
    this.setListIndexNew = 0
  }
}
</script>

<style lang="scss" scoped>
$backgroundCorlor: #f5f7fa;
.project-number {
  height: 100%;
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 20px 40px;
    }
    .el-dialog__footer {
      // padding: 14px !important;
    }
    .el-dialog__header {
      border-bottom: solid 1px #e6ebf5;
    }
    .el-dialog__footer {
      // border-top: solid 1px #e6ebf5;
    }
  }

  .box-card {
    .clearfix {
      padding: 0 0 10px 0;
    }
  }
  .col-one {
    padding: 0 0 20px 0 !important;
  }
  .businessWrap {
    height: 100%;
    display: flex;
    margin-top: 10px;
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
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .title {
        margin: 12px 0 10px 0;
      }
      .el-menu-vertical-demo {
        height: calc(100% - 55px);
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
        height: 100%;
        display: flex;
        .vertical {
          height: 100%;
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
      width: 640px !important;
    }
    .set {
      .set-list {
        height: 237px;
        overflow-y: auto;
      }
      .set-button {
        display: flex;
        flex-direction: column;
        ::v-deep .el-button {
          margin: 0 0 8px 0;
        }
      }
      .mt-group {
        margin: 17px 0 -10px 0;
      }
    }
    .edit {
      // height: 403px;

      .content {
        height: 236px;
        background-color: $backgroundCorlor;
        .title {
          padding: 20px 0 0 10px;
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
        height: 236px;
        background-color: $backgroundCorlor;
        .title {
          padding: 20px 0 0 10px;
        }
        .input-format {
          padding: 12px 10px;
        }
      }
      .content-code {
        height: 236px;
        background-color: $backgroundCorlor;
        .title {
          padding: 20px 0 0 10px;
        }
        .select-max {
          margin: 12px;
        }
        .title-radio {
          margin: 10px 0 0 10px;
        }
        .code-radio {
          margin: 0 0 0 20px;
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
