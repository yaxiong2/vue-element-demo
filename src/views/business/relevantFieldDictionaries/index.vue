<!-- 相关字段字典 -->
<template>
  <div class="content-box__gap">
    <div class="header-flex el-pa-3">
      <h1 class="large">
        <svg-icon icon-class="icl-stored" />字段名称
      </h1>
      <el-input
        v-model="search"
        style="width:185px;margin:0 10px"
        placeholder="输入进行过滤..."
        @change="update($event)"
      />
      <div class="header-right">
        <el-button type="primary" icon="el-icon-plus" @click="dialogVisibleField = true">新增</el-button>
      </div>
    </div>

    <el-table
      :data="tableData.filter(data => !search || data.relationFldName.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      height="calc(100% - 40px)"
      highlight-current-row
      @row-click="getCurrentLine"
    >
      <el-table-column label="相关字段名称" prop="relationFldName" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            class="btn-no-padding"
            @click="updata(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="btn-delete btn-no-padding"
            @click="deleteField(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改相关字段" :visible.sync="updateDialog">
      <el-form ref="fieldInfo" :model="fieldInfo" status-icon label-width="80px" label-position="left">
        <el-form-item label="字段编号" prop="code">
          <el-input v-model="fieldInfo.relationFldId" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item
          label="字段名称"
          prop="name"
          class="el-mb-0"
          :rules="[{ required: true, message: '请填写字段名称', trigger: 'blur' }]"
        >
          <el-input v-model="fieldInfo.relationFldName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveData">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加相关字段" :visible.sync="dialogVisibleField">
      <el-form label-position="left" label-width="80px" :model="fieldFormData">
        <el-form-item
          label="字段名称"
          class="el-mb-0"
          :rules="[{ required: true, message: '请填写字段名称', trigger: 'blur' }]"
        >
          <el-input v-model="fieldFormData.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleField = false">取 消</el-button>
        <el-button type="primary" @click="addFieldSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator'
import {
  getRelevantFieldList,
  setRelationField,
  deleteRelationField
} from '@/api/tree-data/filedOperation'
@Component({
  name: 'publicField'
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private tableData: any = []
  private search: string = ''
  private dialogVisibleField: boolean = false // 添加字段
  private updateDialog: boolean = false // 修改字段
  private fieldFormData: any = {
    code: '',
    name: '',
    length: ''
  }
  private fieldInfo: any = {}

  update(e: any) {
    this.$forceUpdate()
  }
  created() {
    this.getRelevantField()
  }

  // 获取所有相关字段
  getRelevantField() {
    getRelevantFieldList().then((res: any) => {
      this.tableData = res.data
    })
  }
  // 获取点击表格当前行
  getCurrentLine(row: any) {
    this.fieldInfo = row
  }
  // 修改字段
  updata(row: any) {
    this.fieldInfo = row
    this.updateDialog = true
  }
  //  删除字段功能
  deleteField(row: any) {
    this.$confirm('确定要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading.start()
        deleteRelationField([row.relationFldId])
          .then((res: any) => {
            this.$message.success('删除成功')
            this.getRelevantField()
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
  // 添加相关字段
  addFieldSave() {
    this.loading.start()
    let data: object = {
      relationFldDataTypeId: null,
      relationFldId: this.fieldFormData.code,
      relationFldName: this.fieldFormData.name
    }
    setRelationField(data)
      .then((res: any) => {
        this.$message.success('添加成功')
        this.getRelevantField()
        this.dialogVisibleField = false
      })
      .finally(() => {
        this.loading.close()
      })
  }
  // 保存数据
  saveData() {
    this.loading.start()
    setRelationField(this.fieldInfo)
      .then((res: any) => {
        this.$message.success('修改成功')
      })
      .finally(() => {
        this.updateDialog = false
        this.loading.close()
      })
  }
}
</script>
<style lang='scss' scoped>
.app-container {
  height: 100%;
}
.el-table::before {
  z-index: inherit;
  height: 0;
}
.header-flex{
  padding-top:12px;
  padding-bottom: 12px;
}
</style>
