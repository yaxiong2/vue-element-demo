<!-- 公共字段字典 -->
<template>
  <div class="app-container">
    <div class="header-flex">
      <h1 class="large">
        <svg-icon icon-class="icl-stored" />字段名称
      </h1>
      <el-input
        v-model="search"
        style="width:185px;margin:0 10px"
        placeholder="输入进行过滤..."
        @change="update($event)"
      />
      <!-- <div class="header-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="dialogVisibleField = true"
        >新增</el-button>
      </div>-->
    </div>

    <el-table
      :data="tableData.filter(data => !search || data.publicFldName.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      height="calc(100% - 40px)"
      highlight-current-row
    >
      <el-table-column label="公共字段名称" prop="publicFldName" />
      <el-table-column label="英文标识" prop="publicFldId" width="120" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            class="btn-no-padding"
            @click="updata(scope.row)"
          >修改</el-button>
          <!-- <el-button type="text" icon="el-icon-delete" class="btn-delete btn-no-padding" @click="deleteField(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改公共字段" :visible.sync="updateDialogPublic" width="30%">
      <el-form ref="fieldInfo" :model="fieldInfo" status-icon label-width="100px">
        <el-form-item label="字段名称">
          <el-input v-model="fieldInfo.publicFldName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="英文标识">
          <el-input v-model="fieldInfo.publicFldId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="字段类型">
          <el-input v-model="fieldInfo.type" disabled />
        </el-form-item>
        <el-form-item label="字段长度">
          <el-input v-model="fieldInfo.publicFldLength" autocomplete="off" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogPublic=false">取 消</el-button>
        <el-button type="primary" @click="saveData">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加公共字段" :visible.sync="dialogVisibleField">
      <el-form ref="addForm" label-width="80px" :model="fieldFormData">
        <el-form-item
          label="字段名称"
          prop="name"
          :rules="[{ required: true, message: '请填写字段名称 如 项目建设', trigger: 'blur' }]"
        >
          <el-input v-model="fieldFormData.name" />
        </el-form-item>
        <el-form-item
          label="英文标识"
          prop="code"
          :rules="[{ required: true, message: '请填写英文标识 如 PrjBuild', trigger: 'blur' }]"
        >
          <el-input v-model="fieldFormData.code" />
        </el-form-item>
        <el-form-item label="字段类型">
          <el-input v-model="fieldFormData.type" disabled />
        </el-form-item>
        <el-form-item label="字段长度">
          <el-input v-model="fieldFormData.length" />
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
  getPublicFieldList,
  setPublicField,
  deletePublicField
} from '@/api/tree-data/filedOperation'
@Component({
  name: 'publicField'
})
export default class extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private tableData: any = []
  private search: string = ''
  private dialogVisibleField: boolean = false // 添加字段
  private updateDialogPublic: boolean = false // 修改字段
  private fieldFormData: any = {
    code: '',
    name: '',
    type: 'varchar',
    length: 100
  }
  private fieldInfo: any = {}

  update(e: any) {
    this.$forceUpdate()
  }
  created() {
    this.getPublicField()
  }

  // 获取所有公共字段
  getPublicField() {
    getPublicFieldList().then((res: any) => {
      this.tableData = res.data.sort((a: any, b: any) => {
        return a.publicFldId - b.publicFldId
      })
      this.tableData.map((item: any) => {
        if (item.publicFldDataTypeId === 1) {
          item.type = 'varchar'
        }
      })
    })
  }
  //  删除字段功能
  // deleteField(row: any) {
  //   this.$confirm('此操作将永久删除该字段, 是否继续?', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   })
  //     .then(() => {
  //       this.loading.start()
  //       deletePublicField(row.publicFldId)
  //         .then((res: any) => {
  //             this.$message.success('删除成功')
  //             this.getPublicField()
  //         })
  //         .finally(() => {
  //           this.loading.close()
  //         })
  //     })
  //     .catch(() => {
  //       this.$message({
  //         type: 'info',
  //         message: '已取消删除'
  //       })
  //     })
  // }
  // 添加公共字段
  // addFieldSave() {
  //   this.loading.start()
  //   let data: object = {
  //     isBoxFld: null,
  //     publicFldDataTypeId: 1,
  //     publicFldId: this.fieldFormData.code,
  //     publicFldLength: this.fieldFormData.length,
  //     publicFldName: this.fieldFormData.name
  //   }
  //   setPublicField(data)
  //     .then((res: any) => {
  //         this.$message.success('添加成功')
  //         this.getPublicField()
  //         this.dialogVisibleField = false
  //     })
  //     .finally(() => {
  //       this.loading.close()
  //     })
  // }
  // 修改 公共字段
  updata(row: any) {
    this.fieldInfo = row
    this.updateDialogPublic = true
  }
  // 保存数据
  saveData() {
    this.loading.start()
    setPublicField(this.fieldInfo)
      .then((res: any) => {
        this.$message.success('修改成功')
      })
      .finally(() => {
        this.updateDialogPublic = false
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
</style>
