import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Side",
    component: ()=>import('@/views/sideBar/index.vue'),
    meta:{
      title:'首页',
      icon:'el-icon-plus'
    }
  },
  {
    path: "/about",
    name: "About",
    component: () =>import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta:{
      title:'首页',
      icon:'el-icon-plus'
    },
    children:[
      {
        path:'/star',
        name:'Star',
        meta:{
          title:'子页面',
          icon:'el-icon-plus'
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
