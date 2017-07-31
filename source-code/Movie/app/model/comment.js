var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
//第一个参数 为模型名字,第二个参数为模式
var Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;