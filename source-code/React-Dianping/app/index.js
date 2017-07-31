import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {hashHistory} from 'react-router'
import configureStore from './store/configureStore'

import './static/css/common.less'
import './static/css/font.css'

import RouteMap from './router/routeMap';

//性能检测
import Perf from 'react-addons-perf'
if (__DEV__) { 
	window.Perf = Perf
}

const store = configureStore();

render(
    <Provider store={store}>
    	<RouteMap history={hashHistory} />
    </Provider>,
    document.getElementById('app')
)
