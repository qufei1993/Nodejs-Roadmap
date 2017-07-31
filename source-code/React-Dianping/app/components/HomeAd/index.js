import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './style.less';
import { Link } from 'react-router';

class HomeAd extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		return(
			<div id="home-ad">
				<h2 class="clear-fix">超值特惠<a class="ad-more" href="#">更多优惠</a></h2>
				<div class="ad-container clear-fix">
					{this.props.data.map((item,index) => {
						return <div key={index} class="ad-item fl">
							<Link to={"/detail/"+item.id}>
								<img src={item.img} alt={item.title}/>
							</Link>
						</div>
					})}
				</div>
			</div>
		)
	}
}
export default HomeAd;