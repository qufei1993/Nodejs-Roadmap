var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
//第一个参数 为模型名字,第二个参数为模式
var User = mongoose.model('user',UserSchema);
module.exports = User;