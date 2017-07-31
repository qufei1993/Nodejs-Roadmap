import React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactSwipe from 'react-swipe';
import Star from '../Star';
import './style.less';

class DetailInfo extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.state = {
			index:0
		}
	}
	render(){
		var opt = {
			auto:2000,
			callback:function(index){
				this.setState({index:index});
			}.bind(this)
		}
		var data = this.props.data;
		return(
			<div>
				<div class="slide">
					<ReactSwipe class="slide-swipe" swipeOptions={opt}>
		                {data.img.map((item,index) => {
		                	return <div class="slide-item" key={index}>
		                		<img src={item} />
		                	</div>
		                })}
		            </ReactSwipe>
		            <div class="slide-span">
	        			<span class="slide-span-fff">{this.state.index + 1}</span>/<span>{data.img.length}</span>
	        		</div>
		            <div class="cont">
		    			<h3>{data.title}</h3>
		    			<p>{data.subTitle}</p>
		    		</div>
				</div>
				<div class="star">
					<Star star={data.star}/>
				</div>
				<div class="buy-box">
				    <div class="price">¥
				    <span class="sum">{data.price}</span></div>
				    <div class="past Fix">
				        <span class="o-price">¥{data.oPrice}</span>
				    </div>
				</div>
			</div>
		)
	}
}
export default DetailInfo;