# C++编写NodeJs插件

全局安装 node-gyp 编译c文件

```r 
sudo npm install node-gyp -g
```

* 创建hello.cc文件

```c++
#include <node.h>

namespace hello{
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::String;
    using v8::Value;

    void Method(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
    }

    void init(Local<Object> exports) {
        NODE_SET_METHOD(exports, "hello", Method);
    }

    //NODE_MODULE 后面不是一个函数，后面不要加分号
    NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
```

* 项目根目录创建 binding.gyp 文件

```json
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ] //多个文件 ["hello.cc", "demo.cc"]
    }
  ]
}
```

* 执行 ``` node-gyp configure ``` 命令为当前平台生成相应的项目构建文件

* ``` node-gyp build ``` 命令生成编译后的 addon.node 的文件

* 新建hello.js文件
```javascript

// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// 打印: 'world'
```
