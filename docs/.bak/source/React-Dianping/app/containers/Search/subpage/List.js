import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'
import ListCompenents from '../../../components/List'
import LoadMore from '../../../components/LoadMore'
import { getSearchData } from '../../../fetch/search/search'

const initialState = {
	data:[],
	hasMore:false, //记录当前状态下 还有没有更多的数据可供加载
    isLoadingMore:false, //记录当前状态下是 加载中... 还是 加载更多
    page:1 //下一页的页面
}

class List extends React.Component{
	constructor(props,context){
		super(props,context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); 
		this.state = initialState 
	}
	render(){
		var params = this.props.params;
		return(
			<div>
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
        const cityName = this.props.userinfo.cityName
        const keywords = this.props.keywords || ''
        const category = this.props.category
        const result = getSearchData(0, cityName, category, keywords)
        this.resultHandle(result)
    }
    //加载更多数据
    loadMoreData(){
    	this.setState({
    		isLoadingMore:true
    	});
    	const page = this.state.page;
    	const cityName = this.props.userinfo.cityName
        const keywords = this.props.keywords || ''
        const category = this.props.category
        const result = getSearchData(page, cityName, category, keywords)
        this.resultHandle(result)
        this.setState({
        	isLoadingMore:false,
        	page:page+1
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
    componentDidUpdate(prevProps, prevState) {
    	const keywords = this.props.keywords
        const category = this.props.category
    	// 搜索条件完全相等时，忽略。重要！！！
        if (keywords === prevProps.keywords && category === prevProps.category) {
            return
        }
        // 重置 state
        this.setState(initialState)

        // 重新加载数据
        this.loadFirstPageData()
    }
}

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(List);