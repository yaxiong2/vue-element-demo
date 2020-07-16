<template>
  <div class="el-flex el-flex-column">
    <el-form :inline="true" label-width="68px" class="el-pa-4">
      <el-form-item label="岗位编码">
        <el-input
          v-model="queryParams.postCode"
          placeholder="请输入岗位编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="岗位名称">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入岗位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="form-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button v-hasPermi="['system:post:add']" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="content-box__gap overflow-hidden el-flex-grow">
      <div class="fill-height">
        <el-table :data="postList">
          <el-table-column label="岗位编号" align="center" prop="postId" />
          <el-table-column label="岗位编码" align="center" prop="postCode" />
          <el-table-column label="岗位名称" align="center" prop="postName" />
          <el-table-column label="岗位排序" align="center" prop="postSort" />
          <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['system:post:edit']"

                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-hasPermi="['system:post:remove']"
                class="btn-delete"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入编码名称" />
        </el-form-item>
        <el-form-item label="岗位顺序" prop="postSort">
          <el-input-number v-model="form.postSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Inject } from 'vue-property-decorator'
import { listPost, getPost, delPost, addPost, updatePost } from '@/api/system/post'

// 定义查询差数接口
interface QueryParams {
  pageNum: number | 1,
  pageSize: number | 10,
  postCode: number | undefined,
  postName: string | undefined,
  status: string | undefined
}
// 表单接口
interface FormData {
  postId: number | undefined,
  postCode: string | undefined,
  postName: string | undefined,
  postSort: number | undefined,
  status: string | undefined,
  remark: string | undefined
}

@Component({
  name: 'Post'
})
export default class extends Vue {
  // 遮罩层
  // private loading:boolean = true
  @Inject('loading') loading!:{close:()=>{}, start:()=>{}}
  // 总条数
  private total:number = 0
  // 岗位表格数据
  private postList:string[] = []
  // 弹出层标题
  private title:string = ''
  // 是否显示弹出层
  private open:boolean = false
  // 状态数据字典
  private statusOptions:any[] = []
  // 查询参数
  private queryParams:QueryParams = {
    pageNum: 1,
    pageSize: 10,
    postCode: undefined,
    postName: undefined,
    status: undefined
  }
  // 表单参数
  private form:FormData = {
    postId: undefined,
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: '0',
    remark: undefined
  }
  // 表单校验
  private rules:object = {
    postName: [
      { required: true, message: '岗位名称不能为空', trigger: 'blur' }
    ],
    postCode: [
      { required: true, message: '岗位编码不能为空', trigger: 'blur' }
    ],
    postSort: [
      { required: true, message: '岗位顺序不能为空', trigger: 'blur' }
    ]
  }
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then((response:any) => {
      this.statusOptions = response.data
    })
  }
  /** 查询岗位列表 */
  getList() {
    this.loading.start()
    listPost(this.queryParams).then((response:any) => {
      response = response.data
      this.postList = response.rows
      this.total = Number(response.total)
      this.loading.close()
    })
  }
  // 岗位状态字典翻译
  statusFormat(row:any, column:any) {
    return this.selectDictLabel(this.statusOptions, row.status)
  }
  // 取消按钮
  cancel() {
    this.open = false
    this.reset()
  }
  // 表单重置
  reset() {
    this.form = {
      postId: undefined,
      postCode: undefined,
      postName: undefined,
      postSort: 0,
      status: '0',
      remark: undefined
    }
  }
  /** 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1
    this.getList()
  }
  /** 新增按钮操作 */
  handleAdd() {
    this.reset()
    this.open = true
    this.title = '添加岗位'
  }
  /** 修改按钮操作 */
  handleUpdate(row:any) {
    this.reset()
    getPost(row.postId).then(response => {
      this.form = response.data
      this.open = true
      this.title = '修改岗位'
    })
  }
  /** 提交按钮 */
  submitForm() {
    (this.$refs['form'] as any).validate((valid:any) => {
      if (valid) {
        if (this.form.postId !== undefined) {
          updatePost(this.form).then((response:any) => {
            if (response.status === 200) {
              this.$message.success('修改成功')
              this.open = false
              this.getList()
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          addPost(this.form).then((response:any) => {
            if (response.status === 200) {
              this.$message.success('新增成功')
              this.open = false
              this.getList()
            } else {
              this.$message.error(response.msg)
            }
          })
        }
      }
    })
  }
  /** 删除按钮操作 */
  handleDelete(row:any) {
    this.$confirm('是否确认删除岗位名称为"' + row.postName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delPost(row.postId)
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      }).catch(function() {})
  }
}
</script>
