var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category');
//第一个参数 为模型名字,第二个参数为模式
var CategorySchema = mongoose.model('category',CategorySchema);
module.exports = CategorySchema;
