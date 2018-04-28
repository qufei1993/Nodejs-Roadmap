# 关于this

## 错误认识

#### 指向自身

> 人们很容易把this理解成指向函数自身，其实this的指向在函数定义阶段是无法确定的，只有函数执行时才能确定this到底指向谁，实际上this的最终指向是调用它的那个对象。

下面示例，声明函数foo，执行foo.count=0时，的确向函数对象foo添加了一个属性count。但是函数foo内部代码this.count中的this并不是指向那个函数对象，for循环中的foo(i)掉用它的对象是window，等价于window.foo(i)，因此函数foo里面的this指向的是window。

```js
{
	function foo(num){
		console.log("foo: " + num);
		
		//记录foo被调用次数
		this.count++;
	}

	foo.count = 0;

	for(let i=0; i<10; i++){
		if(i > 5){
			foo(i);
		}
	}

	console.log(foo.count); // 0
}
```