import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "首页",
    component: ()=>import("@/views/sideBar/sideBar.vue"),
    meta:{
      icon:'el-icon-plus'
    },
    children:[]
  },
  {
    path:'/index',
    name:'主页',
    component:()=>import('@/components/index/index.vue')
  },
  {
    path:'/demo',
    name:'示例demo',
    component:()=>import('@/views/示例demo/index.vue')
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
