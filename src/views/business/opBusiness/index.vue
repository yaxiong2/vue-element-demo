<template>
  <div class="businessWrap">
    <div class="leftTree">
      <VaCreateTree />
    </div>
    <div class="rightContent content-box__gap">
      <div v-if="moveName === 'moveOp'" class="businessInfo">
        <el-tabs v-model="activeName" class="tabsInfo" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="basicInfo">
            <VaBasicInfo v-if="activeName === 'basicInfo'" />
          </el-tab-pane>
          <el-tab-pane label="输入表" name="inputForm">
            <VaInputForm v-if="activeName === 'inputForm'" class="el-px-3" />
          </el-tab-pane>
          <el-tab-pane label="输出表" name="outputForm">
            <VaOutputForm v-if="activeName === 'outputForm'" class="el-px-3" />
          </el-tab-pane>
          <el-tab-pane label="流程图" name="flowChart">
            <FlowChart v-if="activeName === 'flowChart'" class="el-px-3" />
          </el-tab-pane>
          <el-tab-pane label="角色" name="role">
            <VaRoleManage v-if="activeName === 'role'" class="el-px-3" />
          </el-tab-pane>
          <el-tab-pane label="业务权限" name="authority">
            <BusinessAuthority v-if="activeName === 'authority'" class="el-px-3" />
          </el-tab-pane>
          <el-tab-pane label="公共字段" name="public">
            <VaPublicField v-if="activeName === 'public'" class="el-px-3" />
          </el-tab-pane>
          <el-tab-pane label="相关字段" name="relevant">
            <VaRelevantField v-if="activeName === 'relevant'" class="el-px-3" />
          </el-tab-pane>
          <el-tab-pane label="调用其他业务数据" name="otherOpData">
            <va-other-op-data v-if="activeName === 'otherOpData'" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else class="groupInfo">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="分组信息" name="basicInfo">
            <VaBasicInfo />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import VaCreateTree from '@/components/TreeAndForm/Va-CreateTree.vue'
import VaBasicInfo from '@/components/TreeAndForm/Va-BasicInfo.vue'
import VaInputForm from '@/components/TreeAndForm/Va-InputForm.vue'
import VaOutputForm from '@/components/TreeAndForm/Va-OutputForm.vue'
import VaRoleManage from '@/components/TreeAndForm/Va-Rolemanage.vue'
import BusinessMaterials from '@/components/TreeAndForm/BusinessMaterials.vue'
import BusinessAuthority from '@/components/TreeAndForm/BusinessAuthority.vue'
import FlowChart from '@/components/TreeAndForm/FlowChart.vue'
import VaPublicField from '@/components/TreeAndForm/Va-PublicField.vue'
import VaRelevantField from '@/components/TreeAndForm/Va-RelevantField.vue'
import VaOtherOpData from '@/components/TreeAndForm/Va-OtherOpData.vue'
import { ModuleState } from '@/store/modules/module'
import qs from 'qs'

@Component({
  name: 'Business',
  components: {
    VaCreateTree,
    VaBasicInfo,
    VaInputForm,
    VaOutputForm,
    BusinessAuthority,
    BusinessMaterials,
    VaPublicField,
    VaRelevantField,
    FlowChart,
    VaOtherOpData,
    VaRoleManage
  }
})
export default class extends Vue {
  private activeName: string = 'basicInfo' // 需要展示的组件编号
  private get moveName() {
    return ModuleState.moveIdName
  }
  @Watch('$route', { deep: true, immediate: true })
  pathChange(val: any) {
    const { tab } = val.query
    this.activeName = tab || 'basicInfo'
  }
  created() {
    this.activeName = this.$route.query.tab as string
  }
  handleClick(tab: any) {
    this.activeName = tab.name
    const queryStr = '?' + qs.stringify({ ...this.$route.query, tab: tab.name })
    this.$router.push(this.$route.path + queryStr)
  }
}
</script>

<style lang="scss">
.tabsInfo {
  .el-tabs__header {
    margin-bottom: 0;
  }
}
.tabsInfo .el-tabs__content {
  height: calc(100% - 39px);
}
</style>
<style lang="scss" scoped>
.businessWrap {
  height: 100%;
  display: flex;
  .leftTree {
    width: 370px;
    flex-shrink: 0;
    padding: 14px 14px 14px 20px;
  }
  .rightContent {
    flex-shrink: 1;
    flex-grow: 1;
    // padding: 14px 0;
    // border-left: 1px solid #dfe6ec;
    overflow: auto;
    .businessInfo {
      height: 100%;
      .tabsInfo {
        height: 100%;
        & ::v-deep .el-tab-pane {
          height: calc(100%);
        }
      }
    }
    .groupInfo {
      height: 100%;
    }
  }
}
::v-deep .el-tabs__nav-wrap{
  padding: 0 12px;
}
</style>
