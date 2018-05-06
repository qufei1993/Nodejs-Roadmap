# crypto

> crypto加密模块是C／C++实现这些算法后，暴露为javascript接口的模块，包含对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

## Cipher

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
