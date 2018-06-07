import React from 'react';

import localStore from '../util/localStore';
import {CITYNAME} from '../config/localStoreKey';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userInfoActionsFormOtherFile from '../actions/userinfo'


class App extends React.Component{
	constructor(props,context){
		super(props,context);
		this.state={
			initDone:false
		}
	}
	componentDidMount(){
		//从localStore里面获取城市信息
		let cityName = localStore.getItem(CITYNAME);
		if (cityName == null) {
			cityName = '北京'
		}

		//将城市信息存储到 Redux 中
		this.props.userInfoActions.update({
			cityName:cityName
		})
		this.setState({
			initDone:true
		})					
	}
	render(){
		return(
			<div>
				{
					this.state.initDone ? 
						this.props.children
					:
						<div>正在加载中。。。。。</div>
				}
			</div>
		)
	}
}

function mapStateToProps(state){
	return{} //返回空,此处只需要设置城市信息,不需要获取展示
}
function mapDispatchToProps(dispatch){
	return{
		userInfoActions:bindActionCreators(userInfoActionsFormOtherFile,dispatch)
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App); //返回一个函数 再把App传入
