import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Link } from 'react-router';
import './style.less';

class Item extends React.Component{
	constructor(props,context){
		super(props,context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		var data = this.props.item
		return(
    		<div className="list-item clear-fix">
                <Link to={"/detail/"+data.id}>
                    <div className="item-img-container fl">
                        <img src={data.img} alt={data.title}/>
                    </div>
                    <div className="item-content">
                        <div className="item-title-container clear-fix">
                            <h3 className="fl">{data.title}</h3>
                            <span className="fr">{data.distance}</span>
                        </div>
                        <p className="item-sub-title">
                            {data.subTitle}
                        </p>
                        <div className="item-price-container clear-fix">
                            <span className="price fl">￥{data.price}</span>
                            <span className="mumber fr">已售{data.mumber}</span>
                        </div>
                    </div>
                </Link>
            </div>
		)
	}
}
export default Item;