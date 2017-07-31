import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'

import * as storeActionsFromFile from '../../../actions/store'
import BuyAndStore from '../../../components/BuyAndStore'

class Buy extends React.Component{
	constructor(props,context){
		super(props,context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); 
        this.state = {
            isStore: false
        }
	}
	render(){
		return(
			<div>
				<BuyAndStore isStore={this.state.isStore} buyHandle={this.buyHandle.bind(this)} storeHandle={this.storeHandle.bind(this)}/>
			</div>
		)
	}
	componentDidMount() {
		//验证当前商户是否收藏
		this.checkStoreState()
	}
	//检查当前商户是否被收藏
	checkStoreState(){
		const id = this.props.id;
		const store = this.props.store
		//console.log(store); //收藏的所有信息
		
		store.some(item => {
			if (item.id == id) {
				//已经被收藏
				this.setState({
					isStore:true
				})
				//退出循环
				return true
			}
		})
	}
	//收藏事件
	storeHandle(){
		//验证登录 未登录 return
		const loginFlag = this.loginCheck()
		if (!loginFlag) {
			return
		}
		const id = this.props.id;
		const storeActions = this.props.storeActions
		//console.log(this.props.storeActions);
		if (this.state.isStore) {
			//已经收藏 点击 取消收藏
			storeActions.rm({id:id})
		}else{
			//未收藏 点击 添加到收藏
			storeActions.add({id:id});
		}

		//修改 isStore 状态
		this.setState({
			isStore:!this.state.isStore
		}); 

	}
	// 检查登录状态 
	loginCheck() { //返回true表示 已登录
		const id = this.props.id 
		const userinfo = this.props.userinfo 
		if (!userinfo.username) { 
			// 跳转到登录页面的时候，要传入目标router，以便登录完了可以自己跳转回来 
			hashHistory.push('/Login/' + encodeURIComponent('/detail/' + id)) 
			return false 
		} 
		return true 
	}
	// 购买事件 
	buyHandle() { 
		// 验证登录，未登录则return 
		const loginFlag = this.loginCheck() 
		if (!loginFlag) { 
			return 
		} 
		// 此过程为模拟购买，因此可省去复杂的购买过程 // 跳转到用户主页 
		hashHistory.push('/User') 
	}

	
}

function mapStateToProps(state) { 
	return { 
		userinfo: state.userinfo,
		store:state.store
	} 
} 
function mapDispatchToProps(dispatch) { 
	return {
		storeActions:bindActionCreators(storeActionsFromFile,dispatch)
	} 
} 
export default connect( 
	mapStateToProps, mapDispatchToProps 
)(Buy)
