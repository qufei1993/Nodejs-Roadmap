import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './style.less'

class LoginComponent extends React.Component{
	constructor(props,context){
		super(props,context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); 
		this.state = {
			username:''
		}
	}
	render(){
		return(
			<div class="login">
				<div class="login-bg">
					<span class="login-title">大众点评</span>
				</div>
				<div id="login-container">
	                <div className="input-container phone-container">
	                    <i className="icon-tablet"></i>
	                    <input 
	                        type="text" 
	                        placeholder="输入手机号" 
	                        value={this.state.username}
	                        onChange={this.changeHandle.bind(this)} 
	                    />
	                </div>
	                <div className="input-container password-container">
	                    <i className="icon-key"></i>
	                    <button>发送验证码</button>
	                    <input type="text" placeholder="输入验证码"/>
	                </div>
	                <button className="btn-login"  onClick={this.clickHandle.bind(this)}>登录</button>
	            </div>
			</div>

		)
	}
	changeHandle(e){
		this.setState({
			username:e.target.value
		})
	}
	clickHandle(){
		const username = this.state.username;
		const loginHandle = this.props.loginHandle;
		loginHandle(username);
	}
	
}


export default LoginComponent