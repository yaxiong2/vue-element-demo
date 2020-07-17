import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "首页",
      icon: "el-icon-plus",
    },
    redirect:'/ceshi',
    children:[
      {
        path:'ceshi',
        name:'ceshi',
        component:() => import("@/views/About.vue"),
        meta:{
          title:'测试'
        }
      }
    ]
  },
  {
    path: "/about",
    name: "About",
    meta: {
      title: "关于",
      icon: "el-icon-plus",
    },
    redirect:'stars',
    children: [
      {
        path: "star",
        name: "star",
        component: () => import("@/views/About.vue"),
        meta: {
          title: "关于子页面",
          icon: "el-icon-plus",
        }
      },
      {
        path: "stars",
        name: "stars",
        component: () => import("@/views/child.vue"),
        meta: {
          title: "子页面",
          icon: "el-icon-plus",
        }
      }
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
