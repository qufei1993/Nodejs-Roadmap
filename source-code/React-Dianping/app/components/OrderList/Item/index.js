import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import './style.less'

class Item extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            commentState:2 //0未评价 1评价中 2已评价
        }
    }
    render() {
        const data = this.props.data
        return (
            <div className="order-item-container">
                <div className="clear-fix">
                    <div className="order-item-img fl">
                        <img src={data.img}/>
                    </div>
                    <div className="order-item-comment fr">
                        {
                            this.state.commentState == 0 ?
                                <button class="btn" onClick={this.showComment.bind(this)}>评价</button>
                            :
                                this.state.commentState == 1 ?
                                    ''
                                : 
                                    <button class="btn unseleted-btn" disabled>已评价</button>
                        }
                    </div>
                    <div className="order-item-content">
                        <span>商户：{data.title}</span>
                        <span>数量：{data.count}</span>
                        <span>价格：￥{data.price}</span>
                    </div>
                </div>
                {
                    // “评价中”才会显示输入框
                    this.state.commentState === 1
                    ? <div className="comment-text-container">
                        <textarea style={{width: '100%', height: '80px'}} className="comment-text" ref="commentText"></textarea>
                        <button className="btn" onClick={this.submitComment.bind(this)}>提交</button>
                        &nbsp;
                        <button className="btn unseleted-btn" onClick={this.hideComment.bind(this)}>取消</button>
                    </div>
                    : ''
                }
            </div>
        )
    }
    componentDidMount(){
        this.setState({
            commentState:this.props.data.commentState
        });
    }
    showComment(){
        this.setState({
            commentState:1
        });
    }
    submitComment(){
        const submitComment = this.props.submitComment
        const id = this.props.data.id
        const commentText = this.refs.commentText
        const star = 4;
        const value = commentText.value.trim();
        if (!value) { //评论内容不存在 返回
            return;
        }

        //执行提交数据
        submitComment(id,value,star,this.commentOk.bind(this))
    }
    commentOk(){
        this.setState({
            commentState:2
        });
    }
    hideComment(){
        this.setState({
            commentState:0
        })
    }
}

export default Item