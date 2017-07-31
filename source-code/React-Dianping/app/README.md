### React性能优化
* 性能检测  
```javascript
npm i react-addons-perf --save //安装
```
* 性能测试  
```javascript
		//在项目入口文件引入以下代码:
		import Perf from 'react-addons-perf'
		if (__DEV__) {
			window.Perf = Perf
		}
```
> 运行程序。在操作之前先运行Perf.start()开始检测，然后进行若干操作，运行Perf.stop停止检测，然后再运行Perf.printWasted()即可打印出浪费性能的组件列表。在项目开发过程中，要经常使用检测工具来看看性能是否正常。

>如果性能的影响不是很大，例如每次操作多浪费几毫秒、十几毫秒，个人以为没必要深究，但是如果浪费过多影响了用户体验，就必须去搞定它。

* 性能优化之PureRenderMixin  
React 最基本的优化方式是使用PureRenderMixin
```javascript
npm i react-addons-pure-render-mixin --save //安装
```
* 项目中引用
```javascript
import PureRenderMixin from 'react-addons-pure-render-mixin'
class List extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
}
```
* 性能优化之Immutable.js
> 当我们组件的props和state中的数据结构层次不深（例如普通的数组、对象等）的时候，就没必要用它。但是当数据结构层次很深（例如obj.x.y.a.b = 10这种），你就得考虑使用了。
