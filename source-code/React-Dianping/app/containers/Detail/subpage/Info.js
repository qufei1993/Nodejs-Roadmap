import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import DetailInfo from '../../../components/DetailInfo'
import { getInfoData } from '../../../fetch/detail/detail'

class Info extends React.Component{
	constructor(props,context){
		super(props,context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); 
		this.state = {
			info:false
		}
	}
	render(){
		return(
			<div>
				{
					this.state.info ?
						<DetailInfo data={this.state.info}/>
					:
						''
				}
			</div>
		)
	}
	componentDidMount(){
		this.getInfo();
	}
	getInfo(){
		const id = this.props.id;
		const result = getInfoData(id);
		result.then(res => {
			return res.json()
		}).then(json => {
			this.setState({
				info:json
			})
		})
	}
	
}

export default Info