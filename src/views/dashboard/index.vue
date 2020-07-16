<template>
  <div class="dashboard-container">
    <AdminDashboard />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AdminDashboard from './admin/index.vue'

@Component({
  name: 'Dashboard',
  components: {
    AdminDashboard
  }
})
export default class extends Vue {}
</script>
