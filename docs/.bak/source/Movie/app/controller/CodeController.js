var AliDayu = require('node-alidayu');
exports.code = function(req,res){
	var phone = req.body.phone;
	function randomNum() {
		var n = 4;
		var str = "";
		for(var i=0;i<n;i++){
			str+=Math.floor(Math.random()*10);
		}
		return str;
	}
	var randoms = randomNum();
	req.session.codeMsg = randoms;
	var client = new AliDayu({
	  app_key: '23539539',
	  app_secret: 'c16950a22577bb08ca9ac0f5e0e29d15'
	});
  	client.sms({
      rec_num:phone,
      sms_free_sign_name: '阿通快递',
      sms_template_code: 'SMS_33260017',
      sms_param: {
         number:randoms
      }
    }).then(function (data) {
      res.json({success:1});
    }).catch(function (err) {
      console.log('fail');
    });
}