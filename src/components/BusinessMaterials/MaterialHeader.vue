<template>
  <div class="top">
    <el-button-group>
      <el-button class="title" type="text">{{ title }}</el-button>
      <el-tooltip class="item" effect="dark" content="添加" placement="top">
        <el-button type="primary" icon="el-icon-plus" @click="$emit('handleInsert')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="删除" placement="top">
        <el-button :disabled="!isDisabled" icon="el-icon-minus" @click="$emit('handleDel')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="置顶" placement="top">
        <el-button :disabled="!isDisabled" class="rotate" icon="el-icon-download" @click="$emit('handleTop')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="上移" placement="top">
        <el-button :disabled="!isDisabled" icon="el-icon-top" @click="$emit('handleUp')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="下移" placement="top">
        <el-button :disabled="!isDisabled" icon="el-icon-bottom" @click="$emit('handleDown')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="置底" placement="top">
        <el-button :disabled="!isDisabled" icon="el-icon-download" @click="$emit('handleBottom')" />
      </el-tooltip>
    </el-button-group>
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'MaterialHeader'
})
export default class MaterialHeader extends Vue {
  @Prop({ required: true }) readonly title!: string
  @Prop({ required: true }) readonly isDisabled!:boolean
}
</script>

<style lang='scss' scoped>
.rotate ::v-deep .el-icon-download {
  transform: rotate(180deg);
}
.title {
  cursor: default;
  color: #000;
  margin-right: 10px!important;
  vertical-align: middle;
}
.top {
  padding-top: 10px;
}
</style>
