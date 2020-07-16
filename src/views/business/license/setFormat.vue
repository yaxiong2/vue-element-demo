<template>
  <div class="project-number">
    <!-- dialog-业务编号格式设置 -->
    <el-dialog class="code-dialog" title="许可证号格式设置" :visible.sync="showCodeDialog" width="42%">
      <el-row :gutter="15" type="flex" justify="space-between">
        <el-col :span="12">
          <div class="box-card col-one">
            <div slot="header" class="clearfix">
              <span>许可证号名称</span>
            </div>
            <el-input v-model="valName" />
          </div>
          <div class="box-card set">
            <div slot="header" class="clearfix">
              <span>许可证号格式设置</span>
            </div>
            <el-row type="flex" :gutter="12">
              <el-col :span="15">
                <el-card class="box-card set-list">
                  <el-menu :default-active="setListIndex" class="el-menu-vertical-demo">
                    <span v-for="(item, index) in setListArr" :key="item.index">
                      <el-menu-item
                        v-if="item.label !== '索引'"
                        :index="item.index"
                        @click="setListOpen(item.index, index, item)"
                      >
                        <i :class="item.icon" />
                        <span slot="title">{{ item.value }}</span>
                      </el-menu-item>

                      <span v-else>
                        <el-menu-item
                          class="menu-index-item"
                          :index="item.index"
                          @click="setListOpen(item.index, index, item)"
                        >
                          <svg-icon v-if="!showIndexList" icon-class="icf-dir-right" @click="showIndexListFun(true)" />
                          <svg-icon v-else icon-class="icf-dir-bottom" @click="showIndexListFun(false)" />
                          <svg-icon class="svg-icon-style" icon-class="ic-attachment" />
                          <span slot="title">索引</span>
                        </el-menu-item>
                        <div v-show="showIndexList" class="show-index-list">
                          <el-menu
                            :default-active="indexesListActive"
                            class="el-menu-vertical-demo"
                            :class="!isIndexes ? 'no-active' : ''"
                          >
                            <el-menu-item
                              v-for="(items, indexs) in indexesListArr"
                              :key="items.index"
                              :index="items.index.toString()"
                              @click="indexesItemFun(indexs, items)"
                            >
                              <svg-icon icon-class="icl-wrench" class="svg-icon-style" />
                              <span slot="title">{{ items.licenseIndexName }}</span>
                            </el-menu-item>
                          </el-menu>
                        </div>
                      </span>
                    </span>
                  </el-menu>
                </el-card>
                <div class="move-btn">
                  <el-button size="mini" plain icon="el-icon-top" @click="topMoveFun()">上移</el-button>
                  <el-button size="mini" plain icon="el-icon-bottom" @click="bottomMoveFun()">下移</el-button>
                </div>
              </el-col>
              <el-col :span="9">
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
                  <el-button
                    size="mini"
                    plain
                    :disabled="objDisabled.index"
                    @click="addSetFun('index')"
                  >添加索引</el-button>
                  <el-button
                    size="mini"
                    plain
                    :disabled="objDisabled.indexVal"
                    @click="addSetFun('indexVal')"
                  >添加索引值</el-button>
                  <el-button
                    size="mini"
                    plain
                    class="delete_bottom"
                    icon="el-icon-delete"
                    @click="deleteSetItem"
                  >删除</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="box-card col-one">
            <div slot="header" class="clearfix">
              <span>许可证号格式</span>
            </div>
            <el-input disabled :value="showInputVal" />
          </div>
          <div class="box-card edit">
            <div slot="header" class="clearfix">
              <span>格式输入</span>
            </div>
            <div v-show="setListIndexItem.label === '年份' && !isIndexes" class="content">
              <div class="title">请选择年份表达式：</div>
              <el-radio-group v-model="yearRadio" class="edit-radio">
                <el-radio :label="99">数字2位年份：99</el-radio>
                <el-radio :label="9999">数字4位年份：1999</el-radio>
                <el-radio :label="29">汉子两位年份：九九</el-radio>
                <el-radio :label="49">汉子4位年份：一九九九</el-radio>
              </el-radio-group>
            </div>
            <div v-show="setListIndexItem.label === '编号' && !isIndexes" class="content-code">
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
            <div v-show="setListIndexItem.label === '代码' && !isIndexes" class="content-format">
              <div class="title">输入代码内容：</div>
              <span v-for="item in formatValList" :key="item.index">
                <el-input
                  v-if="item.index === setListIndex || item.index === Number(setListIndex)"
                  v-model="item.value"
                  class="input-format"
                  placeholder="请输入"
                />
              </span>
            </div>
            <div v-show="setListIndexItem.label === '索引' || isIndexes" class="content-format">
              <div class="title">输入索引值：</div>
              <span v-for="item in indexesListArr" :key="item.licenseIndexId">
                <el-input
                  v-if="item.index === Number(indexesListIndex)"
                  v-model="item.licenseIndexName"
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

interface interfaceProject {
  licenseId: number
  licenseName: string
  licenseFormat: string
}

@Component({
  name: 'setFormat'
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  @Prop() private project!: any
  @Prop({ default: '' }) private licenseFormat!: string
  @Prop({ default: '' }) private licenseName!: string
  @Prop({ default: 0 }) private licenseId!: number
  // dialog
  private showCodeDialog: boolean = false
  private yearRadio: number = 9999
  private formatVal: string = ''
  private showYear: boolean = false
  private showCode: boolean = false
  private showformat: boolean = false
  private setListIndex: string = '1'
  private clickFirstItem: boolean = false
  private setListIndexItem: any = {}
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
    code: false,
    index: false,
    indexVal: true
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
    },
    {
      icon: '',
      label: '索引',
      index: '4',
      value: '索引',
      text: '%索引%'
    }
  ]
  private setListArr: any[] = []
  private formatItemsVal: any = ''
  private valName: string = this.licenseName
  // 索引
  private showIndexList: boolean = false
  private indexesListIndex: string = '1'
  private indexesValdeafult: object = {
    licenseId: 1,
    licenseIndexId: 1,
    licenseIndexName: 'A',
    index: 1
  }

  private indexesListArr: object[] = []
  private isIndexes: boolean = false
  private indexesClickIndex: number = 1
  private indexesListActive: string = '2'
  private secondTrue: boolean = false
  // 编号格式计算
  private get codeValEnd() {
    const codeMax = 10 ** Number(this.codeMaxVal)
    const codeVal = this.codeRadio ? codeMax - 1 : JSON.stringify(codeMax).replace(/1/, '')
    return codeVal
  }
  @Watch('licenseName')
  changeFormatItemsName(val: any) {
    this.valName = val
  }
  reverseFormat(format: string) {
    let partArray: Array<any> = []
    let parts = format.split(/#|%|\\/)
    for (var i = 0; i < parts.length; i++) {
      let part = parts[i]
      switch (format.indexOf(part)) {
        case 0: {
          format = format.slice(part.length)
          partArray.push({ value: part, text: '代码' })
          break
        }
        case 1: {
          let type = format.slice(0, 1)
          format = format.slice(part.length + 2)
          switch (type) {
            case '\\':
              partArray.push({ value: part, text: '年份' })
              break
            case '#':
              partArray.push({ value: part, text: '编号' })
              break
            case '%':
              partArray.push({ value: part, text: '索引' })
              break
          }
          break
        }
      }
    }
    return partArray
  }

  // 监听编号格式字符串分别赋值
  @Watch('licenseId')
  changeLicenseId(val: any) {
    let value: any = this.licenseFormat
    let news: any = this.reverseFormat(value)
    this.setListIndex = '1'
    this.setListIndexItem.label = '年份'
    this.setListArr = []
    news.map((q: any) => {
      switch (q.text) {
        case '年份': {
          if (q.value) {
            switch (q.value) {
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
            newObj.text = `\\${q.value}\\`
            this.setListArr.push(newObj)
          }
          break
        }
        case '编号': {
          let code = q.value
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
          break
        }
        case '索引': {
          const indexObj = JSON.parse(JSON.stringify(this.defaultSetListArr[3]))
          indexObj.index = (this.setListArr.length + 1).toString()
          this.setListArr.push(indexObj)
          this.objDisabled.index = true
          this.objDisabled.indexVal = false
          break
        }
        case '代码': {
          if (!q.value) return
          const formIndex = this.hasIndex(this.setListArr, '代码')
          const isIndex = this.setListArr.length.toString()
          if (formIndex !== '0') {
            this.formatValList.push({
              index: Number(isIndex) + 1,
              value: q.value,
              text: q.value
            })
          } else {
            this.formatValList[0].index = Number(isIndex) + 1
            this.formatValList[0].value = q.value
            this.formatValList[0].text = q.value
          }
          const newObj = JSON.parse(JSON.stringify(this.defaultSetListArr[2]))
          newObj.index = (this.setListArr.length + 1).toString()
          newObj.value = q.value
          newObj.text = q.value
          this.setListArr.push(newObj)
        }
      }
    })
    this.objDisabledFun()
  }

  // 监听代码input输入
  @Watch('formatValList', { deep: true })
  changeFormatValList(value: any) {
    const indexNew = this.setListIndexNew
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
  setListOpen(key: any, index: any, item: any) {
    this.indexesListActive = '0'
    this.setListIndex = key
    this.setListIndexNew = index
    if (index === 0) {
      this.clickFirstItem = true
    } else {
      this.clickFirstItem = false
    }
    this.setListIndexItem = item
    this.isIndexes = false
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
  // 对象数组根据某id排序
  maxIndex(arr: any, id: string) {
    let result = JSON.parse(JSON.stringify(arr))
    result.sort((a: any, b: any) => {
      return b[id] - a[id]
    })
    return result[0]
  }
  // 添加列表对象
  addSetFun(value: string) {
    const getId: any = this.maxIndex(this.setListArr, 'index')
    const indexId = getId ? Number(getId.index) : this.setListArr.length
    switch (value) {
      case 'year': {
        const isTrue = this.hasObject(this.setListArr, '年份')
        if (!isTrue) {
          const newObj = JSON.parse(JSON.stringify(this.defaultSetListArr[0]))
          newObj.index = (indexId + 1).toString()
          this.setListArr.push(newObj)
          this.objDisabled.year = true
          this.isIndexes = false
          this.setListIndexItem.label = '年份'
        }
        break
      }
      case 'code': {
        const isCode = this.hasObject(this.setListArr, '编号')
        if (!isCode) {
          const newObj = JSON.parse(JSON.stringify(this.defaultSetListArr[1]))
          newObj.index = (indexId + 1).toString()
          this.setListArr.push(newObj)
          this.objDisabled.code = true
          this.isIndexes = false
          this.setListIndexItem.label = '编号'
        }
        break
      }
      case 'format': {
        const formIndex = this.hasIndex(this.setListArr, '代码')
        if (!this.isIndexes && !this.secondTrue) {
          this.setListIndexItem.label = '代码'
        }
        this.isIndexes = false
        this.secondTrue = true
        const isIndex = indexId
        const newObj = JSON.parse(JSON.stringify(this.defaultSetListArr[2]))
        newObj.index = (isIndex + 1).toString()
        newObj.value = 'A'
        newObj.text = 'A'
        this.setListArr.push(newObj)
        if (formIndex !== '0') {
          this.formatValList.push({
            index: isIndex + 1,
            value: 'A',
            text: 'A'
          })
        } else {
          this.formatValList = [
            {
              index: isIndex + 1,
              value: 'A',
              text: 'A'
            }
          ]
        }
        break
      }
      case 'index': {
        const indexObj = JSON.parse(JSON.stringify(this.defaultSetListArr[3]))
        indexObj.index = (indexId + 1).toString()
        this.setListArr.push(indexObj)
        this.objDisabled.index = true
        this.objDisabled.indexVal = false
        // this.setListIndexItem.label = '索引'
        break
      }
      case 'indexVal': {
        const objNew = JSON.parse(JSON.stringify(this.indexesValdeafult))
        const indexesId = this.maxIndex(this.indexesListArr, 'index')
        delete objNew.licenseIndexId
        objNew.index = indexesId ? indexesId.index + 1 : 1
        objNew.licenseId = this.licenseId
        this.indexesListArr.push(objNew)
        this.showIndexList = true
        // this.setListIndexItem.label = '索引'
        break
      }
      default: {
      }
    }
    if (this.setListArr && this.setListArr.length > 1 && value !== 'indexVal') {
      // this.setListIndex = this.setListArr.length.toString()
      // this.setListIndexNew = this.setListArr.length - 1
      this.setListIndex = (indexId + 1).toString()
      this.setListIndexNew = indexId
    }
  }
  // 删除列表对象
  deleteSetItem() {
    if (!this.isIndexes) {
      if (this.setListArr.length === 0) return
      if (this.setListIndexNew === 0 && !this.clickFirstItem) {
        this.setListArr.splice(Number(this.setListIndex) - 1, 1)
      } else {
        this.setListArr.splice(this.setListIndexNew, 1)
      }
      this.objDisabledFun()
      this.filterFormatValList()
    } else {
      this.deleteIndexesItem()
    }
  }
  // 代码列表筛选
  filterFormatValList() {
    this.formatValList = this.formatValList.filter((item: any) => {
      return item.index !== Number(this.setListIndex)
    })
    if (this.setListArr && this.setListArr.length > 0) {
      this.setListIndex = (Number(this.setListIndex) - 1).toString()
    }
    if (this.setListIndexNew > 0) {
      this.setListIndexNew = Number(this.setListIndexNew) - 1
    }
  }
  deleteIndexesItem() {
    if (this.indexesListArr.length === 0) return
    this.indexesListArr.splice(this.indexesClickIndex, 1)
    if (this.indexesClickIndex > 0) {
      this.indexesClickIndex = Number(this.indexesClickIndex) - 1
    }
  }
  // 按钮禁止操作
  objDisabledFun() {
    const resultA = this.hasObject(this.setListArr, '年份')
    const resultB = this.hasObject(this.setListArr, '编号')
    const resultC = this.hasObject(this.setListArr, '索引')
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
    if (!resultC) {
      this.objDisabled.index = false
      this.objDisabled.indexVal = true
    } else {
      this.objDisabled.index = true
      this.objDisabled.indexVal = false
    }
  }
  // 移动方法
  swapItemsFun(arr: any, index1: any, index2: any) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
  }
  // 向上移动
  topMoveFun() {
    if (!this.isIndexes) {
      if (this.setListArr.length > 1 && this.setListIndexNew !== 0) {
        this.swapItemsFun(this.setListArr, this.setListIndexNew, this.setListIndexNew - 1)
        this.setListIndexNew = this.setListIndexNew - 1
      }
    } else {
      if (this.indexesListArr.length > 1 && this.indexesClickIndex) {
        this.swapItemsFun(this.indexesListArr, this.indexesClickIndex, this.indexesClickIndex - 1)
        this.indexesClickIndex = this.indexesClickIndex - 1
      }
    }
  }
  // 向下移动
  bottomMoveFun() {
    if (!this.isIndexes) {
      if (this.setListArr.length > 1 && this.setListIndexNew < this.setListArr.length - 1) {
        this.swapItemsFun(this.setListArr, this.setListIndexNew, this.setListIndexNew + 1)
        this.setListIndexNew = this.setListIndexNew + 1
      }
    } else {
      if (this.indexesListArr.length > 1 && this.indexesClickIndex < this.indexesListArr.length - 1) {
        this.swapItemsFun(this.indexesListArr, this.indexesClickIndex, this.indexesClickIndex + 1)
        this.indexesClickIndex = this.indexesClickIndex + 1
      }
    }
  }
  // 弹窗值赋值给项目
  trueValue() {
    this.project.licenseFormat = this.showInputVal
    this.showCodeDialog = false
    this.editProject()
    this.editIndexVal()
  }
  // 编辑
  editProject() {
    this.loading.start()
    const data = {
      licenseId: this.licenseId,
      licenseFormat: this.showInputVal,
      licenseName: this.valName
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

  // 索引值列表接口请求
  indexList() {
    indexList(this.project.licenseId).then((res: any) => {
      this.indexesListArr = res.data.map((q: any, index: number) => {
        if (q) {
          q.index = index + 1
        }
        return q
      })
      if (!res.data.length) {
        this.showIndexList = false
      }
    })
  }
  // 编辑许可证索引值
  editIndexVal() {
    this.loading.start()
    let data = {
      licenseId: this.licenseId,
      opLicenseIndices: this.indexesListArr
    }
    editIndexVal(data)
      .then((res: any) => {})
      .finally(() => {
        this.loading.close()
      })
  }

  // 点击索引展开列表
  showIndexListFun(item: boolean) {
    this.showIndexList = item
  }
  // 索引值列表点击
  indexesItemFun(index: number, item: any) {
    this.isIndexes = true
    this.indexesListIndex = item.index
    this.indexesClickIndex = index
    this.setListIndex = '0'
  }
  created() {}
  openDialog() {
    this.showCodeDialog = true
    this.indexList()
    this.setListIndexNew = 0
    this.formatValList = [
      {
        index: 3,
        value: 'A',
        text: 'A'
      }
    ]
    this.showIndexList = false
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
    .el-dialog__header {
      border-bottom: solid 1px #e6ebf5;
    }
    .el-dialog__footer {
      // border-top: solid 1px #e6ebf5;
    }
    .el-button--mini {
      padding: 7px 9px;
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
      width: 640px !important;
    }
    .set {
      // margin: 10px 0 0 0;
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
          margin: 0 0 11px 0;
        }
        .delete_bottom {
          margin: 0 !important;
        }
      }
      .mt-group {
        margin: 25px 0 -10px 0;
      }
      .move-btn {
        display: flex;
        justify-content: space-between;
        margin: 12px 0 0 0;
        ::v-deep .el-button {
          padding: 7px 12px;
        }
      }
    }
    .edit {
      // height: 407px;
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
          padding: 20px 10px;
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
