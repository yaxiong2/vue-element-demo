# 一、开发小妙招(想到啥写啥)

## 1、json 妙用

```JavaScript
JSON.parse(
      JSON.stringify(res.data.sort(this.sortIndex))
        .replace(/columnName/g, 'value')
        .replace(/columnCaption/g, 'text')
        .replace(/columnWidth/g, 'width')
    )
//数组里的对象更换属性名 转成json字符串替换后转回来
```

## 2、数组排序

```JavaScript
const arr=[
  {
    name:'张三',
    age:'18',
    salary:'3800'
  },
  {
    name:'李四',
    age:'19',
    salary:'4800'
  },
  {
    name:'王五',
    age:'28',
    salary:'8000'
  }
]
arr.sort((a,b)=>{
  return b.age - a.age
})//年龄大的排前面
```

## 3、路由详情跳转

```JavaScript
this.$router.push({
  name: '详情页',//路由名称
  query: {
    id: id //详情id
  },
  params: {
    tagName: name,//name : 页面展示的名字
    data: val // 详情
  }
})
```



## 4、数学公式

$$
\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
\frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0 \\
\end{vmatrix}
${$tep1}{\style{visibility:hidden}{(x+1)(x+1)}}
$$





