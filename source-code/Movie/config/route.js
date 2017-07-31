var Index = require('../app/Controller/IndexController');
var Mov = require('../app/Controller/MovieController');
var Code = require('../app/Controller/CodeController');
var User = require('../app/Controller/UserController');
var Comment = require('../app/Controller/CommentController');
var Cate = require('../app/Controller/CategoryController');
module.exports = function(app){
	//pre handle user
	app.use(function(req,res,next){
		var _user = req.session.user || null;
		app.locals.user = _user;
		next();
	});
	//前端页面
		app.get('/',Index.index);
		app.get('/list',Index.list);
		app.get('/detail/:id',Index.detail);
	
	//加载短信验证码
		app.post('/admin/code',Code.code);
	//检测用户名是否存在
		app.post('/admin/user/register',User.usernameReg);
	
	//登录
		app.get('/admin/login',User.getLogin);
		app.post('/admin/login',User.postLogin);
	//注册
		app.get('/admin/register',User.getRegister);
		app.post('/admin/register',User.register);
	//退出
		app.get('/admin/layout',User.layout);

	app.get('/admin',User.signInRequired,Mov.list);

	//评论页
		app.post('/user/comment',Comment.save);

	//后台user页面
		//admin user add page
		app.get('/admin/user/add',User.signInRequired,User.add);
		//admin user index page
		app.get('/admin/user/index',User.signInRequired,User.index);
		//admin user update page
		app.get('/admin/user/update/:id',User.signInRequired,User.update);
		//user 首次插入 或者更新
		app.post('/admin/user/add',User.signInRequired,User.doAddUpdate);
		//admin user delete operation
		app.delete('/admin/user/index',User.signInRequired,User.del);
	//后台movie页面
		//admin movie index page
		app.get('/admin/movie/index',User.signInRequired,Mov.list);
		//admin movie add page 
		app.get('/admin/movie/add',User.signInRequired,Mov.insert);
		//admin update
		app.get('/admin/movie/update/:id',User.signInRequired,Mov.update);
		//首页插入 或者 列表更新
		app.post('/admin/movie/insert',User.signInRequired,Mov.doInsertUpdate);
		// admin remove
		app.delete('/admin/movie/index',User.signInRequired,Mov.del);
	//后台category页面
		app.get('/admin/cate/index',User.signInRequired,Cate.list);
		app.get('/admin/cate/add',User.signInRequired,Cate.add);
		app.get('/admin/cate/update/:id',User.signInRequired,Cate.update);
		//分类页插入 或者 列表更新
		app.post('/admin/cate/add',User.signInRequired,Cate.doInsertUpdate);
		app.delete('/admin/cate/index',User.signInRequired,Cate.delete);
	//图片上传处理
		app.post('/admin/uploadImg',Mov.uploadImg);
}