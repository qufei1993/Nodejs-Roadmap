var Comment = require('../model/comment');
//comment
/*
exports.save = (req,res) => {
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	var comment = new Comment(_comment);
	comment.save(function(err,movie){
		if (err) {
			console.log(err);
		}
		res.redirect('/detail/'+ movieId);
	});
}
*/
exports.save = (req,res) => {
	var _comment = req.body;
	console.log(_comment);
	if (_comment.cid) {
		Comment.findById(_comment.cid,function(err,comment){
			var reply = {
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			comment.reply.unshift(reply);
			comment.save(function(err,movie){
				if (err) {
					console.log(err);
				}
				//console.log("******"+movie.reply[0]._id+"******");
				Comment
				.findOne({_id:movie._id})
				.populate('reply.from reply.to','username')
				.exec(function(err,comments){
					//console.log(comments.reply[0]);
					res.json({success:1,reply:comments.reply[0],cid:_comment.cid});
				});
			});
		});
	}else{
		var comment = new Comment(_comment);
		comment.save(function(err,movie){
			if (err) console.log(err);
			Comment
			.findOne({_id:movie._id})
			.populate('from','username')
			.exec(function(err,comments){ //对from里面的objectId去user表里面查找将username字段返回
				res.json({success:1,movie:comments});
			});
		});
	}
}