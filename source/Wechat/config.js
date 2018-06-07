'use strict'

var util = require('./libs/util');
var path = require('path');
var wechat_file = path.join(__dirname,'./config/wechat.txt');
var wechat_ticket_file = path.join(__dirname,'./config/wechat_ticket.txt');
var config = {
	wechat:{
		appID:'wx5f5185a728bfaec6',
		appSecret:'56fffbc7504c8a302cc9ea4a8a9c8bdc',
		token:'quzhenfei',
		getAccessToken:function(){
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken:function(data){
			data = JSON.stringify(data); //转成字符串
			return util.writeFileAsync(wechat_file,data);
		},
		getTicket:function(){
			return util.readFileAsync(wechat_ticket_file);
		},
		saveTicket:function(data){
			data = JSON.stringify(data); //转成字符串
			return util.writeFileAsync(wechat_ticket_file,data);
		},
	}
}
module.exports = config;