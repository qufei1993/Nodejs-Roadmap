import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux';
import HomeHeader from '../../components/HomeHeader';
import Category from '../../components/Category';
import Ad from './subpage/Ad';
import List from './subpage/List';

class Home extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); 
	}
	render(){
		return(
			<div>
				<HomeHeader cityName={this.props.userinfo.cityName}/>
				<Category />
				<div class="l-10"></div>
				<Ad />
				<div class="l-10"></div>
				<List cityName={this.props.userinfo.cityName}/>
			</div>
		)
	}
}
function mapStateToProps(state){
	return{
		userinfo:state.userinfo
	}
}
function mapDispatchToProps(dispatch){
	return{} //此处只需获取数据，不需要设置数据
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);