var Category = require('../model/category');
var _ = require('underscore');
exports.list=function(req,res){
	Category.fetch(function(err,categorys){
		if(err) console.log(err);
		res.render('admin/cate/index',{
			title:'后台分类页',
			categorys:categorys
		});
	});
}
exports.add=(req,res) => {
	res.render('admin/cate/add',{
		title:'后台分类录入页',
		category:{
			_id:'undefined',
			name:''
		}
	});
}
exports.update = (req,res) => {
	var id = req.params.id;
	Category.findById(id,function(err,category){
		if (err) {
			console.log(err);
		}
		res.render('admin/cate/add',{
			title:'后台分类更新页面',
			category:category
		});
	});
}
exports.doInsertUpdate = (req,res) =>{
	console.log(req.body);
	var id = req.body.category._id;
	var categoryObj = req.body.category;
	var _category;
	if (id != 'undefined') {
		Category.findById(id,function(err,category){
			if (err) {console.log(err)}
			_category = _.extend(category,categoryObj);
			_category = new Category(_category);
			_category.save(function(err,category){
				if(err){
					console.log(err);
				}
				res.redirect('/admin/cate/index');
			});
		});
	}else{
		_category = new Category({
			name:categoryObj.name
		});
		_category.save(function(err,category){
			if (err) {
				console.log(err);
			}
			res.redirect('/admin/cate/index');
		});
	}
}
exports.delete = (req,res) => {
	var id = req.query.id;
	Category.findById(id,function(err,category){
		if (category.movies.length > 0) {
			res.json({success:0});
		}else{
			Category.remove({_id:id},(err,result) => {
				if (err) {
					console.log(err);
				}else{
					res.json({success:1});
				}
			});
		}
	});
	
}