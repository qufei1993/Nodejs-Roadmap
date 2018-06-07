var express = require('express');
var path = require('path');
var bodyParser  = require('body-parser');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var logger = require('morgan'); 
var dbUrl = 'mongodb://127.0.0.1:27017/douban';
var app = express();
mongoose.connect(dbUrl);
app.set('views','./app/views'); //设置视图根目录
app.set('view engine','jade'); //设置默认模板引擎


//app.use(express.bodyParser()); //将表单提交的数据进行格式化
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
//此项必须在 bodyParser.json 下面,为参数编码
app.use(bodyParser.urlencoded({extended: true}));
//用来处理表单数据
app.use(require('connect-multiparty')());

/*//打开开发环境下 报错 信息
if('development' == app.get('env')){ //拿到env 判断是否是 开发环境
	app.set('showStackError',true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}
*/
if('development' == app.get('env')){ //拿到env 判断是否是 开发环境
  app.locals.pretty = true;
}
app.use(cookieParser());
app.use(session({
  secret: '12345',
  name: 'codeMsg',
  cookie: {maxAge:18000000},
  resave: false,
  saveUninitialized: true,
  store:new mongoStore({
  	url:dbUrl,
  	collection:'sessions'
  })
}));

app.use(express.static(path.join(__dirname,'public'))); //静态资源引用
app.locals.moment = require('moment');  //格式化时间
app.listen(port);
console.log("Server is start "+port);
require('./config/route.js')(app); //加载路由


