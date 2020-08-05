import Vue from 'vue'
// 生成一个随机颜色
function randomColor() {
  let colorStr:any = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .toUpperCase()
    console.log(colorStr)
  return '#' + colorStr
}

Vue.directive('focus', {
  // 注意：在每个函数中， 第一个参数永远是el， 表示被绑定了指令的那个元素，这个el参数，是一个原生的JS对象
  bind: el => {
    // 每当指令绑定到元素上的时候，会立即执行这个bind函数，只执行一次
    console.log('bind 函数 执行一次', el)
  },
  inserted: el => {
    // inserted 表示元素插入到DOM中的时候，会执行inserted函数【触发一次】
    console.log('插入dom', el)
    el.focus()
  },
  update: el => {
    let hex = randomColor()
    el.setAttribute('style', 'border:1px solid ' + hex)
    console.log('数据更新', el)
  }
})
