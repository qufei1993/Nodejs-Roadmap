var Movie = require('../model/movie');
var Comment = require('../model/comment');
var Category = require('../model/category');
//首页
exports.index = function(req,res){
	Category
	.find({})
	.populate({path:'movies',options:{limit:6}})
	.exec(function(err,categorys){
		if(err) console.log(err);
		res.render('index',{
			title:'豆瓣首页',
			categorys:categorys
		});
	});
};
exports.list = function(req,res){
	var catId = req.query.cat;
	var page = parseInt(req.query.p);
	var count = 18;
	var index = page *　count;
	Category
	.find({_id:catId})
	.populate({
		path:'movies',
		select:'title poster'
	})
	.exec((err,categorys) => {
		if (err) {
			console.log(err);
		}
		var category = categorys[0] || {};
		var movies = category.movies || {};
		var results = movies.slice(index,index+count);
		res.render('list',{
			title:'列表页',
			towTit:category.name,
			catId:category._id,
			currentPage:(page + 1),
			totalPage:Math.ceil(movies.length / count),
			movies:results
		});
	});
}
//详情页
exports.detail = function(req,res){
	var id = req.params.id;
	//页面每次刷新pv加1
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if (err) {
			console.log(err);
		}
	});
	Movie.findById(id,function(err,movie){
		Comment
		.find({movie:id})
		.sort({'meta.createAt':-1})
		.populate('from','username')
		.populate('reply.from reply.to','username')
		.exec(function(err,comments){ //对from里面的objectId去user表里面查找将username字段返回
			res.render('detail',{
				title:movie.title,
				movie:movie,
				comments:comments
			});
		});
	})
}
