import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Link } from 'react-router'
import './style.less'

class SearchInput extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.state = {
			value:''
		}
	}
	render(){
		return(
			<input
				class="search-input"
				type="text"
				placeholder="输入商户名、地点"
				value={this.state.value}
				onChange={this.handleChange.bind(this)}
				onKeyUp={this.handleKeyUp.bind(this)}/>
		)
	}
	componentDidMount(){
		this.setState({
			value:this.props.value || ''
		});
	}
	handleChange(e){
		this.setState({
			value:e.target.value
		});
	}
	handleKeyUp(e){
		//不是回车返回
		if (e.keyCode !== 13) {
			return
		}
		this.props.enterHandle(this.state.value);
	}
}
export default SearchInput