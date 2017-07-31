import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Item from './subpage/Item';
import './style.less';

class List extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		var data = this.props.data
		return(
			<div class="list-content">
				{
					data.map((item,index) => {
						return <Item key={index} item={item}/>
					})
				}
			</div>
		)
	}
}
export default List;