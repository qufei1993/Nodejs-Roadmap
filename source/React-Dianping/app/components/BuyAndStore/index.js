import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'

import './style.less'

class BuyAndStore extends React.Component{
	constructor(props,context){
		super(props,context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); 
	}
	render(){
		return(
			<div class="buy">
				{
					this.props.isStore ? 
						<div class="last">
					    	<a class="buy-btn" onClick={this.storeClickHandle.bind(this)}>取消收藏</a>
					    </div>
					:
						<div class="last">
					    	<a class="buy-btn buy-btn-gray" onClick={this.storeClickHandle.bind(this)}>立即收藏</a>
					    </div>
				}
			    <div class="last">
			    	<a class="buy-btn" onClick={this.buyClickHandle.bind(this)}>立即购买</a>
			    </div>
			</div>
		)
	}
	storeClickHandle(){
		this.props.storeHandle();
	}
	buyClickHandle(){
		this.props.buyHandle();
	}
}
export default BuyAndStore