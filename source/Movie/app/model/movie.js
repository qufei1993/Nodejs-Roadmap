var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
//第一个参数 为模型名字,第二个参数为模式
var Movie = mongoose.model('movie',MovieSchema);
module.exports = Movie;