'use strict'

var Koa = require('koa');
var wechat = require('./wechat/g');
var util = require('./libs/util');
var path = require('path');
var config = require('./config');
var reply = require('./wx/reply');
var app = new Koa();

var ejs = require('ejs');
var heredoc = require('heredoc');
var crypto = require('crypto');
var sha1 = require('sha1');
var WeChat = require('./wechat/wechat');

var tpl = heredoc(function(){/*
	<!DOCTYPE html>
	<html>
		<head>
			<title>猜电影</title>
			<meta name="viewport" content="initial-scale=1,maximum-scale=1,minimum-scale=1" />
			<script src="http://zeptojs.com/zepto-docs.min.js"></script>
			<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
		</head>
		<body>
			<h1>点击标题，开始录音翻译</h1>
			<p id="title"></p>
			<div id="poster"></div>
			<script>
				wx.config({
				    debug: true, 
				    appId: 'wx5f5185a728bfaec6', // 必填，公众号的唯一标识
				    timestamp:'<%= timestamp %>' , // 必填，生成签名的时间戳
				    nonceStr: '<%= noncestr %>', // 必填，生成签名的随机串
				    signature: '<%= signature %>',// 必填，签名，见附录1
				    jsApiList: [
				    	'startRecord',
						'stopRecord',
						'onVoiceRecordEnd',
						'translateVoice'
				    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			</script>
		</body>
	</html>
*/});
var _sign = function(noncestr,ticket,timeStamp,url){
	var params = [
		'noncestr=' + noncestr,
		'jsapi_ticket=' + ticket,
		'timestamp=' + timeStamp,
		'url=' + url
	];
	var str = params.sort().join('&');
	var shasum = crypto.createHash('sha1');
	shasum.update(str);
	return shasum.digest('hex');	
}
//生成一个随机字符串
var createNonce = function(){
	return Math.random().toString(36).substr(2,15);
}
//生成一个时间戳
var createTimestamp = function(){
	return parseInt(new Date().getTime() / 1000,10) + '';
}
//生成签名
function sign(ticket,url){
	var noncestr = createNonce();
	var timeStamp = createTimestamp();
	var signature = _sign(noncestr,ticket,timeStamp,url);
	console.log(ticket);
	console.log(url);
	return {
		noncestr:noncestr,
		timestamp:timeStamp,
		signature:signature
	}
}
app.use(function *(next){
	console.log('aaaaaaaaaaaa:');
	if (this.url.indexOf('/movie') > -1) {
		var wechatApi = new WeChat(config.wechat);
		var data = yield wechatApi.fetchAccessToken();
		var access_token = data.access_token;
		var ticketData = yield wechatApi.fetchTicket(access_token);
		var ticket = ticketData.ticket;
		var url = this.href.replace(':1234','');
		var params = sign(ticket,url);
		console.log(params);
		this.body = ejs.render(tpl,params);
		return next;
	}
	yield next;
});
app.use(wechat(config.wechat,reply.reply));  //传入配置参数
app.listen(1234);
console.log('start on 1234');