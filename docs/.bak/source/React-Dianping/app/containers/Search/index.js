import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import SearchHeader from '../../components/SearchHeader'
import SearchList from './subpage/List'

class Search extends React.Component{
	constructor(props,context){
		super(props,context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); 
	}
	render(){
		var params = this.props.params;
		return(
			<div>
 				<SearchHeader keywords={params.keywords}/>
 				<SearchList category={params.category} keywords={params.keywords}/>
			</div>
		)
	}
}
export default Search