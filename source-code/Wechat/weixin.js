'use strict'

var config = require('./config');
var WeChat = require('./wechat/wechat');
var menu = require('./menu');
var wechatApi = new WeChat(config.wechat);

wechatApi.deleteMenu().then(function(){
	return wechatApi.createMenu(menu)
})
.then(function(msg){
	console.log(msg);
})

exports.reply = function* (next){
	var message = this.weixin; //拿到数据
	if (message.MsgType === 'event') { //事件推送
		if (message.Event === 'subscribe') {  //订阅事件
			if (message.EventKey) { //二维码生成事件
				console.log('扫描二维码进来：'+ message.EventKey + ' '+message.Ticket);
			}
			this.body = '欢迎订阅该公众号';
			console.log('欢迎订阅该公众号');
		}else if(message.Event === 'unsubscribe'){ //取消订阅事件
			console.log('取消关注!');
			this.body = '';
		}else if(message.Event === 'LOCATION') { // 上报地理位置事件
			this.body = '您上报的位置是: '+ message.latitude + '/' + message.longitute + '-' + message.Precision;
		}else if(message.Event === 'CLICK') { //自定义菜单事件
			this.body = '您点击了菜单：'+message.EventKey;
		}else if(message.Event === 'SCAN'){ //扫描二维码
			console.log('关注后扫二维码 '+ message.EventKey +' ' + message.Ticket);
			this.body = '看到你扫了一下哦';
		}else if(message.Event === 'VIEW'){
			this.body = '您点击了菜单中链接: '+message.EventKey; //此时的EventKey就是菜单的链接地址
		}
	}else if(message.MsgType === 'text'){ //文本消息
		var content = message.Content;
		var reply =  '您输入的'+content+'太复杂了!';
		if (content === '1') {
			reply = content + '的中文书写方式是：'+'壹';
		}else if(content === '2') {
			reply = content + '的中文书写方式是：'+'贰';
		}else if(content === '3') {
			reply = content + '的中文书写方式是：'+'叁';
		}else if(content === '4'){
			reply = [{
				title:'微信小程序入门',
				description:'开发一个集新闻阅读与电影影讯为一体的小程序，学会小程序开发',
				picUrl:'http://img.mukewang.com/5478338c0001478506000338-228-128.jpg',
				url:'http://www.baidu.com'
			}];
		}else if(content === '5'){
			var data = yield wechatApi.uploadMaterial('image',__dirname + '/'+'1.png');
			reply = {
				type:'image',
				mediaId:data.media_id
			}
		}else if(content === '6') {
			var data = yield wechatApi.uploadMaterial('video',__dirname + '/'+'1.mp4');
			reply = {
				type:'video',
				title:'小熊熊玩球',
				description:'小熊熊玩球球，玩球球',
				mediaId:data.media_id
			}
		}else if(content === '7') {
			var data = yield wechatApi.uploadMaterial('image',__dirname + '/'+'1.png');
			reply = {
				type:'music',
				TITLE:'开阔天空',
				DESCRIPTION:'作词：黄家驹  作曲：黄家驹 演唱：Beyond',
				musicUrl:'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
				hqMusicUrl:'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
				thumbMediaId:data.media_id
			}
		}else if(content === '8'){
			var data = yield wechatApi.uploadMaterial('image',__dirname +'/1.png',{type:'image'});
			reply = {
				type:'image',
				mediaId:data.media_id
			}
		}else if(content === '9') {
			var data = yield wechatApi.uploadMaterial('video',__dirname +'/1.mp4',{type:'video',description:'{"title":"这是一个标题","introduction":"这是一段描述!"}'});
			reply = {
				type:'video',
				title:'小熊熊玩球',
				description:'小熊熊玩球球，玩球球',
				mediaId:data.media_id
			}
		}else if(content === '10') {
			var picData = yield wechatApi.uploadMaterial('image',__dirname +'/1.png',{});
			var media = {
				articles:[{
					title:'图片标题9',
					thumb_media_id:picData.media_id,
					author:'Qufei',
					digest:'图片摘要部分',
					show_cover_pic:1,
					content:'图片内容Content 图片内容Content...',
					content_source_url:'http://www.qzfweb.com/'
				}]
			}
			//新增永久素材
			data = yield wechatApi.uploadMaterial('news',media,{});
			//获取永久素材
			data = yield wechatApi.fetchMaterial(data.media_id,'news',{});
			console.log(data);
			var items = data.news_item;
			var news = [];
			//遍历获取到的永久素材 在微信中输出
			items.forEach(function(item){
				news.push({
					title:item.title,
					description:item.digest,
					picUrl:picData.url,
					url:item.url
				});
			});
			reply = news;
		}else if(content === '11'){
			var counts = yield wechatApi.countMaterial();
			console.log(JSON.stringify(counts));
			var results = yield [
				wechatApi.batchMaterial({
					type:'image',
					offset:0,
					count:10
				}),
				wechatApi.batchMaterial({
					type:'video',
					offset:0,
					count:10
				}),
				wechatApi.batchMaterial({
					type:'voice',
					offset:0,
					count:10
				}),
				wechatApi.batchMaterial({
					type:'news',
					offset:0,
					count:10
				})
			];
			console.log(JSON.stringify(results));
			reply = 1;
		}else if(content === '12'){
			var groups = yield wechatApi.fetchGroups();
			console.log('查询分组');
			console.log(groups);
			/*var group = yield wechatApi.createGroup('wechat4');
			console.log('新分组 wechat4');
			console.log(group);

			var groups = yield wechatApi.fetchGroups();
			console.log('查询分组');
			console.log(groups);

			var group2 = yield wechatApi.fetchIdGroup(message.FromUserName);
			console.log('查看自己的所属分组');
			console.log(group2);
			reply = 'Group';

			var result = yield wechatApi.moveGroup(message.FromUserName,110);
			console.log('移动到 wechat4');
			console.log(result);

			var groups2 = yield wechatApi.fetchGroups();
			console.log('移动后分组列表：');
			console.log(groups2);

			var groups = yield wechatApi.fetchGroups();
			console.log('查询分组');
			console.log(groups);

			yield wechatApi.deleteGroup(110);
			var groups3 = yield wechatApi.fetchGroups();
			console.log('删除后分组列表：');
			console.log(groups3);
			yield wechatApi.updateGroup(110,'page');
			var groups4 = yield wechatApi.fetchGroups();
			console.log('更新后分组列表：');
			console.log(groups4);*/
		}else if(content === '13'){
			var user = yield wechatApi.fetchUsers(message.FromUserName,'zh_CN');
			console.log('user 信息: ');
			console.log(user);
			var openIds = [{
				openid:message.FromUserName,
				lang:'zh_CN'
			}];
			var users = yield wechatApi.fetchUsers(openIds);
			console.log('users 列表: ');
			console.log(users);
			reply = JSON.stringify(user);
		}else if(content === '14'){
			var listUsers = yield wechatApi.listUser();
			console.log(listUsers);
			reply = listUsers.total;
		}else if(content === '15'){
			var mpnews = {
				media_id:'YGYn8qiMeQhvZ5G6cXT4xsjgJnlv2pPUJR0bqGk-G08'
			}
			var text = {
				'content':'这是一段文本'
			}
			var msgData = yield wechatApi.sendByGroup('text',text,0);
			console.log('---------');
			console.log(msgData);
			reply = 'Yeay';
		}else if(content === '16'){
			var mpnews = {
				media_id:'YGYn8qiMeQhvZ5G6cXT4xsjgJnlv2pPUJR0bqGk-G08'
			}
			// var text = {
			// 	'content':'Home to become friends with you!'
			// }
			var msgData = yield wechatApi.previesMass('mpnews',mpnews,message.FromUserName);
			console.log('---------');
			console.log(msgData);
			reply = 'Year';
		}else if(content === '17'){
			var checkMass = yield wechatApi.checkMass('1000000003');
			console.log(checkMass);
			reply = 'Hello';
		}
		console.log(reply);
		this.body = reply;
	}
	yield next; //让流程继续往下走
}