import React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './style.less';

class CurrentCity extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		return(
			<div class="current-city">
				<Link to="/" class="city-name">{this.props.cityName}</Link>
			</div>
		)
	}
}
export default CurrentCity;