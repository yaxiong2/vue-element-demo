<!--
  功能：下载一个ajax返回的流数据
  邮箱：819741271@qq.com
  时间：2020年03月20日 10:02:04
-->
<template>
  <div>
    <a ref="autoDownload" :href="url" :download="filename" :style="downloadStyle" class="download">
      {{ displayName }}
    </a>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class extends Vue {
  @Prop() public filename!: string
  @Prop({ default: '点击下载' }) public displayName!: string
  @Prop() public readonly data!: object
  @Prop({ default: true }) public hidden!: boolean

  public content: any = undefined
  public url = ''
  public downloadStyle: object = this.hidden === false ? {} : { display: 'none' }

  @Watch('data')
  public downloadProcess(data: Blob) {
    if (data === undefined) return
    if (!(data instanceof Blob)) {
      // console.warn('XX-download warning: \r\n当前文件数据内容不合法,请确保为stream')
      return
    }
    if (data.size <= 0) {
      // console.warn('XX-download warning: \r\n文件内容不能为空')
    }
    this.url = URL.createObjectURL(new Blob([data], { type: data.type }))
    const autoDownload = this.$refs['autoDownload'] as HTMLElement
    this.$nextTick(() => {
      autoDownload.click()
    })
  }
  public download(data: Blob) {
    this.downloadProcess(data)
  }
}
</script>
<style lang="scss" scoped>
.download {
  text-decoration: none;
}
</style>
