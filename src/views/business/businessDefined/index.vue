<template>
  <div class="wrapper" style="margin:10px 0 0 10px;">
    <el-row :gutter="10">
      <el-col :span="12">
        <VaCreateGroup />
      </el-col>
      <el-col :span="12">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="输入表" name="inputForm">
            <VaInputForm />
          </el-tab-pane>
          <el-tab-pane label="输出表" name="outputForm">
            输出表
            <!-- <VaOutputForm /> -->
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import VaCreateGroup from '@/components/CreateGroup/Va-CreateGroup.vue'
import VaInputForm from '@/components/InputForm/Va-InputForm.vue'
// import VaOutputForm from '@/components/outputForm/Va-OutputForm.vue'
import { ModuleState } from '@/store/modules/module'

@Component({
  name: 'Business',
  components: {
    VaCreateGroup,
    VaInputForm
    // VaOutputForm
  }
})
export default class extends Vue {
  private activeName:string = 'inputForm' // 需要展示的组件编号
  handleClick(tab:any) {
    this.activeName = tab.name
  }
}
</script>
