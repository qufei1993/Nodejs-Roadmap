var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;  //设密码置加密长度
var userSchemas = new mongoose.Schema({
	username:{
		unique:true,
		type:String
	},
	password:String,
	role:{
		type:Number,
		default:0
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
userSchemas.pre('save',function(next){  //每次在存取数据之前都会来调用这个方法
	var user = this;
	if(this.isNew){ //是否是新加的
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	//生成一个随机的盐,接收两个参数
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password,salt,function(err,hash){
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
	//next();  //将存储流程继续走下去
});
//实例方法
userSchemas.methods = {
	comparePassword: function(_password,cb){
		//第一个参数为前台传过来的密码 第二个为系统当前的密码
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if (err) return cb(err);
			cb(null,isMatch);
		});
	}
}
//静态方法，使用这个模式即可调用 
userSchemas.statics = {
	//查询所有数据
	fetch:function(cb){ 
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	//查询单条数据
	fetchById:function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}
module.exports = userSchemas;//将这个模式导出