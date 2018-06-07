var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var schemas = new mongoose.Schema({
	doctor:String,
	title:String,
	country:String,
	language:String,
	poster:String,
	summary:String,
	flash:String,
	year:String,
	pv:{
		type:Number,
		default:0
	},
	category:{
		type:ObjectId,
		ref:'category'
	},
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
schemas.pre('save',function(next){  //每次在存取数据之前都会来调用这个方法
	if(this.isNew){ //是否是新加的
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();  //将存储流程继续走下去
});
schemas.statics = {
	//查询所有数据
	fetch:function(cb){ 
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	//查询单条数据
	fetchById:function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}
module.exports = schemas;//将这个模式导出