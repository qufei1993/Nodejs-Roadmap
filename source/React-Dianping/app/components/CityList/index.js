import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './style.less';

class CityList extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		return(
			<div class="hot-trade">
			    <div class="hd">热门城市</div>
			    <div class="home-place-list">
			        <ul class="J_citylist">
			            <li><span onClick={this.clickHandle.bind(this,'北京')}>北京</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'成都')}>成都</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'重庆')}>重庆</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'广州')}>广州</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'杭州')}>杭州</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'南京')}>南京</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'上海')}>上海</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'深圳')}>深圳</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'苏州')}>苏州</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'天津')}>天津</span></li>
			            <li><span onClick={this.clickHandle.bind(this,'武汉')}>武汉</span></li>
				        <li><span onClick={this.clickHandle.bind(this,'西安')}>西安</span></li>
			        </ul>
			    </div>
			    <div class="hd">更多城市</div>
			    <div class="home-place-list">
			        <ul class="J_citylist">
			            <li><span>A</span></li>
			            <li><span>B</span></li>
			            <li><span>C</span></li>
			            <li><span>D</span></li>
			            <li><span>E</span></li>
			            <li><span>F</span></li>
			            <li><span>G</span></li>
			            <li><span>H</span></li>
			            <li><span>I</span></li>
			            <li><span>J</span></li>
			        </ul>
			    </div>
			</div>
		)
	}
	clickHandle(cityName) {
        const changeFn = this.props.changeFn
        changeFn(cityName)
    }
}
export default CityList;