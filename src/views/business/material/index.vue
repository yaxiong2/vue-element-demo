<template>
  <div class="content-box__gap el-flex el-flex-column" style="heihgt:100%;">
    <!-- <el-form :inline="true" :model="material" class="demo-form-inline">
      <el-form-item label="材料名称">
        <el-input v-model="material.name" placeholder="请输入" @change="onSubmit" />
      </el-form-item>
      <el-form-item style="flex:1;">
        <el-button type="primary" icon="el-icon-plus" @click="handleInsert">新增</el-button>
      </el-form-item>
    </el-form> -->
    <div class="header-flex el-pa-3">
      <span class="header-label">材料名称</span>
      <el-input v-model="material.name" style="width:185px;" placeholder="请输入" @input="onSubmit" />
      <div class="header-right">
        <el-button type="primary" icon="el-icon-plus" @click="handleInsert">新增</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;flex:1"
    >
      <el-table-column
        type="index"
        align="center"
      />
      <el-table-column
        prop="materialTypeName"
        label="材料名称"
        sortable
      />
      <el-table-column
        prop="materialFileType"
        label="材料格式"
        sortable
      />
      <el-table-column
        prop="address"
        label="操作"
        width="150px"
      >
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" class="btn-no-padding" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" type="text" class="btn-delete btn-no-padding" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="visiable" width="400px" :before-close="beforeClose">
      <el-form ref="materialRef" :model="materialForm">
        <el-form-item label="材料名称" :label-width="formLabelWidth" prop="materialTypeName" :rules="[{ required: true, message: '请填写材料名称', trigger: 'blur' }]">
          <el-input v-model="materialForm.materialTypeName" autocomplete="off" />
        </el-form-item>
        <el-form-item class="el-mb-0" label="材料格式" :label-width="formLabelWidth" prop="materialFileType" :rules="[{ required: true, message: '请填写材料类型', trigger: 'blur' }]">
          <el-input v-model="materialForm.materialFileType" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Inject } from 'vue-property-decorator'
import { query, insert, update, del, IMaterial } from '@/api/material'
import { Form } from 'element-ui'

enum titleEnum {
  add='添加材料',
  update='修改材料'
}
@Component({
  name: 'Material'
})
export default class Material extends Vue {
  @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private material = { name: '' }
  private tableData = []
  private originTableData = []
  private title = titleEnum.update
  private visiable = false
  private currentRow!:IMaterial
  public $refs!: {materialRef:Form}
  private materialForm:IMaterial = {
    materialFileType: '',
    materialTypeName: '',
    materialGroupId: 0

  }
  private formLabelWidth = '80px'

  mounted() {
    this.query()
  }
  query() {
    this.loading.start()
    query().then(({ data }) => {
      this.tableData = data
      this.originTableData = data
      this.loading.close()
    }).catch(() => {
      this.loading.close()
    })
  }
  onSubmit() {
    // 模拟后台查找功能
    if (this.material.name === '') {
      this.query()
    } else {
      const { name } = this.material
      this.tableData = this.originTableData.filter((item:IMaterial) => item.materialTypeName.includes(name))
    }
  }
  handleInsert() {
    this.title = titleEnum.add
    this.materialForm = {
      materialFileType: '',
      materialTypeName: '',
      materialGroupId: 0
    }
    this.visiable = true
  }
  handleDel(row:any) {
    this.$confirm('确定要删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      del(row).then(_ => {
        this.$message.success('删除成功')
        this.query()
      })
    }).catch(() => {
      this.$message.info('已取消删除')
    })
  }
  handleUpdate(row:any) {
    this.title = titleEnum.update
    this.materialForm = Object.assign(this.materialForm, row)
    this.visiable = true
  }
  insert() {
    insert(this.materialForm).then(res => {
      this.visiable = false
      this.query()
    })
  }
  update() {
    update(this.materialForm).then(res => {
      this.visiable = false
      this.query()
    })
  }
  dialogSubmit() {
    this.$refs.materialRef.validate(valid => {
      if (!valid) return
      if (this.title === titleEnum.add) this.insert()
      if (this.title === titleEnum.update) this.update()
    })
  }
  dialogClose() {
    this.$refs.materialRef.resetFields()
    this.visiable = false
  }
  beforeClose(done:()=>{}) {
    this.$refs.materialRef.resetFields()
    done()
  }
}
</script>

<style></style>
