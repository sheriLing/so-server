## 框架和库

框架：大而全，一整套的解决方案	js、ui、ajax

库（插件）：小而巧，某个功能的处理方案，学起来简单	jQuery、bootstrap

## 架构模式 mvc、mvp和mvvm

1. mvc

   在项目的角度划分

   + model      数据连接层
   + view         视图层 用户界面 html界面
   + controller 业务处理层
     - router.js   路由分支
     - controller  业务管理

2. mvp

3. mvvm

   + model	数据模型管理后台数据
   + view       视图渲染区域
   + viewModel  管理model和view数据的存和取
   + 框架：react、angular、vue

## VUE学习

渐进式框架，数据驱动

特性：

+ 容易上手

  + 源码小
  + 当下最火的MVVM框架

### 模板语法

```html
<p>{{msg}}差值表达式</p>
<P v-text="msg">不解析html元素</P>
<P v-html="msg">解析html元素</P>
```

### 属性绑定

`v-bind:属性名="属性值"`

```html
<P v-bind:title="msg"></P>
<P :title="msg"></P>
```

#### 样式绑定

普通数组	`:class="['样式名1','样式名2']"`

三元+数组	`:class="['样式名1','样式名2',isFlag?'样式名3':'']"`

数组+对象(推荐使用)	`:class="['样式名1','样式名2',{'样式名3':isFlag}]"`

普通对象	`:class="{'样式名1':true,'样式名2':true,'样式名3':false}"`

```html
<div :class="['red','fcolor','fsize']">一闪一闪亮晶晶</div>
<div :class="[flag?'red':'','fcolor','fsize']">一闪一闪亮晶晶</div>
<div :class="[{'red':flag},'fcolor','fsize']">一闪一闪亮晶晶</div>
<div :class="{red:flag,fcolor:true,fsize:true}">一闪一闪亮晶晶</div>
```

style 行内样式(少用)	`:style="{}"`、`:style="[obj.obj]"`

#### 数据绑定

  + 单向数据绑定  model改变，view跟着改变；view改变，model不改变
  + 双向数据绑定  model与view修改其中一个，另一个跟着改变
    - `v-model` vue中唯一一个双向数据，只能用于表单input、select、textarea

```html
<p>单向：<input type="text" :value='msg'></p>
<p>双向：<input type="text" v-model='msg'></p>
```

### 事件绑定

`v-on:事件名="方法名"`

```html
<P v-on:click="iscli"></P>
<P @click="iscli"></P>
```

#### 事件修饰符

```html
<button @click.stop="iscli">阻止冒泡</button>
```

[官方文档-事件修饰符](https://cn.vuejs.org/v2/guide/events.html#%E4%BA%8B%E4%BB%B6%E4%BF%AE%E9%A5%B0%E7%AC%A6) 

### 流程控制

```html
<!-- 控制元素创建和删除 -->
<input type="text" v-model="score">
<div v-if="score>=90">优秀</div>
<div v-else-if="score>=80">良好</div>
<div v-else>重造</div>

<!-- 控制元素隐藏和显示 -->
<div v-show="flag">{{msg}}</div>
```

### 循环遍历

```html
<ul>
    <!-- 遍历数组 -->
    <li v-for="(item,index) in arr">{{item}}---{{index}}</li>
    
    <!-- 遍历数组对象 -->
    <li v-for="(item,index) in arrObj">对象id值：{{item.id}}---对象age值：{{item.age}}---索引：{{index}}</li>
    
    <!-- 遍历对象 -->
    <li v-for="(item,key,index) in arrObj">值：{{item}}---键：{{key}}---索引：{{index}}</li>
    
    <!-- key是给所绑定元素添加的唯一标识，防止页面在重绘、重排时数据错乱，确保model和view数据保持一致 -->
    <button @click="add">isAdd</button>
    <p v-for="(item,index) in arrObj" :key="item.id">
        <input type="checkbox" />
        值:{{item.aname}}---索引：{{index}}
    </p>
</ul>


<script>
	const vm = new Vue({
        el: '#app',
        data: {
            name: '',
            arrObj: [
                {id: 0,aname:'ruby'},
                {id: 1,aname:'weiss'},
                {id: 2,aname:'blake'},
                {id: 3,aname:'yang'}
            ]
        },
        methods: {
            add() {
                let obj = {id: parseInt(Math.random()*100),aname:this.aname}
                this.arrObj.unshift(obj)
                this.aname='';
            }
        }
    })
</script>
```

