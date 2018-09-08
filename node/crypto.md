# crypto模块实现md5、Cipher等多种加密方式

> crypto加密模块是C／C++实现这些算法后，暴露为javascript接口的模块，包含对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

## cipher

> Cipher类用于加密数据，属于对称密钥加密，假设通信双方A、B，通讯方A使用key对明文进行加密传输，通讯方B接收到密文后，使用同样的key进行解密得到明文。

#### AES/ECB/PKCS5Padding

* DES，代表算法

* ECB，代表模式

* PKCS5Padding，代表填充量


#### 注意与java、c#等语言交互踩过的坑

> 和java程序进行交互的时候，java那边使用AES 128位填充模式：AES/CBC/PKCS5Padding加密方法，在nodejs中采用对应的aes-128-cbc加密方法就能对应上，因为有使用向量（iv），但是nodejs语言本身不默认自动填充，所以nodejs中要用createCipheriv方法，来补全填充量，而不是createCipher。

#### 查看系统所支持的算法

使用openssl list-cipher-algorithms可以查看系统所支持的算法 

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

#### 数据加密

crypto.createCipher('算法', pwd); 创建 cipher加密对象  
crypto.createCipheriv(algorithm, key, iv) 

```js
function cipher(str){
    try{
        const crypto = require('crypto');
        const cipher = crypto.createCipher('des-ecb', '123456');

        // const cipher = crypto.createCipheriv('des-ecb', '12345678', ''); 与其他语言加密采用这种写法

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

#### 数据解密

crypto.createDecipher('算法', pwd); 创建 cipher解密对象  
crypto.createDecipheriv(algorithm, key, iv)

```js
function decipher(encrypted){
    try{
        const crypto = require('crypto');
        const decipher = crypto.createDecipher('des-ecb', '123456');

        // const decipher = crypto.createDecipheriv('des-ecb', '12345678', '');

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

## md5加密

#### md5作用与特点

* 作用

> 是让大容量信息在数字签名软件签署私人秘钥前被"压缩"成一种保密格式，也就是把一个任意长度的字节串变换成一定长度的十六进制数字串（32个字符）
一致性验证

* 特点
    * 不可逆
    * 输入两个不同的明文不会得到相同的输出值
    * 根据输出值，不能得到原始的明文，即过程不可逆

#### 实现md5的3个方法介绍

* crypto.createHash(algorithm)

创建并返回一个hash对象，它是一个指定算法的加密hash，用于生成hash摘要。

参数algorithm可选择系统上安装的OpenSSL版本所支持的算法。例如：'sha1', 'md5', 'sha256', 'sha512'等。在近期发行的版本中，openssl list-message-digest-algorithms会显示这些可用的摘要算法。

* hash.update(data)

更新hash的内容为指定的data。当使用流数据时可能会多次调用该方法。

* hash.digest(encoding='binary')

计算所有传入数据的hash摘要。参数encoding（编码方式）可以为'hex', 'binary' 或者'base64'。

#### 实例

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
