# Nodejs 项目开发中应用 ESLint 代码规范

ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，可以检查常见的 Javascript 代码错误，如果每次在代码提交之前都进行一次 eslint 代码检查，可减少因为某个字段定义为 undefined 或 null 这样的错误而导致服务崩溃，可以有效的控制项目代码的质量。

[官方参考文档](http://eslint.cn/docs/user-guide/configuring#configuration-file-formats)

## 全局安装

```
npm i eslint -g
```

## 初始化

如果项目中没有 .eslintrc.json 配置文件，可通过 --init 参数生成一个新的文件

```
eslint --init
```

## 文件配置

通过env配置需要启动的环境

```js
"env": {
    "es6": true, // 支持新的 ES6 全局变量，同时自动启用 ES6 语法支持
    "node": true // 启动node环境
}
```

## 校验规则

* ESLint规则的三种级别
    * "off"或者0，不启用这个规则
    * "warn"或者1，出现问题会有警告
    * "error"或者2，出现问题会报错

* ``` "no-console": "off" ``` 禁用 console

* ``` "no-unused-vars": 2 ``` 禁止出现未使用过的变量

* ``` "no-use-before-define": 2 ``` 不允许在变量定义之前使用它们

* ``` "linebreak-style": [2, "unix"] ``` 强制使用一致的换行风格

* ``` "quotes": ["error", "single"] ``` 强制使用一致的单引号

* ``` "semi": ["error", "always"] ``` 控制行尾部分号

* ``` "curly": ["error", "all"] ``` 强制所有控制语句使用一致的括号风格

    * error

    ```js
        let a = 1;

        if (a) return a;
    ```

    * success

    ```js
        let a = 1;

        if (a) {
            return a;
        }
    ```

* ``` "default-case": "error" ``` switch 语句强制 default 分支，也可添加 // no default 注释取消此次警告

* ``` "no-else-return": "error" ``` 禁止 if 语句中有 return 之后有 else

    * error

    ```js
        let a = 1;

        if (a) {
            return a;
        } else {
            return false;
        }
    ```

    * success

    ```js
        let a = 1;

        if (a) {
            return a;
        }

        return false;
    ```

* ```  "no-implicit-coercion": "error" ``` 禁止出现空函数.如果一个函数包含了一条注释，它将不会被认为有问题。

* ``` "no-invalid-this": "error" ``` 禁止 this 关键字出现在类和类对象之外

* ``` "no-loop-func": "error" ``` 禁止在循环中出现 function 声明和表达式

* ``` "no-multi-spaces": "error" ``` 禁止使用多个空格

* ``` "no-new-func": "error" ``` 禁止对 空Function 对象使用 new 操作符

* ``` "no-useless-return": "error" ```  禁止没有任何内容的return;

* ``` "global-require": "error" ```  要求 require() 出现在顶层模块作用域中

    * error

    ```js
        function foo() {

            if (condition) {
                const fs = require("fs");
            }
        }
    ```

    * success

    ```js
        const fs = require("fs");

        function foo() {

            if (condition) {
                // todo fs ...
            }
        }
    ```

* ``` "no-path-concat": "error" ```  禁止对 __dirname 和 __filename进行字符串连接

    * error

    ```js
        const fullPath = __dirname + 'test.js';
    ```

    * success

    两个path.join()和path.resolve()是任何地方正在创建的文件或目录路径为字符串连接合适的替代品

    ```js
        const path = require('path');
        const fullPath1 = path.join(__dirname, 'test.js');
        const fullPath2 = path.resolve(__dirname, 'test.js');
    ```

* ``` "no-sync": "error" ``` 禁用同步方法

* ``` "array-bracket-spacing": ["error", "never"] ```  指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格

* ``` "block-spacing": ["error", "always"] ``` 禁止或强制在单行代码块中使用空格(禁用)

* ``` "brace-style": ["error", "1tbs"] ``` 
    * error

    ```js
        const condition = 1;

        if (condition)
        {
            // todo:
        }
    ```

    * success

    ```js
        const condition = 1;

        if (condition) {
            // todo:
        }
    ```

* ``` "camelcase": "error" ``` 强制驼峰法命名

* ``` "comma-dangle": ["error", "always-multiline"] ``` 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗,always-multiline：多行模式必须带逗号，单行模式不能带逗号号

* ```  "comma-spacing": ["error", { "before": false, "after": true }] ``` 控制逗号前后的空格

* ``` "comma-style": ["error", "last"] ```  控制逗号在行尾出现还是在行首出现 (默认行尾)

    * error

    ```js
        let a = 1
            , b = 2;
    ```

    * success

    ```js
        let a = 1,
            b = 2;
    ```

* ``` "key-spacing": ["error", { "beforeColon": false, "afterColon": true }] ``` 该规则规定了在对象字面量语法中，key和value之间的空白，冒号前不要空格，冒号后面需要一个空格

    * error

    ```js
        const obj = { a:1, b:2 };
    ```

    * success

    ```js
        const obj = {a: 1, b: 2};
    ```

* ```  "lines-around-comment": ["error", { "beforeBlockComment": true }] ``` 要求在注释周围有空行 ( 要求在块级注释之前有一空行)

* ``` "newline-after-var": ["error", "always"] ``` 要求或禁止 var 声明语句后有一行空行

* ``` "newline-before-return": "error" ``` 要求 return 语句之前有一空行

* ``` "no-multi-assign": "error" ``` 链接变量的赋值可能会导致意外的结果并难以阅读，不允许在单个语句中使用多个分配

    * error

    ```js
        let a = b = c = 1;
    ```

    * success

    ```js
        let a = 1;
        let b = 1;
        let c = 1;
    ```

* ``` "max-params": [1, 3] ``` function 定义中最多允许的参数数量
    * error

    ```js
        function test(a, b, c, d) {
            return a + b + c + d;
        }

        test(1, 2, 3, 4);
    ```

    * success

    ```js
        function test({a, b, c, d}) {
            return a + b + c + d;
        }

        test({a: 1, b: 2, c: 3, d: 4});
    ```

* ``` "new-cap": ["error", { "newIsCap": true, "capIsNew": false}] ``` 构造函数首字母大写
    * error

    ```js
        class test {

        }

        new test();
    ```

    * success

    ```js
        class Test {

        }

        new Test();
    ```

* ``` "no-multiple-empty-lines": ["error", {"max": 2}] ``` 空行不能够超过2行

* ``` "no-shadow-restricted-names": "error" ``` 禁止对一些关键字或者保留字进行赋值操作，比如NaN、Infinity、undefined、eval、arguments等

* ``` "no-undef-init": "error" ``` 禁止把undefined赋值给一个变量

* ``` "keyword-spacing": "error" ``` keyword 前后需要空格

* ``` "space-before-blocks": ["error","always"] ``` 强制在块之前使用一致的空格

* .eslintrc.json

```json
{
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "script"
    },
    "rules": {
        "no-console": 0,
        "no-unused-vars": "error",
        "no-use-before-define": "error",
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "curly": ["error", "all"],
        "default-case": "error",
        "no-else-return": "error",
        "no-empty-function": "error",
        "no-implicit-coercion": "error",
        "no-invalid-this": "error",
        "no-loop-func": "error",
        "no-multi-spaces": "error",
        "no-new-func": "error",
        "no-useless-return": "error",
        "global-require": "error",
        "no-path-concat": "error",
        "no-sync": "error",
        "array-bracket-spacing": [
            "error",
            "never" 
        ],
        "block-spacing": [
            "error",
            "always"
        ],
        "brace-style": [
            "error",
            "1tbs"
        ],
        "camelcase": "error",
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "comma-spacing": [
            "error",
            { "before": false, "after": true }
        ],
        "comma-style": [
            "error",
            "last"
        ],
        "key-spacing": [
            "error", 
            { "beforeColon": false, "afterColon": true }
        ],
        "lines-around-comment": [
            "error",
            { "beforeBlockComment": true }
        ],
        "newline-after-var": [
            "error",
            "always"
        ],
        "newline-before-return": "error",
        "no-multi-assign": "error",
        "max-params": [1, 3],
        "new-cap": [
            "error",
            {
                "newIsCap": true,
                "capIsNew": false
            }
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2
            }
        ],
        "no-shadow-restricted-names": "error",
        "no-undef-init": "error",
        "keyword-spacing": "error",
        "space-before-blocks": [
            "error",
            "always"
        ]
    }
}
```

## 忽略文件（.eslintignore）

以通过在项目根目录创建一个 .eslintignore 文件告诉 ESLint 去忽略掉不需要检测的文件或者目录

* 方法一: 新建.eslintignore文件

```.eslintignore
test.js
```

* 方法二: 通过package.json文件设置

package.json

```js
{
  "name": "my_project",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": ""
  },
  "eslintConfig": { // 也可配置eslint
    "env": {
      "es6": true,
      "node": true
    }
  },
  "eslintIgnore": ["test.js"]
}

```

## 结合 pre-commit 使用

eslint 可以结合 pre-commit 插件使用，目的是在 package.json 的 scripts 之前对一些指定的命令提前运行, 相当于一个勾子

```js
//npm install --save-dev pre-commit

//package.json 文件
"scripts": {
  "dev": "node app",
  "lint": "eslint .",
  "fix": "eslint --fix ."
},
"pre-commit": [
  "fix",
  "lint"
],

//执行git commit -m 'test' 提交代码时 会先执行pre-commit中的代码
```