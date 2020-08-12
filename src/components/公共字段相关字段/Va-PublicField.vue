<!-- 公共字段 -->
<template>
  <div class="content">
    <div class="public-left">
      <div class="flex-row file-btn">
        <div v-show="!fieldShow">
          <el-button v-show="false" type="text" class="el-ml-4">
            <svg-icon icon-class="ic-plus" class="icon-size-20" />
          </el-button>
        </div>
        <el-tooltip content="搜索" class="el-mr-4">
          <el-button v-show="!fieldShow" icon="el-icon-search icon-size-20" type="text" @click="fieldShow = true" />
        </el-tooltip>
        <div v-show="fieldShow" class="flex-row el-px-4">
          <el-tooltip content="返回">
            <el-button type="text" icon="el-icon-back icon-size-20" @click="fieldShow = false" />
          </el-tooltip>
          <el-input v-model="keyWord" placeholder="请输入关键词检索..." clearable prefix-icon="el-icon-search" />
        </div>
      </div>
      <div class="field-list">
        <div v-for="(item, index) in tabelData" :key="index" v-clickDown="index" class="field-item" :class="{ active: activeIndex === index }" @click="getField(item, index)">
          <svg-icon icon-class="icf-file-text" class="field-icon" />
          <span v-if="item.publicFldName.length <= 14">{{ item.publicFldName }}</span>
          <el-tooltip v-else :content="item.publicFldName" placement="right">
            <span class="line-limit">{{ item.publicFldName }}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="right-content">
      <div>
        <span style="fontSize:16px !important">{{ filedData.publicFldName }}</span>
        <el-divider direction="vertical" class="el-mx-4" />
        <span>{{ filedData.publicFldId }}</span>
        <el-divider class="el-my-4" />
        <div class="line-title">
          <el-divider direction="vertical" class="border-blue" />
          <span>输入表格字段</span>
        </div>
        <Treeselect v-model="filedData.fldId" :disable-branch-nodes="true" placeholder="请选择" :options="inputData" :show-count="true" z-index="99" :match-keys="['label', 'id']" @select="handleChange($event, filedData)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator'
// import {
//   getPublicFieldList,
//   getKeytypecodePublicField,
//   setKeytypecodePublicField,
//   deleteRolePublicField
// } from '@/api/tree-data/filedOperation'
// import { getInputTree } from '@/api/tree-data/input-form'
// import { ModuleState } from '@/store/modules/module'
@Component({
  name: 'PublicField',
  directives: {
    clickDown: {
      inserted(el, binding, index) {
        if (binding.value === 0) {
          el.click()
        }
      }
    }
  }
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private publicData: any = []
  private publicDatas: any = [
    {
      code: '1278151633959456770',
      fldId: 'Fld_19_3',
      id: '1273868291588042753',
      isBoxFld: null,
      publicFldDataTypeId: null,
      publicFldId: 'PrjName',
      publicFldLength: 3,
      publicFldName: '名称'
    },
    {
      code: '1278151633959456770',
      fldId: 'Fld_19_3',
      id: '1273868291588042753',
      isBoxFld: null,
      publicFldDataTypeId: null,
      publicFldId: 'PrjName',
      publicFldLength: 3,
      publicFldName: '名称'
    }
  ]
  private tmpTabelData: any = []
  private inputData: any = [] // 输入表数据
  private filedData: any = [] // 点击字段信息
  private keyWord: string = ''
  private activeIndex = 0 // 点击字段列表的下标
  private fieldShow = false
  // 获取 keytypecode
  // private get keytypecode() {
  //   return ModuleState.opId
  // }
  get tabelData() {
    return this.publicDatas.filter((data: any) => !this.keyWord || data.publicFldName.toLowerCase().includes(this.keyWord.toLowerCase()) || data.publicFldId.toLowerCase().includes(this.keyWord.toLowerCase()))
  }
  created() {
    // getPublicFieldList().then((res: any) => {
    //   this.tmpTabelData = res.data
    // })
    // this.$nextTick(() => {
    //   this.getFieldTableList(this.keytypecode)
    // })
  }
  mounted() {}
  // @Watch('keytypecode')
  // getFieldTableList(val: number) {
  //   this.publicData = []
  //   getKeytypecodePublicField(val).then((res: any) => {
  //     this.publicData = res.data
  //     this.tmpTabelData.forEach((el: any) => {
  //       this.publicData.forEach((item: any) => {
  //         if (el.publicFldId === item.publicFldId) {
  //           el.fldId = item.fldId
  //           el.code = item.id
  //         }
  //       })
  //     })
  //     this.publicDatas = this.tmpTabelData
  //   })
  //   getInputTree(val).then((res: any) => {
  //     this.inputData = res.data
  //     this.inputData.unshift({ label: '无', id: -1 })
  //   })
  // }
  // // 遍历树形数据 返回本身以及父节点不包含子节点的数据
  // filterTree(val: any, data: any, arr: any = [], obj: any = {}) {
  //   data.map((item: any) => {
  //     if (item.children) {
  //       obj = { id: item.id, label: item.label }
  //       this.filterTree(val, item.children, arr, obj)
  //     }
  //     if (item.label === val) {
  //       arr.push(item, obj)
  //     }
  //   })
  //   return arr
  // }
  // handleChange(val: any, row: any) {
  //   if (val.id !== -1) {
  //     let data = {
  //       field: {
  //         fldId: val.id,
  //         formId: this.filterTree(val.label, this.inputData)[1].id,
  //         publicFldId: row.publicFldId,
  //         keyTypeCode: this.keytypecode
  //       },
  //       keyTypeCode: this.keytypecode
  //     }
  //     this.loading.start()
  //     setKeytypecodePublicField(data)
  //       .then((res: any) => {
  //         this.$message.success('修改成功')
  //       })
  //       .finally(() => {
  //         this.loading.close()
  //       })
  //   } else if (val.id === -1) {
  //     let id = row.code
  //     this.loading.start()
  //     deleteRolePublicField(id)
  //       .then((res: any) => {
  //         this.$message.success('修改成功')
  //       })
  //       .finally(() => {
  //         this.loading.close()
  //       })
  //   }
  // }
  getField(row: any, index: number) {
    this.activeIndex = index
    this.filedData = row
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  display: flex;
  .public-left {
    width: 240px;
    height: 100%;
    border-right: 1px solid #dfe6ec;
    .file-btn {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #dfe6ec;
      ::v-deep .el-input--small {
        .el-input__inner {
          width: 185px;
          height: 24px;
          line-height: 24px;
          border-radius: 0px;
        }
        .el-input__icon {
          line-height: 24px;
        }
      }
    }
  }
  .field-list {
    height: calc(100vh - 169px);
    overflow-y: auto;
    overflow-x: hidden;
    .field-item {
      width: 240px;
      height: 32px;
      line-height: 32px;
      padding-left: 16px;
      &:hover {
        background: #f5f7fa;
        cursor: pointer;
      }
      .field-icon {
        width: 16px;
        height: 16px;
        color: #40a9ff;
        margin-right: 3px;
      }
      .line-limit {
        max-width: 180px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .active {
      background: #edf6ff;
    }
  }
  .right-content {
    width: 100%;
    height: 100%;
    padding: 24px 24px 0;
    .line-title {
      height: 20px;
      display: flex;
      align-items: center;
      .border-blue {
        width: 3px;
        height: 14px;
        background: rgba(24, 144, 255, 1);
      }
    }
    ::v-deep .vue-treeselect {
      width: 209px;
      height: 28px;
      margin: 30px 0 0 16px;
    }
    ::v-deep .vue-treeselect__placeholder,
    ::v-deep .vue-treeselect__single-value {
      line-height: 28px;
    }
    ::v-deep .vue-treeselect__control {
      height: 28px;
      border-radius: 0px;
    }
  }
}
.el-table::before {
  z-index: inherit;
  height: 0;
}
::v-deep .el-table .cell {
  overflow: visible !important;
}
.flex-row {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
::v-deep .vue-treeselect__menu {
  border-radius: 0px !important;
}
</style>
