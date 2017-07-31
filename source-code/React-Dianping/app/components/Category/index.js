import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactSwipe from 'react-swipe';
import { Link } from 'react-router';

import './style.less';

class Category extends React.Component{
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
		return(
			<div class="home-category">
				<ReactSwipe swipeOptions={opt}>
	                <ul class="carousel-item clear-fix">
	                	<Link to="/search/meishi"><li class="meishi">美食</li></Link>
	                	<Link to="/search/mydy"><li class="mydy">猫眼电影</li></Link>
	                	<Link to="/search/jiudian"><li class="jiudian">酒店</li></Link>
	                	<Link to="/search/xxyl"><li class="xxyl">休闲娱乐</li></Link>
	                	<Link to="/search/waimai"><li class="waimai">外卖</li></Link>
	                	<Link to="/search/huoguo"><li class="huoguo">火锅</li></Link>
	                	<Link to="/search/liren"><li class="liren">丽人</li></Link>
	                	<Link to="/search/zby"><li class="zby">周边游</li></Link>
	                	<Link to="/search/ktv"><li class="ktv">KTV</li></Link>
	                	<Link to="/search/hssy"><li class="hssy">婚纱摄影</li></Link>
	                </ul>
	                <ul class="carousel-item clear-fix">
	                	<Link to="/search/shfw"><li class="shfw">生活服务</li></Link>
	                	<Link to="/search/jingdian"><li class="jingdian">景点</li></Link>
	                	<Link to="/search/aiche"><li class="aiche">爱车</li></Link>
	                	<Link to="/search/ydjs"><li class="ydjs">运动健身</li></Link>
	                	<Link to="/search/gouwu"><li class="gouwu">购物</li></Link>
	                	<Link to="/search/qinzi"><li class="qinzi">亲子</li></Link>
	                	<Link to="/search/jiazhuang"><li class="jiazhuang">家装</li></Link>
	                	<Link to="/search/xxpx"><li class="xxpx">学习培训</li></Link>
	                	<Link to="/search/yljk"><li class="yljk">医疗健康</li></Link>
	                	<Link to="/search/daojia"><li class="daojia">到家</li></Link>
	                </ul>
	                <ul class="carousel-item clear-fix">
	                	<Link to="/search/xckc"><li class="xckc">小吃快餐</li></Link>
	                	<Link to="/search/zzc"><li class="zzc">自助餐</li></Link>
	                	<Link to="/search/meifa"><li class="meifa">美发</li></Link>
	                	<Link to="/search/mrmt"><li class="mrmt">美甲美瞳</li></Link>
	                	<Link to="/search/mrspa"><li class="mrspa">美容SPA</li></Link>
	                	<Link to="/search/ssxt"><li class="ssxt">瘦身纤体</li></Link>
	                	<Link to="/search/qzsy"><li class="qzsy">亲子摄影</li></Link>
	                	<Link to="/search/qzyl"><li class="qzyl">亲子游乐</li></Link>
	                	<Link to="/search/yejy"><li class="yejy">幼儿教育</li></Link>
	                	<Link to="/search/qbfl"><li class="qbfl">全部分类</li></Link>
	                </ul>
	            </ReactSwipe>
	            <ul class="index-container">
	            	<li class={this.state.index == 0 ? 'selected' : ''}></li>
	            	<li class={this.state.index == 1 ? 'selected' : ''}></li>
	            	<li class={this.state.index == 2 ? 'selected' : ''}></li>
	            </ul>
            </div>
		)
	}
}
export default Category;