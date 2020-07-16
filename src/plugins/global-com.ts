import Vue from 'vue'
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination/index.vue'
import FormMaking  from  '../../lib/form-making-advanced'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

Vue.component('Pagination', Pagination)
Vue.component('Treeselect', Treeselect)
Vue.use(FormMaking)
Vue.use(permission)
