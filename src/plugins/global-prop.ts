import Vue from 'vue'
import Message from '@/utils/message'
import { parseTime, addDateRange, selectDictLabel } from '@/utils/tools'
import { getDicts } from '@/api/system/dict/data'

Vue.prototype.$message = Message
Vue.prototype.getDicts = getDicts
Vue.prototype.parseTime = parseTime
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
