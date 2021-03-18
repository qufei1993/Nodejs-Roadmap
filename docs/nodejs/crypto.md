# Crypto加解密模块

> Crypto 加密模块是 C／C++ 实现这些算法后，暴露为 javascript 接口的模块，包含对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

## 快速导航

- [Cipher对称密钥加密](#Cipher)
    - [Cipher加解密实例演示](#Cipher加解密实例演示)
- [MD5加密](#MD5加密)
    - [MD5作用与特点](#MD5作用与特点)
    - [MD5三种实现方式](#MD5三种实现方式)
    - [MD5加解密实例演示](#MD5加解密实例演示)

## Cipher

> Cipher 类用于加密数据，属于对称密钥加密，假设通信双方 A、B 通讯方 A 使用 key 对明文进行加密传输，通讯方 B 接收到密文后，使用同样的 key 进行解密得到明文。

#### AES/ECB/PKCS5Padding

* ```AES```：代表算法

* ```ECB```：代表模式

* ```PKCS5Padding```：代表填充量


#### 与java、c#等语言交互踩过的坑

> 和 java 程序进行交互的时候，Java 那边使用 AES 128 位填充模式：AES/CBC/PKCS5Padding 加密方法，在 Nodejs 中采用对应的 aes-128-cbc 加密方法就能对应上，因为有使用向量（iv），但是 Nodejs 语言本身不默认自动填充，所以 Nodejs 中要用 createCipheriv 方法，来补全填充量，而不是 createCipher。

#### 查看系统所支持的算法

使用 ```openssl list-cipher-algorithms``` 可以查看系统所支持的算法 

<pre>
aes-128-cbc    aes-128-ecb    aes-192-cbc    aes-192-ecb    aes-256-cbc
aes-256-ecb    base64         bf             bf-cbc         bf-cfb
bf-ecb         bf-ofb         cast           cast-cbc       cast5-cbc
cast5-cfb      cast5-ecb      cast5-ofb      des            des-cbc
des-cfb        des-ecb        des-ede        des-ede-cbc    des-ede-cfb
des-ede-ofb    des-ede3       des-ede3-cbc   des-ede3-cfb   des-ede3-ofb
des-ofb        des3           desx           rc2            rc2-40-cbc
rc2-64-cbc     rc2-cbc        rc2-cfb        rc2-ecb        rc2-ofb
rc4            rc4-40         seed           seed-cbc       seed-cfb
seed-ecb       seed-ofb
</pre>

#### Cipher加解密实例演示

> **注意**：[crypto.createCipher](http://nodejs.cn/api/crypto.html#crypto_crypto_createcipher_algorithm_password_options) 已废弃，推荐使用 [crypto.createCipheriv](http://nodejs.cn/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options)

**数据加密**
* ```crypto.createCipheriv(algorithm, pwd, iv) ``` 指定算法、密码、向量创建 cipher 加密对象

```js
function cipher(str){
    try{
        const crypto = require('crypto');
        const cipher = crypto.createCipheriv('des-ecb', '12345678', '');

        /**
         * update方法
         * 第一个参数代表加密的数据
         * 第二参数代表传入数据的格式，可以是'utf8', 'ascii', 'latin1'
         * 第三个参数代表加密数据的输出格式，可以是'latin1'， 'base64' 或者 'hex'。没有执行则返回Buffer
         */
        let encrypted = cipher.update(str, 'utf8', 'hex');

            /**
             * final方法，返回任何加密的内容
             * 参数可以是'latin1', 'base64' 或者 'hex'，没有指定返回Buffer
             */
            encrypted += cipher.final('hex');

        return encrypted;
    }catch(e){
        console.log('加密失败');

        return e.message || e;
    } 
}

cipher('hello world ！！！') // 81c66a1d39d302205c55f0afac95c06bc985155d4ddb751c
```

**数据解密**

* ```crypto.createDecipheriv(algorithm, pwd, iv)``` 指定算法、密码、向量创建 decipher 解密对象

```js
function decipher(encrypted){
    try{
        const crypto = require('crypto');
        // const decipher = crypto.createDecipher('des-ecb', '123456');

        const decipher = crypto.createDecipheriv('des-ecb', '12345678', '');

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

        return decrypted;
    }catch(e){
        console.log('解密失败');

        return e.message || e;
    }
}

decipher('81c66a1d39d302205c55f0afac95c06bc985155d4ddb751c'); // hello world ！！！
```

## MD5加密

#### MD5作用与特点

* 作用

> 是让大容量信息在数字签名软件签署私人秘钥前被 “压缩” 成一种保密格式，也就是把一个任意长度的字节串变换成一定长度的十六进制数字串（32个字符）
一致性验证

* 特点
    * 不可逆
    * 输入两个不同的明文不会得到相同的输出值
    * 根据输出值，不能得到原始的明文，即过程不可逆

#### MD5三种实现方式

- **```crypto.createHash(algorithm)```**

创建并返回一个 hash 对象，它是一个指定算法的加密 hash，用于生成 hash 摘要。

参数 algorithm 可选择系统上安装的 OpenSSL 版本所支持的算法。例如：```sha1、md5、sha256、sha512``` 等。在近期发行的版本中，```openssl list-message-digest-algorithms``` 会显示这些可用的摘要算法。

- **```hash.update(data)```**

更新 hash 的内容为指定的 data。当使用流数据时可能会多次调用该方法。

- **```hash.digest(encoding='binary')```**

计算所有传入数据的 hash 摘要。参数 encoding（编码方式）可以为 ```hex、binary、base64```。

#### MD5加解密实例演示

```js
const crypto = require('crypto');
const md5 = str => {
    return crypto.createHash('md5').update(str, 'utf8').digest('hex')
};

// 默认输出长度为32位小写字母
// 25f9e794323b453885f5181f1b624d0b
console.log(md5('123456789')); 

// 以下转换为32位大写字母
// 25F9E794323B453885F5181F1B624D0B
console.log(md5('123456789').toUpperCase()); 
```
