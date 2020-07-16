
import VueRouter from 'vue-router'
// 修复路由返回一个promise没有catch接收而报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}
