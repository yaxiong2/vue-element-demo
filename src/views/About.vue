<!--  -->
<template>
    <div class="markdown-body">
      <aaa></aaa>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import aaa from '@/assets/MarkDown/GetVue.md'
@Component({
  components:{
    aaa
  }
})
export default class  extends Vue {
}
</script>
<style lang=scss scoped>
</style>