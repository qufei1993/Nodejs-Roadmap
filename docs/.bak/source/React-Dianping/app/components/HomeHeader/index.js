import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Link,hashHistory } from 'react-router'
import SearchInput from '../SearchInput'
import './style.less'

class HomeHeader extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		return(
			<div class="home-header clear-fix">
				<div class="home-header-left fl">
					<Link to="/city">
						<span>{this.props.cityName}</span>
						<i className="icon-angle-down"></i>
					</Link>
				</div>
				<div class="home-header-right fr">
					<Link to="/login"><i class="icon-user"></i></Link>
				</div>
				<div class="home-header-middle">
					<div class="search-container">
						<i class="icon-search"></i>
                    	<SearchInput value='' enterHandle={this.enterHandle.bind(this)}/>
					</div>
				</div>
			</div>
		)
	}
	enterHandle(val){
		hashHistory.push('/search/all/'+encodeURIComponent(val));
	}
}
export default HomeHeader