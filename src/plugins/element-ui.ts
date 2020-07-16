import Vue from 'vue'
import ElementUI from 'element-ui'
import { AppModule } from '@/store/modules/app'
Vue.use(ElementUI, { size: AppModule.size })
