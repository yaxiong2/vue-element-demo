<!-- 我的台账 -->
<template>
  <div class>
    <conditionBar :data="conditionData" @getCondition="getCondition" @getKeyWord="getKeyWord" @refresh="refresh"></conditionBar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import conditionBar from './conditionBar.vue'
@Component({
  components: {
    conditionBar
  }
})
export default class extends Vue {
  private conditionData: any = [
    {
      label: '业务处室',
      active: true,
      children: [
        {
          label: '行政审批和政务服务处',
          active: false
        },
        {
          label: '规划监察执法支队',
          active: false
        },
        {
          label: '国土执法监察支队',
          active: false
        },
        {
          label: '国土空间用途管制处',
          active: false
        },
        {
          label: '耕地保护监督处',
          active: false
        },
        {
          label: '详细规划处',
          active: false
        }
      ]
    },
    {
      label: '台账分组',
      active: true,
      children: [
        {
          label: '调查监测',
          active: false
        },
        {
          label: '确权登记',
          active: false
        },
        {
          label: '权益管理',
          active: false
        },
        {
          label: '用途管制',
          active: false
        },
        {
          label: '规划管控',
          active: false
        },
        {
          label: '开发利用',
          active: false
        },
        {
          label: '生态修复',
          active: false
        },
        {
          label: '矿山管理',
          active: false
        },
        {
          label: '执法监察',
          active: false
        },
        {
          label: '行政综合',
          active: false
        },
        {
          label: '其他',
          active: false
        }
      ]
    },
    {
      label: '台账类别',
      active: true,
      children: [
        {
          label: '自定义台账',
          active: false
        },
        {
          label: '关注台账',
          active: false
        }
      ]
    }
  ]
  // 获取赛选条件
  getCondition(arr: any) {
    console.log(arr)
  }
  // 获取关键词过滤
  getKeyWord(val: string){
    console.log(val)
  }
  // 刷新
  refresh(){
    console.log(111)
  }
}
</script>
<style lang="scss" scoped></style>
