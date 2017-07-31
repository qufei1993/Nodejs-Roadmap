import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { hashHistory } from 'react-router'
import SearchInput from '../SearchInput'
import './style.less'

class SearchHeader extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		return(
			<div id="common-header">
                <span className="back-icon" onClick={()=>{window.history.back()}}>
                    <i className="icon-chevron-left"></i>
                </span>
                <div class="home-header-middle">
					<div class="search-container">
						<i class="icon-search"></i>
                    	<SearchInput value={this.props.keywords || ''} enterHandle={this.enterHandle.bind(this)}/>
					</div>
				</div>
                
            </div>
		)
	}

	enterHandle(val){
		hashHistory.push('/search/all/'+encodeURIComponent(val));
	}
}
export default SearchHeader