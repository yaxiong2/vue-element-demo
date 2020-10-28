<!-- eventBus -->
<template>
  <div class>
    <one></one>
    <br />

    <two></two>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import one from './brotherone.vue'
import two from './brothertwo.vue'
@Component({
  components: {
    one,
    two
  }
})
export default class extends Vue {}
</script>
<style lang="scss" scoped></style>
