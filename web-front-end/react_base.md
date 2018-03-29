# React基础

- [React生命周期](#React生命周期)
- [ref是什么?](#ref是什么?)

## React生命周期

* 构造函数创建组建件时调用一次

```js
constructor(props, context)
```

* componentWillMount()，组件载入之前执行一次

* render()，是react组件必不可少的核心函数，不要再render里面修改state

* componentDidMount()，组件载入之后执行一次

* componentWillRecevieProps(nextProps)，父组件发生render的时候，子组件就会调用该方法，不管有没有更新数据

* shouldComponentUpdate(nextProps, nextState)，组件载入之后，每次setState()都会调用该方法判断是否重新render，如果数据改变不影响页面展示，可以在此做判断，优化渲染效率

* componentWillUpdate(nextProps, nextState)，调用shouldComponentUpdate()返回true或者调用forceUpdate之后，componentWillUpdate才会被调用

* componentDidUpdate()，除了首次render之后调用componentDidMount()，其它render之后都是调用componentDidUpdate()

* componentWillUnmount()，组建被卸载时候调用，在componentDidMount()里面注册的事件需要在这里删除

## ref是什么?

```js
// todo:
```

## React服务端渲染

* 新建server-entry.js将需要服务端渲染内容给import出去

* 对server-entry.js文件内容进行webpack打包成nodejs输出对象

```js
// todo:
```


#### 参考:
[React组件生命周期小结](https://www.jianshu.com/p/4784216b8194)
[ref使用](https://reactjs.org/docs/refs-and-the-dom.html)