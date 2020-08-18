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

## 4、递归找寻 id

```JavaScript
let arr = {
  id:'10',
  parent:[
    {
      id:'1616',
      parent:[
        {
          id:'9090'
        }
      ]
    }
  ]
}
//方法一
let current = []
while( arr.id ) {
  current.unshift(arr.id)
  arr = arr.parent
}
//方法二
function findId(arr,res=[]){
  if (arr.id) res.unshift(arr.id)
  if (arr.parent) findId(arr.parent,res)
  return res
}
findId(arr)
```
