'use strict'
var sha1 = require('sha1');
var getRawBody = require('raw-body');
var WeChat = require('./wechat');
var util = require('./util');
/*
* 这个中间件是用来处理事件 推送的数据 用来返回信息
*/
module.exports = function(opts,handler){
	//初始化构造函数
	var wechat = new WeChat(opts);
	return function *(next){
		var that = this;
		//console.log(this.query);
		var token = opts.token;
		var signature = this.query.signature;
		var nonce = this.query.nonce;
		// 时间戳
		var timestamp = this.query.timestamp;
		var echostr = this.query.echostr;
		//字典排序
		var str = [token,timestamp,nonce].sort().join('');
		//加密
		var sha = sha1(str);	
		if(this.method === 'GET'){
			//判断加密后的值 是否等于签名值
			if (sha === signature) {
				this.body = echostr + '';
				console.log('echostr: '+echostr);
			}else{
				this.body = 'wrong';
				console.log('wrong');
			}
		}
		else if (this.method === 'POST') {
			if (sha !== signature) {
				this.body = 'wrong';
				return false;
			}
			//拿到一个原始的 xml数据对象
			var data = yield getRawBody(this.req,{
				length:this.length,
				limit:'1MB',
				encoding:this.charset
			});
			var content = yield util.parseXMLAsync(data);
			//进一步将数据格式化为，对象字面量的方式显示
			var message = util.formatMessage(content.xml);
			console.log("g.js ---> message: ");
			console.log(message);
			this.weixin = message;
			yield handler.call(this,next); //此处的handler 为传入的reply.reply
			wechat.reply.call(this);
		}	
	}
}
