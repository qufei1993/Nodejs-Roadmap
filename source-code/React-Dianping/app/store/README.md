### 创建store
```javascript
createStore(rootReducer, initialState,window.devToolsExtension ? window.devToolsExtension() : undefined)
```
第一个参数是这个规则  
第二个参数是初始化的数据  
第三个参数可调起chrome 扩展程序，具体可参见   [redux-devtools](https://github.com/gaearon/redux-devtools)
