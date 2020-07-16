<template>
  <div class="el-flex el-flex-column" style="height:100%;overflow: auto">
    <el-form :inline="true" label-width="68px" class="el-pa-4">
      <el-form-item label="参数名称">
        <el-input
          v-model="queryParams.configName"
          placeholder="请输入参数名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数键名">
        <el-input
          v-model="queryParams.configKey"
          placeholder="请输入参数键名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统内置">
        <el-select v-model="queryParams.configType" placeholder="系统内置" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
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
        <el-button v-hasPermi="['system:config:add']" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="content-box__gap el-flex-grow overflow-hidden">
      <div class="fill-height">
        <el-table :data="configList">
          <el-table-column label="参数主键" align="center" prop="configId" />
          <el-table-column label="参数名称" align="center" prop="configName" :show-overflow-tooltip="true" />
          <el-table-column label="参数键名" align="center" prop="configKey" :show-overflow-tooltip="true" />
          <el-table-column label="参数键值" align="center" prop="configValue" />
          <el-table-column label="系统内置" align="center" prop="configType" :formatter="typeFormat" />
          <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['system:config:edit']"

                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-hasPermi="['system:config:remove']"
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
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="form.configName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="form.configValue" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="form.configType">
            <el-radio
              v-for="dict in typeOptions"
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
import { listConfig, getConfig, delConfig, addConfig, updateConfig } from '@/api/system/config'

// 弹出框的表单接口
interface FormData {
  configId: number | undefined,
  configName: string | undefined,
  configKey: string | undefined,
  configValue: string |undefined,
  configType: string,
  remark: string |undefined,
  [propsName:string]: any
}
// 查询参数接口
interface QueryParams {
  pageNum: number,
  pageSize: number,
  configName: string | undefined,
  configKey: string | undefined,
  configType: string | undefined
}

@Component({
  name: 'Config'
})

export default class extends Vue {
    // 遮罩层
    // private loading:boolean = true
    @Inject('loading') loading!:{close:()=>{}, start:()=>{}}
    // 总条数
    private total:number = 0
    // 参数表格数据
    private configList:string[] = []
    // 弹出层标题
    private title:string = ''
    // 是否显示弹出层
    private open:boolean = false
    // 类型数据字典
    private typeOptions:any[] = []
    // 日期范围
    private dateRange:any[] = []
    // 查询参数
    private queryParams:QueryParams = {
      pageNum: 1,
      pageSize: 10,
      configName: undefined,
      configKey: undefined,
      configType: undefined
    }
    // 表单参数
    private form:FormData = {
      configId: undefined,
      configName: undefined,
      configKey: undefined,
      configValue: undefined,
      configType: 'Y',
      remark: undefined
    }
    // 表单校验
    private rules:object = {
      configName: [
        { required: true, message: '参数名称不能为空', trigger: 'blur' }
      ],
      configKey: [
        { required: true, message: '参数键名不能为空', trigger: 'blur' }
      ],
      configValue: [
        { required: true, message: '参数键值不能为空', trigger: 'blur' }
      ]
    }
  created() {
    this.getList()
    this.getDicts('sys_yes_no').then((response:any) => {
      this.typeOptions = response.data
    })
  }
  /** 查询参数列表 */
  getList() {
    this.loading.start()
    listConfig(this.addDateRange(this.queryParams, this.dateRange)).then((response:any) => {
      response = response.data
      this.configList = response.rows
      this.total = Number(response.total)
      this.loading.close()
      }
    )
  }
  // 参数系统内置字典翻译
  typeFormat(row:any, column:any) {
    return this.selectDictLabel(this.typeOptions, row.configType)
  }
  // 取消按钮
  cancel() {
    this.open = false
    this.reset()
  }
  // 表单重置
  reset() {
    this.form = {
      configId: undefined,
      configName: undefined,
      configKey: undefined,
      configValue: undefined,
      configType: 'Y',
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
    this.title = '添加参数'
  }
  /** 修改按钮操作 */
  handleUpdate(row:any) {
    this.reset()
    getConfig(row.configId).then(response => {
      this.form = response.data
      this.open = true
      this.title = '修改参数'
    })
  }
  /** 提交按钮 */
  submitForm() {
    (this.$refs['form'] as any).validate((valid:any) => {
      if (valid) {
        if (this.form.configId !== undefined) {
          updateConfig(this.form).then((response:any) => {
            if (response.status === 200) {
              this.$message.success('修改成功')
              this.open = false
              this.getList()
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          addConfig(this.form).then((response:any) => {
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
    this.$confirm('是否确认删除名称为"' + row.configName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delConfig(row.configId)
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      }).catch(function() {})
  }
}
</script>
