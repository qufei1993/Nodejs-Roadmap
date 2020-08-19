# TypeScript 入门

TypeScript 是 JavaScript 的超集，在学习本文前希望你能先掌握 JavaScript、ES6 等基础语法的使用并有一定的实践，本文相对基础，从为什么使用 TS、开发环境搭建、参数类型声明几个方面介绍。

说明：TypeScript 下文会简称 TS。

## 为什么要使用 TS

* **类型安全**，可以类比 Java。
* **TS 面向对象理念**，支持面向对象的封装、继承、多态三大特性
* **类似 babel**，ES6 ES7 新语法都可以写，最终 TS 会进行编译。
* **生产力工具的提升**，VS Code + TS 使 IDE 更容易理解你的代码。

## 开发环境搭建

TypeScript 最终是要编译为 JavaScript 来执行的，所以我们需要一个 compiler 做编译，两种方式如下：

### 1. 在线编译 

TypeScript 官网提供了在线自动编译，可将 TS 代码编译为 JS 代码，地址如下：

https://www.typescriptlang.org/play/index.html

### 2. 本地编译

* 2.1 安装：npm install -g typescript
* 2.2 新建 hello.ts

```ts
const message: string = 'Hello Nodejs';
```

* 2.3 编译 hello.ts

```
$ tsc heelo.ts
```

## TS 参数类型声明

### 基础数据类型

在**参数名称后面使用冒号来指定参数类型**，同时也可在类型后面赋默认值。

注意 const 声明的变量必须要赋予默认值否则 IDE 编译器会提示错误，let 则不是必须的。

```ts
const nickname: string = 'MayJun'; // 字符串
const age: number = 20; // Number 类型
const man: boolean = true; // 布尔型
let hobby: string; // 字符串仅声明一个变量
let a: undefined = undefined; // undefined 类型
let b: null = null; // null 类型，TS 区分了 undefined、null 
let list: any[] = [1, true, "free"]; // 不需要类型检查器检测直接通过编译阶段检测的可以使用 any，但是这样和直接使用 JavaScript 没什么区别了
let c: any;
c = 1;
c = '1';
```

### 数组与元组

#### 数组

数组两种表示方式：
* 元素类型后面跟上 []，例如：list1
* 使用数组泛型：Array<元素类型>

```ts
const list1: number[] = [1, 2, 3];
const list2: Array<number|string> = [1, '2', 3];
```

#### 元组

允许一个已知元素数量的数组中各元素的类型可以是不同的。

```ts
const list1: [number, string, boolean] = [1, '2', true]; // 正确
const list2: [number, string, boolean] = [1, 2, true]; // 元素 2 会报错，不能将类型 "number" 分配给类型 "string"
```

### 枚举

```ts
enum Status {
	ordered=0,
	bePaid=1,
	paid=2,
	complete=3,
}

console.log(Status.paid); // 2
```

### 函数类型声明

**可选参数使用 “?” 符号声明**，**可选参数**、**函数参数的默认值**需要声明在必选参数之后。

还可以在函数后指定冒号来声明函数的返回值类型。

```ts
// 定义函数返回值为空
// 给传入的参数定义类型
// 给传入的参数赋予默认值
const speak = function(nickname?: string, content: string='Hello'): void {
  console.log('speak', nickname, content);
}
speak();

// 指定函数的返回值为 string
function test(): string {
	return 'str';
}
```

### class、接口声明自定义类型

通过 class 声明自定义类型

```ts
class Person {
  nickname: string;
  age: number;
}

const mayJun: Person = new Person();
mayJun.age = 19;
```

通过 interface（接口）声明自定义类型

```ts
interface Person {
  nickname: string;
  age: number;
}

function study(obj: Person) {
	console.log(obj.nickname, obj.age);
}

study({ nickname: 'may', age: 20 });
```