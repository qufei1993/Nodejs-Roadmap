'use strict'
var xml2js = require('xml2js');
var Promise = require('bluebird');
var tpl = require('./tpl');
exports.parseXMLAsync = function(xml){
	return new Promise(function(resolve,reject){
		xml2js.parseString(xml,{trim:true},function(err,content){
			if(err) reject(err)
			else resolve(content)
		});
	});
}
/*
	将以下数据格式化为对象字面量的方式
	{ ToUserName: [ 'gh_16dea3d81fda' ],
	  FromUserName: [ 'o0YUivzzBYkKtq8F9_zLKgMVovUQ' ],
	  CreateTime: [ '1482493917' ],
	  MsgType: [ 'text' ],
	  Content: [ '123' ],
	  MsgId: [ '6367262890499650524' ] }
*/
function formatMessage(result){
	var message = {};
	if (typeof result === 'object') {
		var keys = Object.keys(result); //拿到所有的key
		for(var i=0;i<keys.length;i++){
			//遍历拿到每个键对应的值
			var item = result[keys[i]];
			var key = keys[i];
			//如果该键对应的值 不是 数组 或者为空 跳出当前循环 进行下次循环
			if( !(item instanceof Array) || item.length ===0){
				continue;
			}
			if (item.length === 1) {
				var val = item[0];
				// 如果是对象 进行近一步遍历
				if(typeof val ==='object'){
					message[key] = formatMessage(val);
				}else{
					message[key] = (val || '').trim();
				}
			}else{ 
				//既不等于1 又不等于0 那么就是一个数组
				message[key] = [];
				for(var j=0,k=item.length;j<k;j++){
					message[key].push(formatMessage(item[j]));
				}
			}
		}
	}
	return message;
}
exports.formatMessage = formatMessage;
exports.tpl = function(content,message){
	var info = {}; //存储临时回复的内容
	var type= 'text';
	var fromUserName = message.FromUserName;
	var toUserName = message.ToUserName;
	if (Array.isArray(content)) { //如果是图文消息，设置类型为news
		type = 'news';
	}
	type = content.type || type;
	info.content = content;
	info.createTime = new Date().getTime();
	info.msgType = type;
	info.toUserName = fromUserName;
	info.fromUserName = toUserName;
	return tpl.compiled(info);
};