# Node.js v17 版本发布


Node.js v17 版本已发布，取代了 v16 做为当前版本，新的 v17 版本提供了一些新功能：基于 Promise 的其它核心模块 API、错误堆栈尾部增加 Node.js 版本信息、OpenSSL 3.0 支持、v8 JavaScript 引擎更新至 9.5。


## 基于 Promise 的 API


Node.js 项目的一项持续性战略计划是为 Node.js 核心模块提供基于 Promise 的 API 支持，近年来已为 `timer`、`stream` 模块提供了 Promise API 支持。
​

Node.js v17 版本为 `readline` 模块提供了基于 Promise 的 API 支持。该模块提供了一个接口用于从一个可读流对象逐行读取数据。
​

结合 `process.stdin` 可读取用户在终端输入的数据。如下例所示：
​

```javascript
// test.mjs
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from 'process';
const rl = readline.createInterface({ input, output });
const answer = await rl.question('“Nodejs技术栈” 的域名是什么：');
console.log(`答案: ${answer}`);
rl.close();
```
运行之后，效果如下所示：
​

![image.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1635141283996-be42791a-cdfd-4330-8bc7-5335f0adf0be.png#clientId=u5d4f5a32-3bbf-4&from=paste&height=71&id=u2637bcbe&margin=%5Bobject%20Object%5D&name=image.png&originHeight=142&originWidth=1362&originalType=binary&ratio=1&size=26213&status=done&style=none&taskId=ue9260c32-e844-49cb-834b-8b8133a2ea3&width=681)
​

readline 模块的更多信息参考 [readline_readline](https://nodejs.org/api/readline.html#readline_readline)。
​

## 错误堆栈增加 Node.js 版本


堆栈跟踪是诊断应用程序错误信息的重要组成部分，在 Node.js v17 版本中，如果因为一些致命的错误导致进程退出，在错误堆栈的尾部将包含 Node.js 的版本信息。
​

![image.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1635141761601-74d7afef-3745-4975-a952-a4cda2563e2d.png#clientId=u5d4f5a32-3bbf-4&from=paste&height=345&id=u7fa6e5c6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=690&originWidth=1390&originalType=binary&ratio=1&size=103748&status=done&style=none&taskId=ub879339a-ab29-461c-afd1-19c8e26f2e8&width=695)
​

如果想忽略该信息，运行时在命令行指定 `--no-extra-info-on-fatal-exception` 标志。
​

## OpenSSL 3.0 支持


Node.js v17 版本包含了近期发布的 OpenSSL 3.0，根据 OpenSSL 的发布策略，OpenSSL 1.1.1 将在 2023-09-11 结束支持，这个日期也在 Node.js v18 LTS 结束日期之前。
​

因为 OpenSSL 3.0 对允许的算法和密钥大小增加了严格的限制，预计会对生态系统造成一些影响，在 Node.js v17 版本包含 OpenSSL 3.0 以便在下一个 LTS 版本之前为用户的测试和反馈留出时间。
​

例如，md4 这是 OpenSSL 3.0 默认不再允许的一个算法，如果是在 Node.js 17 之前的 Node 版本中，应用程序是可以正常运行的，但在 Node.js v17 中将抛出一个 error code 为 `ERR_OSSL_EVP_UNSUPPORTED` 的错误信息。
```javascript
import crypto from 'crypto';
console.log(crypto.createHash('md4').update('123', 'utf8').digest('hex'))
```


Node.js v17 版本下运行之后得到如下错误信息。


![image.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1635142569504-7a220c8b-a5bc-4fc7-9b19-9f58f77dde38.png#clientId=u5d4f5a32-3bbf-4&from=paste&height=489&id=u52501397&margin=%5Bobject%20Object%5D&name=image.png&originHeight=978&originWidth=1796&originalType=binary&ratio=1&size=220583&status=done&style=none&taskId=uf770d526-c2cb-44ea-9fa3-1298f27f9ac&width=898)


一个临时的解决方法是运行时增加 `--openssl-legacy-provider` 标志，应用程序不在报错。
​

```javascript
$ node --openssl-legacy-provider test.mjs
c58cda49f00748a3bc0fcfa511d516cb
```
​

## V8 更新至 9.5


v8 在 8.1 版本开启了 [Intl.DisplayNames API](https://v8.dev/features/intl-displaynames)，支持语言、区域、货币、脚本四种类型，现在添加了两种新的类型：calendar、dateTimeField，分别返回不同的日历类型和日期时间字段的显示名称。对于国际化应用很有帮助。
​

```javascript
const esCalendarNames = new Intl.DisplayNames(['zh'], { type: 'calendar' });
console.log(esCalendarNames.of('roc'));  // 民国纪年
const enCalendarNames = new Intl.DisplayNames(['en'], { type: 'calendar' });
console.log(enCalendarNames.of('roc'));  // Minguo Calendar
```


日期时间字段国际化名称展示。


```javascript
function printDate(dateTimeField) {
  console.log(
    `${dateTimeField.of('year')} ${dateTimeField.of('month')} ${dateTimeField.of('day')}`
  );
}
printDate(new Intl.DisplayNames(['zh'], { type: 'dateTimeField' })) // 年 月 日
printDate(new Intl.DisplayNames(['en'], { type: 'dateTimeField' })) // year month day
printDate(new Intl.DisplayNames(['KOR'], { type: 'dateTimeField' })) // 년 월 일
printDate(new Intl.DisplayNames(['THA'], { type: 'dateTimeField' })) // ปี เดือน วัน

```


Intl.DateTimeFormat API 在 v8 9.5 版本中为 timeZoneName 选项新增加了四个值：shortGeneric、longGeneric、shortOffset、longOffset。
​

通过以下代码示例可看到之间的区别。
​

```javascript
console.log(new Intl.DateTimeFormat('zh').format(new Date())); // 2021/01/01
console.log(new Intl.DateTimeFormat('zh', { timeZoneName: 'shortGeneric' }).format(new Date())); // 2021/01/01 中国时间
console.log(new Intl.DateTimeFormat('zh', { timeZoneName: 'longGeneric' }).format(new Date())); // 2021/01/01 中国标准时间
console.log(new Intl.DateTimeFormat('zh', { timeZoneName: 'shortOffset' }).format(new Date())); // 2021/01/01 GMT+8
console.log(new Intl.DateTimeFormat('zh', { timeZoneName: 'longOffset' }).format(new Date())); // 2021/01/01 GMT+08:00

```


参见 [v8 9.5 release 文档](https://v8.dev/blog/v8-release-95) 阅读更多信息。


## 其它信息


按照 Node.js 发布时间表，Node.js v12 将于 2022 年 4 月结束生命周期。Node.js v16 在 2021 年 10 月 26 升级为 LTS，即长期支持版本。
​

**Node.js 的奇数版本不是稳定的版本（例如，当前的 Node.js v17 ），它的生命周期很短，不要用于生产环境**。
​

对 Node.js 版本信息不了的、不知道如何安装 Node.js 的参考文章 [“Node.js 版本知多少？又该如何选择？”](https://mp.weixin.qq.com/s/dFhTLVswwQqRaLybKuQ_XQ)。


## Reference


- [https://medium.com/the-node-js-collection/node-js-17-is-here-8dba1e14e382](https://medium.com/the-node-js-collection/node-js-17-is-here-8dba1e14e382)
- [https://nodejs.org/en/blog/release/v17.0.0/](https://nodejs.org/en/blog/release/v17.0.0/)
