import React from 'react';
import {render} from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router'
import Main from './Main';
import Login from './Login';

module.exports = (
	<Route>
    	<Route path="/" component={Main}/>
       	<Route path="/login" component={Login}/>
    </Route>
)

