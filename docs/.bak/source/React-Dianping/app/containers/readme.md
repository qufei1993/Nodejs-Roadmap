### React中使用this注意的问题
```javascript
class App extends React.Component{
	componentDidMount(){
		console.log(this);
		//注意this在setTimeout函数外代表的是App这个对象
		setTimeout(function(){
			this.setState({ //这里的this指的是windows对象
				initDone:true
			})			
		},1000);*/
		//两种解决方案：
		//1. var that = this
		setTimeout(() => {
			that.setState({
				initDone:true
			})			
		},1000);		
		//2.使用es6的箭头函数
		setTimeout(() => {
			this.setState({
				initDone:true
			})			
		},1000);			
	}
}
```
