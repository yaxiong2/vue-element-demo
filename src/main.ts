import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUi from "element-ui";
import '@/style' //全局样式
import '@/utils' //全局函数
import '@/icons'

Vue.config.productionTip = false;

Vue.use(ElementUi);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
