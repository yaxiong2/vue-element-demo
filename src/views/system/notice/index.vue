<template>
  <div class="app-container">
    <el-form :inline="true" label-width="68px">
      <el-form-item label="公告标题">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入操作人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button v-hasPermi="['system:notice:add']" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="noticeList">
      <el-table-column label="序号" align="center" prop="noticeId" width="100" />
      <el-table-column
        label="公告标题"
        align="center"
        prop="noticeTitle"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="公告类型"
        align="center"
        prop="noticeType"
        :formatter="typeFormat"
        width="100"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="100"
      />
      <el-table-column label="创建者" align="center" prop="createBy" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:notice:edit']"

            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['system:notice:remove']"
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

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model="form.noticeContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Inject } from 'vue-property-decorator'
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from '@/api/system/notice'
import Editor from '@/components/Editor/index.vue'

// 弹窗列表接口
interface FormData {
  noticeId: number | undefined,
  noticeTitle: string | undefined,
  noticeType: string | undefined,
  noticeContent: string | undefined,
  status: string
}
// 查询参数接口
interface QueryParamas {
  pageNum: number | undefined,
  pageSize: number | undefined,
  noticeTitle: string | undefined,
  createBy: string | undefined,
  status: string | undefined
}
@Component({
  name: 'Notice',
  components: {
    Editor
  }
})

export default class extends Vue {
    // 遮罩层
    // private loading:boolean = true
    @Inject('loading') loading!:{close:()=>{}, start:()=>{}}
    // 总条数
    private total:number = 0
    // 公告表格数据
    private noticeList:string[] = []
    // 弹出层标题
    private title:string = ''
    // 是否显示弹出层
    private open:boolean = false
    // 类型数据字典
    private statusOptions:any[] = []
    // 状态数据字典
    private typeOptions:any[] = []
    // 查询参数
    private queryParams: QueryParamas = {
      pageNum: 1,
      pageSize: 10,
      noticeTitle: undefined,
      createBy: undefined,
      status: undefined
    }
    // 表单参数
    private form:FormData = {
      noticeId: undefined,
      noticeTitle: undefined,
      noticeType: undefined,
      noticeContent: undefined,
      status: '0'
    }
    // 表单校验
    private rules:object = {
      noticeTitle: [
        { required: true, message: '公告标题不能为空', trigger: 'blur' }
      ],
      noticeType: [
        { required: true, message: '公告类型不能为空', trigger: 'blur' }
      ]
    }
  created() {
    this.getList()
    this.getDicts('sys_notice_status').then((response:any) => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_notice_type').then((response:any) => {
      this.typeOptions = response.data
    })
  }
  /** 查询公告列表 */
  getList() {
    // this.loading = true
    this.loading.start()
    listNotice(this.queryParams).then((response:any) => {
      response = response.data
      this.noticeList = response.rows
      this.total = Number(response.total)
      this.loading.close()
    })
  }
  // 公告状态字典翻译
  statusFormat(row:any, column:any) {
    return this.selectDictLabel(this.statusOptions, row.status)
  }
  // 公告状态字典翻译
  typeFormat(row:any, column:any) {
    return this.selectDictLabel(this.typeOptions, row.noticeType)
  }
  // 取消按钮
  cancel() {
    this.open = false
    this.reset()
  }
  // 表单重置
  reset() {
    this.form = {
      noticeId: undefined,
      noticeTitle: undefined,
      noticeType: undefined,
      noticeContent: undefined,
      status: '0'
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
    this.title = '添加公告'
  }
  /** 修改按钮操作 */
  handleUpdate(row:any) {
    this.reset()
    getNotice(row.noticeId).then(response => {
      this.form = response.data
      this.open = true
      this.title = '修改公告'
    })
  }
  /** 提交按钮 */
  submitForm() {
    (this.$refs['form'] as any).validate((valid:any) => {
      if (valid) {
        if (this.form.noticeId !== undefined) {
          updateNotice(this.form).then((response:any) => {
            if (response.status === 200) {
              this.$message.success('修改成功')
              this.open = false
              this.getList()
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          addNotice(this.form).then((response:any) => {
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
    this.$confirm('是否确认删除公告标题为"' + row.noticeTitle + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delNotice(row.noticeId)
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      }).catch(function() {})
  }
}
</script>
