var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var mpPrefix = 'https://mp.weixin.qq.com/cgi-bin/';
var semanticUrl = 'https://api.weixin.qq.com/semantic/semproxy/search?';
var Promise = require('bluebird');
var util = require('./util');
var _ = require('lodash');
var fs = require('fs');
var request = Promise.promisify(require('request'));
var api = {
	accessToken:prefix+'token?grant_type=client_credential',
	temporary:{ //临时素材
		upload:prefix+'media/upload?',
		fetch:prefix+'media/get?'
	},
	permanent:{ //永久素材
		upload:prefix+'material/add_material?', //新增其他类型永久素材
		fetch:prefix+'material/get_material?', //新增其他类型永久素材
		uploadNews:prefix+'material/add_news?', //新增永久图文素材
		uploadNewsPic:prefix+'media/uploadimg?', //上传图文消息内的图片获取URL 
		del:prefix + 'material/del_material?', //删除永久素材
		update:prefix + 'material/update_news?', //修改永久图文素材
		count:prefix + 'material/get_materialcount?', //获取素材总数
		batch:prefix + 'material/batchget_material?' //获取素材列表
	},
	group:{
		create:prefix + 'groups/create?', //创建分组
		fetch:prefix + 'groups/get?', //查询所有分组
		fetchId:prefix + 'groups/getid?', //查询用户所在分组
		update:prefix + 'groups/update?', //修改分组名
		move:prefix + 'groups/members/update?', //移动用户分组
		batchMove:prefix + 'groups/members/batchupdate?', //批量移动用户分组
		del:prefix + 'groups/delete?' //删除分组
	},
	user:{
		remark:prefix + 'user/info/updateremark?', //设置用户备注名
		fetch:prefix + 'user/info?', //获取用户基本信息（包括UnionID机制）
		batchFetch:prefix + 'user/info/batchget?', //批量获取用户基本信息
		list:prefix + 'user/get?' //获取用户列表
	},
	mass:{
		group:prefix + 'message/mass/sendall?', //根据分组进行群发
		openId:prefix + 'message/mass/send?', //根据OpenID列表群发
		del:prefix + 'message/mass/delete?', //删除群发
		preview:prefix + 'message/mass/preview?', //预览接口
		check:prefix + 'message/mass/get?' //查询群发消息发送状态
	},
	menu:{
		create:prefix + 'menu/create?', //自定义菜单创建接口
		get:prefix + 'menu/get?', //自定义菜单查询接口
		del:prefix + 'menu/delete?', //自定义菜单删除接口
		current:prefix + 'get_current_selfmenu_info?' //获取自定义菜单配置接口
	},
	qrcode:{
		create:prefix + 'qrcode/create?', //临时 和 永久 二维码请求
		show:mpPrefix + 'showqrcode?' //通过ticket换取二维码
	},
	shortUrl:{
		create:prefix + 'shorturl?' //将一条长链接转成短链接
	},
	ticket:{
		get:prefix + 'ticket/getticket?' //获取api_ticket
	}
}
function WeChat(opts){ // 构造函数
	var that = this;
	this.appID = opts.appID;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken; //获取票据
	this.saveAccessToken = opts.saveAccessToken; //存储票据
	this.getTicket = opts.getTicket;
	this.saveTicket = opts.saveTicket;
	this.fetchAccessToken(this);	
}
WeChat.prototype.fetchAccessToken = function(data){
	var that = this;
	/*if (this.access_token && this.expires_in) {
		if (this.isValidAccessToken(this)) {
			return Promise.resolve(this);
		}
	}*/
	return this.getAccessToken()
	.then(function(data){
		try{
			data = JSON.parse(data);
		}catch(e){
			return that.updateAccessToken(data); //获取票据失败,返回更新数据
		}
		//如果拿到票据 判断其合法性 是否在有效期.
		if (that.isValidAccessToken(data)) {
			return Promise.resolve(data); //将这个票据传递下去
		}else{
			return that.updateAccessToken();
		}
	})
	.then(function(data){ //此时拿到一个合法的票据
		that.access_token = data.access_token;
		that.expires_in = data.expires_in; //拿到一个过期的字段
		that.saveAccessToken(data);
		return Promise.resolve(data);
	})
}
//票据验证方法
WeChat.prototype.isValidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in){
		return false;
	}
	var access_token = data.access_token;
	var expires_in = data.expires_in;
	var now = (new Date().getTime());
	if (now < expires_in) { //判断当前时间是否小于 过期时间
		return true;
	}else{
		return false;
	}
}
//票据更新方法
WeChat.prototype.updateAccessToken = function(){
	var appID = this.appID;
	var appSecret = this.appSecret;
	
	// 请求票据的地址
	var url = api.accessToken + '&appid=' + appID +'&secret='+appSecret;
	//request 也是对http get post 封装好的一个库 
	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(response){
			var data = response.body;
			var now = (new Date().getTime());
			//生成一个新的过期时间
			//让这个票据提前20秒刷新 考虑到网络延迟,服务器的计算时间
			var expires_in = now + (data.expires_in - 20)*1000;
			data.expires_in = expires_in; //把新的这个票据时间 赋给这个data对象
			resolve(data);
		})
	});
}
//
WeChat.prototype.fetchTicket = function(access_token){
	var that = this;
	return this.getTicket()
	.then(function(data){
		try{
			data = JSON.parse(data);
		}catch(e){
			return that.updateTicket(access_token); //获取票据失败,返回更新数据
		}
		//如果拿到票据 判断其合法性 是否在有效期.
		if (that.isValidTicket(data)) {
			return Promise.resolve(data); //将这个票据传递下去
		}else{
			return that.updateTicket(access_token);
		}
	})
	.then(function(data){ //此时拿到一个合法的票据
		that.saveTicket(data);
		return Promise.resolve(data);
	})
}
//
WeChat.prototype.updateTicket = function(access_token){
	// 请求票据的地址
	var url = api.ticket.get + '&access_token='+access_token+'&type=jsapi';
	//request 也是对http get post 封装好的一个库 
	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(response){
			var data = response.body;
			var now = (new Date().getTime());
			//生成一个新的过期时间
			//让这个票据提前20秒刷新 考虑到网络延迟,服务器的计算时间
			var expires_in = now + (data.expires_in - 20)*1000;
			data.expires_in = expires_in; //把新的这个票据时间 赋给这个data对象
			resolve(data);
		})
	});
}
//
WeChat.prototype.isValidTicket = function(data){
	if(!data || !data.access_token || !data.expires_in){
		return false;
	}
	var ticket = data.ticket;
	var expires_in = data.expires_in;
	var now = (new Date().getTime());
	if (ticket && now < expires_in) { //判断当前时间是否小于 过期时间
		return true;
	}else{
		return false;
	}
}
//上传文件
WeChat.prototype.uploadMaterial = function(type,material,permanent){
	var that = this;
	var form = {};
	//默认为临时素材
	var uploadUrl = api.temporary.upload;
	if (permanent) { //传入的是永久素材
		uploadUrl = api.permanent.upload;
		//让form兼容到所有的上传类型、图文消息
		_.extend(form,permanent);
	}
	if (type === 'pic') {
		uploadUrl = api.permanent.uploadNewsPic;
	}
	if (type === 'news') {
		uploadUrl = api.permanent.uploadNews
		form = material; //素材是一个数组
	}else{
		//图片是一个路径
		form.media = fs.createReadStream(material);
	}
	//request 也是对http get post 封装好的一个库 
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = uploadUrl + 'access_token=' + data.access_token;
			if (!permanent) { //不是永久素材情况下
				url += '&type=' + type;
			}else{
				form.access_token = data.access_token;
			}
			//
			var options = {
				method:'POST',
				url:url,
				json:true
			}
			if (type === 'news') {
				options.body = form;
			}else{
				options.formData = form;
			}
			request(options).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('upload material fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
/*
	获取文件素材
	mediaId 获取素材Id
	type 素材类型
	permanent 是永久还是临时素材
*/
WeChat.prototype.fetchMaterial = function(mediaId,type,permanent){
	var that = this;
	//默认为临时素材
	var fetchUrl = api.temporary.fetch;
	if (permanent) { //传入的是永久素材
		fetchUrl = api.permanent.fetch;
	}
	//request 也是对http get post 封装好的一个库 
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = fetchUrl + 'access_token=' + data.access_token + '&media_id=' + mediaId;
			var form = {}
			var options = {method:'POST',url:url,json:true}
			if (permanent) {
				form.media_id = mediaId;
				form.access_token = data.access_token;
				options.body = form;
			}else{
				if (type === 'video') {
					url = url.replace('https://','http://');
				}
				url += '&media_id=' + mediaId;
			}
			if (type === 'news' || type === 'video') {
				request(options).then(function(response){
				var _data = response.body;
				console.log(_data);
					if (_data) {
						resolve(_data);
					}else{
						throw new Error('fetchMaterial material fails');
					}
				})
				.catch(function(err){
					reject(err);
				});
			}else{
				resolve(url);
			}			
		})	
	});
}
/*
	删除永久素材
	mediaID 删除素材的id
*/
WeChat.prototype.deleteMaterial = function(mediaId){
	var that = this;
	var form = {
		media_id:mediaId
	};
	//request 也是对http get post 封装好的一个库 
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.permanent.del + 'access_token=' + data.access_token + '&media_id=' + mediaId;
			if (!permanent && type === 'video') { //不是永久素材情况下
				url = url.replace('https://','http://');
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('deleteMaterial material fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
/*
	修改永久图文素材
	mediaId 素材的Id
	news 更新的内容
*/
WeChat.prototype.updateMaterial = function(mediaId,news){
	var that = this;
	var form = {
		media_id:mediaId
	};
	if (permanent) { //传入的是永久素材
		fetchUrl = api.permanent.fetch;
	}
	_.extend(form,news);
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.permanent.update + 'access_token=' + data.access_token + '&media_id=' + mediaId;
			if (!permanent && type === 'video') { //不是永久素材情况下
				url = url.replace('https://','http://');
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('updateMaterial material fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
/*
	获取素材总数
*/
WeChat.prototype.countMaterial = function(){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.permanent.count + 'access_token=' + data.access_token;
			request({method:'GET',url:url,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('countMaterial material fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
/*
	获取素材列表
*/
WeChat.prototype.batchMaterial = function(options){
	var that = this;
	//如果存在 就为 options.type 否则默认为image
	options.type = options.type || 'image';
	options.offset = options.offset || 0;
	options.count = options.count || 1;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.permanent.batch + 'access_token=' + data.access_token;
			request({method:'POST',url:url,body:options,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('batchMaterial material fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
// 创建分组
WeChat.prototype.createGroup = function(name){
	var that = this;

	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.group.create + 'access_token=' + data.access_token;
			var form = {
				group:{
					name:name
				}
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Create group fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//查询分组
WeChat.prototype.fetchGroups = function(name){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.group.fetch + 'access_token=' + data.access_token;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Fetch group fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//查询用户所在分组
WeChat.prototype.fetchIdGroup = function(openId){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.group.fetchId + 'access_token=' + data.access_token;
			var form = {
				openid:openId
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('FetchId group fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//更新分组
WeChat.prototype.updateGroup = function(id,name){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.group.update + 'access_token=' + data.access_token;
			var form = {
				group:{
					id:id,
					name:name
				}
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Update group fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//移动分组
WeChat.prototype.moveGroup = function(openIds,toOpenId){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url;
			var form = {
				to_groupid:toOpenId
			}
			//判断是否是批量移动
			if (_.isArray(openIds)) { 
				url = api.group.batchMove + 'access_token=' + data.access_token;
				form.openid_list = openIds;
			}else{
				url = api.group.move + 'access_token=' + data.access_token;
				form.openid = openIds;
			}
			
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Move group fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//删除分组
WeChat.prototype.deleteGroup = function(id){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.group.del + 'access_token=' + data.access_token;
			var form = {
				group:{
					id:id
				}
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Delete group fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//设置用户备注名
WeChat.prototype.remarkUser = function(openId,remark){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.user.remark + 'access_token=' + data.access_token;
			var form = {
				openid: openId,
				remark: remark
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Remark user fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//获取用户基本信息(UnionID机制) 
WeChat.prototype.fetchUsers = function(openIds,lang){
	var that = this;
	lang = lang || 'zh_CN';
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var options = {
				json:true
			}
			if (_.isArray(openIds)) { //批量获取用户基本信息
				options.url = api.user.batchFetch + 'access_token=' + data.access_token;
				options.body = {
					user_list:openIds
				};
				options.method = 'POST';
			}else{ //获取用户基本信息 get方式提交 地址传递 不需要form
				options.url = api.user.fetch + 'access_token=' + data.access_token+'&openid='+openIds+'&lang='+lang;
				options.method = 'GET';
			}	
			request(options).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('batchFetch user fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//获取用户列表
WeChat.prototype.listUser = function(openId){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.user.list + 'access_token=' + data.access_token;
			if (openId) {
				url += '&next_openid=' + openId;
			}
			request({method:'GET',url:url,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Remark user fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//根据分组进行群发
WeChat.prototype.sendByGroup = function(type,message,groupId){
	var that = this;
	var msg = {
		filter:{},
		msgtype:type
	}
	msg[type] = message;
	console.log(groupId);
	if (groupId == undefined) { //没有传groupId就是群发
		msg.filter.is_to_all = true;
		console.log('群发');
	}else{
		msg.filter = {
			is_to_all:false,
      		tag_id: groupId
		}
		console.log('单一');
	}
	//console.log('-----------------');
	//console.log(msg);
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.mass.group + 'access_token=' + data.access_token;
			request({method:'POST',url:url,body:msg,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Send group fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//根据OpenID列表群发, 仅服务号认证后才可用
WeChat.prototype.sendByOpenId = function(type,message,openIds){
	var that = this;
	var msg = {
		filter:{},
		msgtype:type,
		touser:openIds
	}
	msg[type] = message;

	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.mass.openId + 'access_token=' + data.access_token;
			request({method:'POST',url:url,body:msg,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Send byOpenID fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//删除群发
WeChat.prototype.deleteMass = function(msgId){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.mass.del + 'access_token=' + data.access_token;
			var form = {
				msg_id:msgId
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Delete mass fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//预览接口
WeChat.prototype.previesMass = function(type,message,openId){
	var that = this;
	var msg = {
		msgtype:type,
		touser:openId
	}
	msg[type] = message
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.mass.preview + 'access_token=' + data.access_token;
			request({method:'POST',url:url,body:msg,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Preview mass fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//查询群发消息发送状态
WeChat.prototype.checkMass = function(msgId){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.mass.check + 'access_token=' + data.access_token;
			var form = {
				msg_id:msgId
			}
			request({method:'POST',url:url,body:form,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Check mass fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//创建菜单
WeChat.prototype.createMenu = function(menu){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.menu.create + 'access_token=' + data.access_token;
			request({method:'POST',url:url,body:menu,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Create menu fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//查询菜单
WeChat.prototype.getMenu = function(){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.menu.get + 'access_token=' + data.access_token;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('get Menu fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//删除菜单
WeChat.prototype.deleteMenu = function(){
	var that = this;

	return new Promise(function(resolve,reject){
		that
		   .fetchAccessToken()
		   .then(function(data){
		   		var url = api.menu.del + '?access_token=' + data.access_token;
		   		request({method:'GET', url: url, json:true}).then(function(response){		   			
		   		   	var _data = response.body;
		   		   	if(_data){
		   		   		resolve(_data);
		   		   	}
		   		   	else{
		   		   		throw new Error('del menu fail');
		   		   	}				   	
		   	   	})
		   		.catch(function(err){
		   			reject(err);
		   		})
		   })
	})
}
//获取自定义菜单配置接口
WeChat.prototype.getCurrentMenu = function(){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.menu.current + 'access_token=' + data.access_token;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Current Menu fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//临时和永久 二维码请求
WeChat.prototype.createQrcode = function(qr){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.qrcode.create + 'access_token=' + data.access_token;
			request({method:'POST',url:url,body:qr,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Create qrcode fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//通过ticket换取二维码
WeChat.prototype.showQrcode = function(ticket){
	return api.qrcode.show + 'ticket=' + encodeURI(ticket);
}
//长链接转短链接接口
WeChat.prototype.createShorturl = function(action,url){
	action = action || 'long2short';
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = api.shortUrl.create + 'access_token=' + data.access_token;
			var form = {
				action:action,
				long_url:url
			}
			request({method:'POST',url:url,body:qr,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Create shorturl fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//
WeChat.prototype.semantic = function(semanticData){
	var that = this;
	return new Promise(function(resolve,reject){
		that
		.fetchAccessToken()
		.then(function(data){
			var url = semanticUrl + 'access_token=' + data.access_token;
			semanticData.appid = data.appID;
			request({method:'POST',url:url,body:semanticData,json:true}).then(function(response){
				var _data = response.body;
				if (_data) {
					resolve(_data);
				}else{
					throw new Error('Semantic fails');
				}
			})
			.catch(function(err){
				reject(err);
			});
		})	
	});
}
//回复
WeChat.prototype.reply = function(){
	var content = this.body; 	//拿到回复的内容
	var message = this.weixin;  //
	var xml = util.tpl(content,message);
	this.status = 200;
	this.type = 'application/xml';
	this.body = xml;
}
module.exports = WeChat;