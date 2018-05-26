
## flux后起之秀Mobx结合react实现倒计时

> Mobx是flux实现的后起之秀，其以更简单的使用和更少的概念，让flux使用起来变得更加简单。相比Redux有mutation、action、dispatch等概念，Mobx则更符合对一个store增删改查的操作概念。

## 文档地址

* [中文阅读地址 https://cn.mobx.js.org/](https://cn.mobx.js.org/)

* [英文阅读地址 https://mobx.js.org/](https://mobx.js.org/)

## 引入mobx

```
npm install mobx --save
```

```bash
npm install mobx-react --save # mobx-react是mobx用来链接react的工具
```

## 配置项目环境支持装饰器

* 安装依赖插件

```
npm i babel-plugin-transform-decorators-legacy babel-preset-stage-1 --save-dev
```

* 修改.babelrc文件

```.babelrc
 {
    "presets": [
        "stage-1", // 不属于ES6语法，ESNext语法
    ],
    "plugins": [
        "transform-decorators-legacy", // 一定要放在plugins的最前面
    ]
 }

```

## 常用标签介绍

* @observable 装饰器可以在ES7或者ts类的属性中使用，用于在实例化字段和属性getter上使用。
* @computed
* @autorun
* @action
* @observer  store更新之后，react组件中的内容也要去更新
* @inject 拿到定义在Provider上面的内容

## mobx实现倒计时实例

* 项目地址

``` https://github.com/Q-Angelo/react-cnode/tree/mobx ```

* 实例演示
    * git clone git@github.com:Q-Angelo/react-cnode.git
    * cd react-cnode
    * git checkout mobx 切换分支
    * npm i
    * npm run dev:client 开启测试环境 客户端代码
    * 客户端访问地址: http://localhost:8888/

* 新建 app-state.js

```js
    import {
        observable,
        computed,
        autorun,
        action,
    } from 'mobx';

    export class Appstate {
        @observable count = 10;
        @observable name = 'Jack';
        @computed get msg() {
            return `${this.name} say 倒计时还剩 ${this.count} 秒`;
        }
        @action add() {
            if (this.count > 0) {
                this.count -= 1;
            }
        }
        @action changeName(name) {
            this.name = name;
        }
    }

    const appState = new Appstate();

    setInterval(() => {
        appState.add();
    }, 1000);

    autorun(() => {
        console.log(appState.msg);
    });

    export default appState;
```

* 在app.js入口文件将store传入组件内部

```js
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

import App from './views/App.jsx';
import appState from './store/app-state';

const root = document.getElementById('root');
const render = (Component) => {
    ReactDom.render(
        <AppContainer>
            <Provider appState={appState} >
                <BrowserRouter>
                    <Component />
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        root,
    );
}

render(App);

if (module.hot) {
    module.hot.accept('./views/App.jsx', () => {
    const NextApp = require('./views/App.jsx').default; // eslint-disable-line
        render(NextApp);
    });
}
```

* 实现倒计时组件

```js
import React from 'react';
import {
    observer,
    inject,
} from 'mobx-react';
import PropTypes from 'prop-types';
import { AppState } from '../../store/app-state';

/**
 * inject拿到定义在provider上面的东西
 * 声明observer，store里面的内容更新之后，组建中的值也将更新
 */
@inject('appState') @observer
class TopicList extends React.Component {
    constructor() {
        super();
        this.onChangeName = this.onChangeName.bind(this);
    }

    componentDidMount() {
        // todo:
    }

    onChangeName(event) {
        this.props.appState.changeName(event.target.value)
    }

    render() {
        return (
            <div>
                {
                    this.props.appState.count > 0 ?
                        <div>
                            <input type="text" defaultValue={this.props.appState.name} style={{ border: '1px solid #000' }} onChange={this.onChangeName} />
                            <span> {this.props.appState.msg} </span>
                        </div>
                        :
                        '倒计时结束！'
                }
            </div>
        )
    }
}

export default TopicList;

/**
 * react开发中有一个强烈的建议， 我们写的组件用到的props都要去声明它的类型，以防在写代码时候乱用props出现的一些问题。
 */
/* TopicList.proptypes = {
    appState: PropTypes.object.isRequired,
} */

/**
 * js中万物皆对象，所以采用以下方法验证appState是不是class AppState的实例
 */

TopicList.propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
}
```
