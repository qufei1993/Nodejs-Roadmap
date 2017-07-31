import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { getListData } from '../../../fetch/home/home'
import ListCompenents from '../../../components/List'
import LoadMore from '../../../components/LoadMore'
import './style.less'

class List extends React.Component{
	constructor(props,context){
		super(props,context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); 
		this.state = {
			data:[],
			hasMore:false, //记录当前状态下 还有没有更多的数据可供加载
            isLoadingMore:false, //记录当前状态下是 加载中... 还是 加载更多
            page:1 //下一页的页面
		}
	}
	render(){
		return(
			<div class="list-container">
				<h2 className="home-list-title">猜你喜欢</h2>
                {
                    this.state.data.length ?
                        <ListCompenents data={this.state.data}/>
                    :
                        ''
                }
				{
                    this.state.hasMore
                    ? <LoadMore isLoadingMore={this.state.isLoadingMore} loadMoreFn={this.loadMoreData.bind(this)}/>
                    : ''
                }
			</div>
		)
	}
	componentDidMount() {
        // 获取首页数据
        this.loadFirstPageData()
    }
    // 获取首页数据
    loadFirstPageData() {
        const cityName = this.props.cityName
        const result = getListData(cityName, 0)
        this.resultHandle(result)
    }
    //获取更多数据
    loadMoreData(){
        //记录状态
        this.setState({
            isLoadingMore:true
        });
        const cityName = this.props.cityName;
        const page = this.state.page; //下一页页面
        const result = getListData(cityName,page)
        this.resultHandle(result)
        //增加page数
        this.setState({
            page:page+1,
            isLoadingMore:false
        });

    }
    //处理数据
    resultHandle(result){
    	result.then(res => {
    		return res.json();
    	}).then(json => {
    		const hasMore = json.hasMore
            const data = json.data
    		this.setState({
    			data:this.state.data.concat(data),
    			hasMore:hasMore
    		});
    	})
    }
}
export default List;