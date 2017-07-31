var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CommentSchemas = new Schema({
	//ObjectId 就是主键 是一种特殊的类型  
	movie:{type:ObjectId,ref:'Movie'},
	from:{type:ObjectId,ref:'user'}, //关联评论者的用户
	reply:[{ //reply是一个数组 存储某一评论下的所有回复
		from:{type:ObjectId,ref:'user'},  //评论者
		to:{type:ObjectId,ref:'user'}, //评论对象
		content:String,
		createAt:{
			type:Date,
			default:Date.now()
		}
	}],
	content:String,
	meta:{  //数据的插入 和 更新时间
		createAt:{
			type:Date,
			default: Date.now()
		},
		updateAt:{
			type:Date,
			default: Date.now()
		}
	}
});
CommentSchemas.pre('save',function(next){  //每次在存取数据之前都会来调用这个方法
	if(this.isNew){ //是否是新加的
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();  //将存储流程继续走下去
});
CommentSchemas.statics = {
	//查询所有数据
	fetch:function(cb){ 
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	//查询单条数据
	fetchById:function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}
module.exports = CommentSchemas;//将这个模式导出