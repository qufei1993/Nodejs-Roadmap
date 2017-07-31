import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './style.less';

class LoadMore extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		return(
			<div class="load-more" ref="wrapper">
				{
					this.props.isLoadigMore ?
						<span>加载中...</span>
					:
						<span onClick={this.loadMoreHandle.bind(this)}>加载更多</span>
				}
			</div>
		)
	}
	loadMoreHandle(){
		this.props.loadMoreFn();
	}
	componentDidMount(){
		//拿到dom节点
		const wrapper = this.refs.wrapper;
		const loadMoreFn = this.props.loadMoreFn;
		
		let timeoutId;
		function callback(){
			const top = wrapper.getBoundingClientRect().top;
			const windowHeight = window.screen.height;
			if (top && top < windowHeight) {
				//当wrapper已经被滚动到页面的可视范围之内时,立即刷新
				loadMoreFn();
			}
		}
		window.addEventListener('scroll',function(){
			if(this.props.isLoadingMore){
				return;
			}
			//设置截流,等滚动之后再执行,让滚动性能最优，不是每滚动中去不断触发
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(callback,50);
		}.bind(this),false);
		
	}
}
export default LoadMore;