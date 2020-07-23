## 1、自定义指令
```javascript
// 注册
Vue.directive('my-directive', {
  bind: function () {},//只调用一次,绑定时初始化调用
  inserted: function () {},//被绑定元素插入父节点时调用
  update: function () {},//元素所在模块更新时调用
  componentUpdated: function () {},//模块完成一次周期更新时调用
  unbind: function () {}//指令与元素解绑时调用
})

// 注册 (指令函数)
Vue.directive('my-directive', function () {
  // 这里将会被 `bind` 和 `update` 调用
})

// getter，返回已注册的指令
var myDirective = Vue.directive('my-directive')
```