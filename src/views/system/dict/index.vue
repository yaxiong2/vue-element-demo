<template>
  <div class="el-flex el-flex-column" style="height:100%;overflow: auto">
    <el-form :inline="true" label-width="68px" class="el-pa-4">
      <el-form-item label="字典名称">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入字典名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型">
        <el-input
          v-model="queryParams.dictType"
          placeholder="请输入字典类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.status"
          placeholder="字典状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item class="form-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button v-hasPermi="['system:dict:add']" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="content-box__gap el-flex-grow overflow-hidden">
      <div class="fill-height">
        <el-table :data="typeList" style="width: 100%;">
          <el-table-column label="字典主键" align="center" prop="dictId" />
          <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
          <el-table-column label="字典类型" align="center">
            <template slot-scope="scope">
              <router-link :to="'/dict/type/data/' + scope.row.dictId" class="link-type">
                <span>{{ scope.row.dictType }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
          <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['system:dict:edit']"

                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-hasPermi="['system:dict:remove']"
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
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

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator'
import { listType, getType, delType, addType, updateType } from '@/api/system/dict/type'

//  弹出窗口表单接口
interface FormData {
  dictId: number | undefined,
  dictName: string | undefined,
  dictType: string | undefined,
  status: string,
  remark: string | undefined,
  [propsName:string]:any
}
// 查询参数接口
interface QueryParamas {
  pageNum: number,
  pageSize: number,
  dictName: string | undefined,
  dictType: string | undefined,
  status: string | undefined,
}

@Component({
  name: 'Dict'
})
export default class extends Vue {
      // 遮罩层
      // private loading:boolean = true
      @Inject('loading') loading!:{close:()=>{}, start:()=>{}}
      // 总条数
      private total:number = 0
      // 字典表格数据
      private typeList:string[] = []
      // 弹出层标题
      private title:string = ''
      // 是否显示弹出层
      private open:boolean = false
      // 状态数据字典
      private statusOptions:any[] = []
      // 日期范围
      private dateRange:any[] = []
      // 查询参数
      private queryParams:QueryParamas = {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      }
      // 表单参数
      private form:FormData = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: '0',
        remark: undefined
      }
      // 表单校验
      private rules:object = {
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      }
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then((response:any) => {
      this.statusOptions = response.data
    })
  }
    /** 查询字典类型列表 */
    getList() {
      // this.loading = true
      this.loading.start()
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response:any) => {
          response = response.data
          this.typeList = response.rows
          this.total = Number(response.total)
          // this.loading = false
          this.loading.close()
        }
      )
    }
    // 字典状态字典翻译
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
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
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
      this.title = '添加字典类型'
    }
    /** 修改按钮操作 */
    handleUpdate(row:any) {
      this.reset()
      getType(row.dictId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改字典类型'
      })
    }
    /** 提交按钮 */
    submitForm() {
      (this.$refs['form'] as any).validate((valid:any) => {
        if (valid) {
          if (this.form.dictId !== undefined) {
            updateType(this.form).then((response:any) => {
              if (response.status === 200) {
                this.$message.success('修改成功')
                this.open = false
                this.getList()
              } else {
                this.$message.error(response.msg)
              }
            })
          } else {
            addType(this.form).then((response:any) => {
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
      this.$confirm('是否确认删除名称为"' + row.dictName + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delType(row.dictId)
        }).then(() => {
          this.getList()
          this.$message.success('删除成功')
        }).catch(function() {})
    }
}
</script>
