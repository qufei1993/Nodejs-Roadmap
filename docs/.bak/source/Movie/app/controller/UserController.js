var User = require('../model/user');
var _ = require('underscore');
//登录
exports.getLogin = (req,res) => {
    res.render('admin/login',{title:'后台登录'});
}
exports.postLogin = (req,res) => {
    var _user = req.body.user;
    var name = _user.username;
    var pwd = _user.password;
    User.findOne({username:name},function(err,user){
        if (err) {console.log(err);}
        if (user==null) {
            res.render('admin/login',{msg:'用户名不存在'});
        }else{
            user.comparePassword(pwd,function(err,isMatch){
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    req.session.user = user;
                    res.redirect('/admin');
                }else{
                    res.render('admin/login',{msg:'用户名与密码错误'});
                }
            });
        }
    });
}
//注册表单页
exports.getRegister = (req,res) => {
    res.render('admin/register',{title:'后台注册'});
}
//注册表单提交
exports.register = (req,res) => {
	console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;
	var userCode = parseInt(req.body.code);
	var codeMsg = parseInt(req.session.codeMsg);
	if(!(/^1(3|4|5|7|8)\d{9}$/.test(username))){ 
        res.json({success:0,msg:"请填写正确手机号,在提交!"});
        //res.render('admin/register',{msg:'手机号码有误，请重填'});
        return false;
    }
    if (userCode !== codeMsg) {
    	res.json({success:0,msg:'证码输入错误!'});
    	return false;
    }
    if (password.length < 6) {
    	res.json({success:0,msg:'密码长度不能小于6'});
    	return false;
    }
    var _User = new User({
    	username:req.body.username,
    	password:req.body.password
    });
    _User.save(function(err,user){
    	if (err){
    		console.log(err);
    	}else{
    		console.log(user);
            res.json({success:1,msg:'恭喜您,注册成功! 3秒后为您跳转'});
    	}
    });
    User.findOne({username:username},function(err,user){
        if (err) {console.log(err)}
        if (user) {
            res.json({success:0,msg:"您注册的用户已存在,请登录!"});
        }
    });
    return false;
}
//退出
exports.layout = (req,res) => {
    delete req.session.user;
    res.redirect('/admin/login');
}
//用户名是否注册验证
exports.usernameReg = (req,res) => {
    var username = req.body.username;
    User.findOne({username:username},function(err,user){
        if (err) {console.log(err)}
        if (user) {
            res.json({success:0,msg:"您注册的用户已存在,请登录!"});
            return false;
        }else{
            res.json({success:0,msg:"<font color='green'>该手机可以正确使用!</font>"});
        }
    });
}
// 添加用户
exports.add = function(req,res){
    res.render('admin/user/add',{
        user:{
            username:'',
            password:'',
            role:''
        }
    });
}
// 用户列表
exports.index = (req,res) => {
    User.fetch(function(err,users){
        res.render('admin/user/index',{
            title:'后台列表页',
            users:users
        });
    });
}
// 用户更新页
exports.update = (req,res) => {
    var id = req.params.id;
    if (id) {
        User.fetchById(id,function(err,user){
            res.render('admin/user/add',{
                title:'用户更新页',
                user:user
            });
        }); 
    }  
}
//用户首次插入 或 更新页
exports.doAddUpdate = (req,res) => {
    var id = req.body.user._id;
    var userArr = req.body.user;
    var _user;
    if(id !== 'undefined'){
        User.findById(id,function(err,user){
            console.log(user);
            if (err) {
                console.log(err);
            }
            // underscore的extend方法 用来将 旧数据 替换为新数据
            _user = _.extend(user,userArr);
            _user = new User(_user);
            _user.save(function(err,user){
                if (err) {
                    console.log(err);
                }
                res.redirect('/admin/user/index');
            });
        });
    }else{
        _user = new User({
            username:userArr.username,
            password:userArr.password,
            role:userArr.role
        });
        _user.save(function(err,user){
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/user/index');
        });
    }
}
//删除用户
exports.del = function(req,res){
    var id = req.query.id;
    User.remove({_id:id},(err,result) => {
        if (err) {
            console.log(err);
        }else{
            res.json({success:1});
        }
    });
}
//midware for user 
exports.signInRequired = function(req,res,next){
    var user = req.session.user;
    if(!user){
        return res.redirect('/admin/login');
    }
    next();
}