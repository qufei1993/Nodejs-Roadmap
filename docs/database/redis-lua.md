# Node.js 中实践 Redis Lua 脚本

> 对别人的意见要表示尊重。千万别说："你错了。"——卡耐基

Lua 是一种轻量小巧的脚本语言，用标准 C 语言编写并以源代码形式开放，其设计目的是为了嵌入应用程序中，从而为应用程序提供灵活的扩展和定制功能。由于 Lua 语言具备原子性，其在执行的过程中不会被其它程序打断，对于并发下数据的一致性是有帮助的。

**作者简介**：五月君，Nodejs Developer，慕课网认证作者，热爱技术、喜欢分享的 90 后青年，欢迎关注 [Nodejs技术栈](https://nodejsred.oss-cn-shanghai.aliyuncs.com/node_roadmap_wx.jpg?x-oss-process=style/may) 和 Github 开源项目 [https://www.nodejs.red](https://www.nodejs.red)

## Redis 的两种 Lua 脚本

Redis 支持两种运行 Lua 脚本的方式，一种是直接在 Redis 中输入 Lua 代码，适合于一些简单的脚本。另一种方式是编写 Lua 脚本文件，适合于有逻辑运算的情况，Redis 使用 SHA1 算法支持对脚本签名和 Script Load 预先缓存，需要运行的时候通过签名返回的标识符即可。

下面会分别介绍如何应用 Redis 提供的 EVAL、EVALSHA 两个命令来实现对 Lua 脚本的应用，同时介绍一些在 Node.js 中该如何去应用 Redis 的 Lua 脚本。

## EVAL

Redis 2.6.0 版本开始，通过内置的 Lua 解释器，可以使用 EVAL 命令对 Lua 脚本进行求值

* script：执行的脚本
* numkeys：指定键名参数个数
* key：键名，可以多个（key1、key2），通过 KEYS[1] KEYS[2] 的形式访问
* atg：键值，可以多个（val1、val2），通过 ARGS[1] ARGS[2] 的形式访问

```lua
EVAL script numkeys key [key ...] arg [arg ...]
```

### EVAL Redis 控制台实践

按照上面命令格式，写一个实例如下，通过 KEYS[] 数组的形式访问 ARGV[]，这里下标是以 1 开始，KEYS[1] 对应的键名为 name1，ARGV[2] 对应的值为 val2

```lua
127.0.0.1:6379> EVAL "return redis.call('SET', KEYS[1], ARGV[2])" 2 name1 name2 val1 val2
OK
```

执行以上命令，通过 get 查看 name1 对应的值为 val2

```bash
127.0.0.1:6379> get name1
"val2"
```

注意：以上命令如果不使用 return 将会返回 (nil)

```lua
127.0.0.1:6379> EVAL "redis.call('SET', KEYS[1], ARGV[2])" 2 name1 name2 val1 val2
(nil)
```

### redis.call VS redis.pcall

redis.call 和 redis.pcall 是两个不同的 Lua 函数来调用 redis 命令，两个命令很类似，区别是如果 redis 命令中出现错误异常，redis.call 会直接返回一个错误信息给调用者，而 redis.pcall 会以 Lua 的形式对错误进行捕获并返回。

**使用 redis.call**

这里执行了两条 Redis 命令，第一条故意写了一个 SET_ 这是一个错误的命令，可以看到出错后，错误信息被抛出给了调用者，同时你执行 get name2 会得到 (nil)，第二条命令也没有被执行

```bash
127.0.0.1:6379> EVAL "redis.call('SET_', KEYS[1], ARGV[2]); redis.call('SET', KEYS[2], ARGV[3])" 2 name1 name2 val1 val2 val3
(error) ERR Error running script (call to f_bf814e38e3d98242ae0c62791fa299f04e757a7d): @user_script:1: @user_script: 1: Unknown Redis command called from Lua script 
```
**使用 redis.pcall**

和上面同样的操作，使用 redis.pcall 可以看到输出结果为 (nil) 它的错误被 Lua 捕获了，这时我们在执行 get name2 会得到一个设置好的结果 val3，这里第二条命令是被执行了的。

```bash
EVAL "redis.pcall('SET_', KEYS[1], ARGV[2]); redis.pcall('SET', KEYS[2], ARGV[3])" 2 name1 name2 val1 val2 val3
(nil)
```

### EVAL 在 Node.js 中实现

[ioredis](https://github.com/luin/ioredis) 支持所有的脚本命令，比如 EVAL、EVALSHA 和 SCRIPT。但是，在现实场景中使用它是很繁琐的，因为开发人员必须注意脚本缓存，并检测何时使用 EVAL，何时使用 EVALSHA。ioredis 公开了一个 defineCommand 方法，使脚本更容易使用。

```js
const Redis = require("ioredis");
const redis = new Redis(6379, "127.0.0.1");

const evalScript = `return redis.call('SET', KEYS[1], ARGV[2])`;

redis.defineCommand("evalTest", {
    numberOfKeys: 2,
    lua: evalScript,
})

async function eval() {
    await redis.evalTest('name1', 'name2', 'val1', 'val2');
    const result = await redis.get('name1');
    console.log(result); // val2
}

eval();
```

## EVALSHA

EVAL 命令要求你在每次执行脚本的时候都发送一次脚本主体 (script body)。Redis 有一个内部的缓存机制，因此它不会每次都重新编译脚本，通过 EVALSHA 来实现，根据给定的 SHA1 校验码，对缓存在服务器中的脚本进行求值。SHA1 怎么生成呢？通过 script 命令，可以对脚本缓存进行操作

* SCRIPT FLUSH：清除所有脚本缓存
* SCRIPT EXISTS：检查指定的脚本是否存在于脚本缓存
* SCRIPT LOAD：将一个脚本装入脚本缓存，但并不立即运行它
* SCRIPT KILL：杀死当前正在运行的脚本

**EVALSHA 命令格式**

同上面 EVAL 不同的是前面 EVAL script 换成了 EVALSHA sha1

```lua
EVALSHA sha1 numkeys key [key ...] arg [arg ...]
```

### EVALSHA Redis 控制台实践

载入脚本缓存

```lua
127.0.0.1:6379> SCRIPT LOAD "redis.pcall('SET', KEYS[1], ARGV[2]);"
"2a3b189808b36be907e26dab7ddcd8428dcd1bc8"
```

以上脚本执行之后会返回一个 SHA-1 签名过后的标识字符串，这个字符串用于下面命令执行签名之后的脚本

```lua
127.0.0.1:6379> EVALSHA 2a3b189808b36be907e26dab7ddcd8428dcd1bc8 2 name1 name2 val1 val2
```

进行 get 操作读取 name1 的只为 val2

```lua
127.0.0.1:6379> get name1
"val2"
```

### EVALSHA 在 Node.js 中实现

分为三步：缓存脚本、执行脚本、获取数据

```js
const Redis = require("ioredis");
const redis = new Redis(6379, "127.0.0.1");

const evalScript = `return redis.call('SET', KEYS[1], ARGV[2])`;

async function evalSHA() {
    // 1. 缓存脚本获取 sha1 值
    const sha1 = await redis.script("load", evalScript);
    console.log(sha1); // 6bce4ade07396ba3eb2d98e461167563a868c661

    // 2. 通过 evalsha 执行脚本
    await redis.evalsha(sha1, 2, 'name1', 'name2', 'val1', 'val2');

    // 3. 获取数据
    const result = await redis.get("name1");
    console.log(result); // "val2"
}

evalSHA();
```

## Lua 脚本文件

有逻辑运算的脚本，可以编写 Lua 脚本文件，编写一些简单的脚本也不难，可以参考这个教程 [https://www.runoob.com/lua/lua-tutorial.html](https://www.runoob.com/lua/lua-tutorial.html)

**Lua 文件**

以下是一个测试代码，通过读取两个值比较返回不同的值，通过 Lua 脚本实现后可以多条 Redis 命令的原子性。

```lua
-- test.lua

-- 先 SET
redis.call("SET", KEYS[1], ARGV[1])
redis.call("SET", KEYS[2], ARGV[2])

-- GET 取值
local key1 = tonumber(redis.call("GET", KEYS[1]))
local key2 = tonumber(redis.call("GET", KEYS[2]))

-- 如果 key1 小于 key2 返回 0
-- nil 相当于 false
if (key1 == nil or key2 == nil or key1 < key2) 
then 
    return 0
else 
    return 1
end
```

**Node.js 中加载 Lua 脚本文件**

和上面 Node.js 中应用 Lua 差别不大，多了一步，通过 fs 模块先读取 Lua 脚本文件，在通过 eval 或者 evalsha 执行。

```js
const Redis = require("ioredis");
const redis = new Redis(6379, "127.0.0.1");
const fs = require('fs');

async function test() {
    const redisLuaScript = fs.readFileSync('./test.lua');
    const result1 = await redis.eval(redisLuaScript, 2, 'name1', 'name2', 20, 10);
    const result2 = await redis.eval(redisLuaScript, 2, 'name1', 'name2', 10, 20);
    console.log(result1, result2); // 1 0
}

test();
```