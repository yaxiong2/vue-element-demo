<template>
  <div style="height:100%;">
    <ResizeContent :is-resizeable="true" left-width="50%" left-min-width="530" right-min-width="530">
      <template v-slot:left>
        <div style="padding-right:10px;">
          <Material key="leftKey" :title="leftTitle" :table-data="leftTableData" :options="options" @updateQuery="updateQuery" />
        </div>
      </template>
      <template v-slot:right>
        <div style="padding-left:10px;">
          <Material key="rightKey" :title="rightTitle" :table-data="rightTableData" :options="options" @updateQuery="updateQuery" />
        </div>
      </template>
    </ResizeContent>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Inject } from 'vue-property-decorator'
import ResizeContent from '@/components/ResizeContent/index.vue'
import Material from '@/components/BusinessMaterials/Material.vue'
import { titleEnum } from '@/components/BusinessMaterials/types'
import { bpmQuery, bpmUpdate, bpmInsert, bpmDel, query, IbpmMaterial, IMaterial } from '@/api/material'
import { ModuleState } from '@/store/modules/module'

const getKey = () => Math.random().toString(36)
@Component({
  name: 'BusinessMaterials',
  components: {
    ResizeContent,
    Material
  }
})
export default class BusinessMaterials extends Vue {
   @Inject('loading') loading!: { close: () => {}; start: () => {} }
  private leftTitle = titleEnum.application
  private rightTitle = titleEnum.achievements
  private materialOptions:IbpmMaterial[] = []
  private originData:IbpmMaterial[] = []
  private leftKey =getKey()
  private rightKey =getKey()
  get keyCodeType() {
    return ModuleState.opId
  }
  get procDefId() {
    return ModuleState.procDefId
  }
  get options() {
    return this.materialOptions.filter((item:IMaterial) => !this.originData.find(it => it.materialTypeName === item.materialTypeName))
  }
  get leftTableData() {
    return this.originData.filter((item:IbpmMaterial) => !item.asArchive)
  }
  get rightTableData() {
    return this.originData.filter((item:IbpmMaterial) => item.asArchive)
  }
  @Watch('keyCodeType')
  keyCodeTypeChnage() {
    this.query()
  }
  created() {
    this.query().then(this.getMaterialOptions)
  }
  query() {
    this.loading.start()
    return bpmQuery({ procDefId: this.procDefId }).then(({ data }) => {
      this.originData = data
      this.loading.close()
      // this.getMaterialOptions()
    }).catch(e => {
      this.loading.close()
    })
  }
  getMaterialOptions() {
    query().then(({ data }) => {
      this.materialOptions = data
    })
  }
  updateQuery() {
    this.query()
  }
}
</script>
<style lang="scss">

</style>

