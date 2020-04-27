# TypeScript 面向对象程序设计（OOP）

![](https://img1.sycdn.imooc.com/5ea677ba0001c43109000383.jpg)
在 JavaScript 中 ES6 之前我们使用函数（构造器函数）和基于原型来创建一个自定义的类，但这种方式总会让人产生困惑，特别是习惯了 Java、PHP 等面向对象编程的同学来说更加难以理解。

## 抽象一个类

面向对象编程的基本单位是对象，但对象又是由类实例化的，所以我们第一步需要先知道怎么去声明一个类。

### 类的声明

类的声明使用 class 关键词，类名与变量、函数等命名规则类似，这里要首写字母大写，类名后跟上一对花括号可以理解为的类的主体，类的主体三部分组成：成员属性、构造函数、成员方法。

```ts
class 类名 {
  成员属性:
  
  构造函数:	

  成员方法:
}
```

### 成员属性

在类中可以直接声明变量，也称为成员属性，另外在类中声明成员属性我们还可以使用关键词 private、public、protected 来修饰：

* **public:** 声明的属性具有公有权限，在类的外部是可以被访问的，public 这个关键词默认是可以不用写的。
* **private:** 声明的属性具有私有权限，仅在当前类的内部可以被访问。
* **protected:** 声明的属性具有保护权限，在类的派生类内部可以被访问。

```ts
class Person {
  age: number; // age 等价于 public age
  private sex: string;
  protected phone: number;
}
```

### 构造函数

构造函数用于类的初始化，可以声明哪些字段是必传的，哪些字段是非必传的。

构造函数参数中 ```public name: string``` 相当于如下形式：

```ts
class Person {
  public name: string
  constructor(public name: string) {
    this.name = name;
  }
}
```

在构造函数内部，可以为之前声明的成员属性做赋值。

```ts
class Person {
  ...
  constructor(public name: string, age: number, sex: string, phone?: number) {
    this.age = age;
    this.sex = sex;
    this.phone = phone;
  }
}
```

### 成员方法

在**类中直接声明函数称为成员方法**，注意这里的函数是不需要加 function 关键词的，成员方法要和对象有关联，例如 eat 方法（每个都需要吃饭的），另外方法也可以使用 public、private、protected 等关键词声明。

```ts
class Person {
  ...
  public eat() {
    const info = this.info();
    console.log(`${info} eat...`);
  }

  private info() {
    return `${this.name} ${this.age} ${this.sex} ${this.phone}`;
  }
}
```

什么是对象？只要能用属性、方法描述的事物我们都可以声明为一个类，然后对这个类实例化出对象使用。

## 类的实例化对象

上面我们抽象了一个类 Person，但是在程序中我们不是直接使用的类，而是通过抽象出来的类来实例化一个或多个对象为我们所使用。

实例化一个对象主要使用 new 关键词，后面跟上需要实例的类。

```ts
const zhangsan = new Person('张三', 18, '男');
const lisi = new Person('李四', 20, '男', 18800000000);

zhangsan.eat(); // 张三 18 男 undefined eat...
lisi.eat(); // 李四 20 男 18800000000 eat...
```

## static 静态属性

static 可以用来将类成员属性、成员方法标识为静态的。

static 关键词修饰的类成员属性、成员方法是属于类的与类实例对象无关，且在多个对象之间是共享的。

下例定义了静态属性 language 为 chinese，最后实例化了两个对象，其中 language 可以使用类名来调用，且在两个对象间是共享的。

```ts
class Person {
  static language: string = 'chinese';

  constructor(public name: string) {}

  info() {
    console.log(`我叫: ${this.name}, 我说: ${Person.language}`);
  }
}

const zhangsan = new Person('张三');
zhangsan.info(); // 我叫: 张三, 我说: chinese

const lisi = new Person('李四');
lisi.info(); // 我叫: 李四, 我说: chinese
```

## 面向对象编程 — 封装性

对象的成员属性或方法如果没有被封装，实例化后在外部就可通过引用获取，对于用户 phone 这种数据，是不能随意被别人获取的。

封装性做为面向对象编程重要特性之一，它是把类内部成员属性、成员方法统一保护起来，只保留有限的接口与外部进行联系，尽可能屏蔽对象的内部细节，防止外部随意修改内部数据，保证数据的安全性。

### Private 关键词修饰

**用 private 关键词修饰类的成员属性和成员方法来实现对成员的封装**，封装后的成员对象仅能在类的内部被访问。

下面我们使用 private 关键词对 Person 类部分成员进行封装，能够被外部访问的只有 info 方法。

```ts
class Person {
  private name: string;
  private phone: string;

  constructor(name: string, phone: string) {
    this.name = name;
    this.phone = phone;
  }

  public info() {
    console.log(`我是 ${this.name} 手机号 ${this.formatPhone()}`)
  }

  private formatPhone() {
    return this.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  }
}

const zhangsan = new Person('张三', '18800000000');
zhangsan.info();
```

### 私有成员访问

使用 private 修饰过后的成员属性或方法在外部将会无法访问，如果需要访问，我们可以设置公有方法返回私有属性，这里你也可以做一些条件限制。

```ts
class Person {
  private name: string;
  private phone: string;

  constructor(name: string, phone: string) {
    this.name = name;
    this.phone = phone;
  }

  public getName() {
    return this.name;
  }
  ...
}

const zhangsan = new Person('张三', '18800000000');
console.log(zhangsan.getName()); // 张三
```

## 面向对象编程 — 继承性

已存在的用来派生新类的类成为基类，又可称为超类。新派生的类称为派生类或子类。

在 C++ 中一个派生类可以继承多个基类，有单继承、多继承。在 TypeScript、Java、PHP 中都是只可继承自一个基类，只有单继承。

下图展示一个关于 Person 基类被继承的示意图：

![](https://img1.sycdn.imooc.com/5ea677f20001ed0013200626.png)

### 子类继承应用

创建基类 Person 一个成员属性 name，一个成员方法 eat。

```ts
class Person {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  eat() {
    console.log('eat...');
  }
}
```

创建派生类 Student，通过关键词 extends 继承于基类 Person，实现一个自定义的 study 方法。

```ts
class Student extends Person {
  study() {
    this.eat();
    console.log(`${this.name} 开始学习...`);
  }
}
```

创建派生类 Work，通过关键词 extends 继承于基类 Person，实现一个自定义的 work 方法。

```ts
class Work extends Person {
  work() {
    super.eat();
    console.log(`${this.name} 开始工作...`);
  }
}
```

上面创建的两个子类 Student、Work 都有自己单独的方法，学生要学习，工人要工作，但是在开始之前都要先吃饱饭吧。

下面我们测试下这个实例。

```ts
const s1 = new Student('张三');
s1.study(); 
// eat... 
// 张三 开始学习...

const w1 = new Work('李四');
w1.work();
// eat...
// 李四 开始工作...
```

### 子类重载父类的方法

我们不能定义重名的函数，也无法在同一个类中定义重名的方法，但是在派生类中我们可以重写在基类中同名的方法。

```ts
class Student extends Person {
  constructor(name: string) { super(name); }

  eat() {
    console.log('今天作业有点多，再加一块肉！');
    super.eat();
  }

  study() {
    this.eat();
    console.log(`${this.name} 开始学习...`);
  }
}

const s1 = new Student('张三');
s1.study();

// 今天作业有点多，再加一块肉！
// eat...
// 张三 开始学习...
```

注意：如果派生类中写了 constructor() 方法，必须在 this 之前调用 super 方法，它会调用基类的构造函数。

### 接口继承

**接口多继承实现**

上面讲了在 TS 中类之间只能实现单继承，但是在接口里是可以实现单继承和多继承的。

```ts
interface Person1 {
  nickname: string;
}
interface Person2 {
    age: number;
}
interface Person3 extends Person1, Person2 {
    sex: string;
}

function study(obj: Person3) {
    console.log(obj.nickname, obj.age, obj.sex);
}

study({ nickname: 'may', age: 20, sex: 'man' });
```

**接口继承类**

接口可以通过 extends 关键词继承一个类，如果类成员包含实现，则不会被继承其实现。

```ts
class Person1 {
    nickname: string;
    
    test(): string {
        return 'Hello';
    }
}
interface Person2 extends Person1 {
    age: number;
}

class Study implements Person2 {
    nickname: string;
    age: number;
    constructor(nickname: string, age: number) {
        this.nickname = nickname;
        this.age=age;
    }

    test(): string {
        console.log(this.nickname, this.age)
        return 'Hi';
    }
}

const lisi = new Study('李四', 20);
console.log(lisi.test());
```

## 面向对象编程 — 多态性

多态性是面向对象编程的三大特性之一，可以让具有继承关系的不同类对象，使用相同的函数名完成不同的功能，通俗的讲：一个子类可以修改、重写父类中定义的相同名称的方法，父类可以使用抽象类或接口来定义相应的规范。

### 抽象类

**抽象类是一种特殊的类，使用 abstract 关键词修饰，一般不会直接被实例化**。

抽象类中的成员属性或方法如果没有用 abstract 关键词修饰，可以包含实现细节。如果使用 abstract 关键词修饰，则只能定义，实现必须要在派生类中去做。

```ts
abstract class Person {
  abstract name: string;
  eat(): void {
    console.log('eat...')
  }

  abstract walk(): void;
}

class Student extends Person {
  name: string;
  walk(): void {
    console.log('walk...');
  }
}

const zhangsan = new Student();
zhangsan.eat(); // eat...
zhangsan.walk(); // walk...
```

### 接口

接口是一种特殊的抽象类，与之抽象类不同的是，接口没有具体的实现，只有定义，通过 interface 关键词声明。

在继承的时候说过，TypeScript 中只能单继承，但是在接口这里，是可以实现多个接口的。

```ts
class 类名 implements Interface1, Interface2 {
  ...
}
```

以下是一个接口的示例：
* 定义一个 Person 接口
* 定义一个 Study 接口，里面定一个 diploma（文凭）方法

```ts
interface Person {
  name: string;
  phone?: string;
}
interface Student {
  diploma(): void;
} 

class HighSchool implements Student, Person {
  name: string;

  diploma(): void {
    console.log('高中生 ...');
  }
}
class University implements Student, Person {
  name: string;

  diploma(): void {
    console.log('大学生 ...')
  }
}
```

### 多态性的应用

一个经典的例子，电脑的 USB 接口，我们可以插上鼠标、键盘、U 盘等设备，来为其扩展不同的功能，每个设备的功能是不同的，但是 USB 接口的规范遵守的是统一的，这也就是我们所讲的多态性，**通过声明抽象类或接口定义规范，子类重写和父类名称相同的方法，实现自己的功能**。

```ts
// 定义USB 接口规范
interface USB {
  run(): void;
}

// 实现一个 USB 规范的键盘设备
class UKey implements USB {
  run(): void {
    console.log('USB 规范的键盘设备');
  }
}

// 实现一个 USB U 盘设备
class UDisk implements USB {
  run(): void {
    console.log('USB 规范的 U 盘设备');
  }
}

// 计算机类
class Computer {
  useUSB(usb: USB) {
    usb.run();
  }
}

const computer = new Computer();
computer.useUSB(new UKey()); // USB 规范的键盘设备
computer.useUSB(new UDisk()); // USB 规范的 U 盘设备
```

## 总结

大学期间自学了 PHP 开发，当时印象比较深刻的一本书是 “细说 PHP”，作者：“高洛峰” 之前暑假去北京实习还见过作者，很 Nice，书中的面向对象这节印象还是比较深刻的，讲的很好，在学习 TypeScript 面向对象的封装、继承、多态特性时很多概念都是相通的，对于理解给予了很大帮助。

### Reference

* [细说 PHP 第 2 版](https://book.douban.com/subject/19986437/)
* [TypeScript 中文网](https://www.tslang.cn/docs/home.html)