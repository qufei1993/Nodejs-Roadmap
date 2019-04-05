$(function(){
	// movie 删除操作
	$('.del').click(function(e){
		var id = $(this).attr("id");
		var tr = $('.item-id-'+id)
		$.ajax({
			type:'delete',
			url:'/admin/movie/index?id='+id
		}).done(function(result){
			if (result.success === 1) {
				if(tr.length > 0){
					tr.remove();
				}
			}
		});
	});
	// user 删除操作
	$('.userDel').click(function(e){
		var id = $(this).attr("id");
		var tr = $('.item-id-'+id)
		$.ajax({
			type:'delete',
			url:'/admin/user/index?id='+id
		}).done(function(result){
			if (result.success === 1) {
				if(tr.length > 0){
					tr.remove();
				}
			}
		});
	});
	// category 删除操作
	$('.cateDel').click(function(e){
		var id = $(this).attr("id");
		var tr = $('.item-id-'+id)
		$.ajax({
			type:'delete',
			url:'/admin/cate/index?id='+id
		}).done(function(result){
			if (result.success === 1) {
				if(tr.length > 0){
					tr.remove();
				}
			}else if(result.success === 0){
				layer.alert('请先删除该分类下的所有文章!', {
				  	icon:5,
					skin: 'layer-ext-moon'
				})
			}
		});
	});
	//发送注册验证
	$('#sendCode').click(function(){
		var wait = 10;
		var obj = $(this);
		var phone = phoneRegReturn();
		if (phone == 0) {
			$('#msg').html('请输入正确手机号后发送!');
			return false;
		}else{
			phone=$('#username').val();
		}
		$.ajax({
			type:'post',
			url:'/admin/code',
			data:'phone='+phone
		}).done(function(result){
			if (result.success === 1) {
				$('#msg').html("<font color='green'>发送成功,请查收</font>");
				sendCodes();
			}
		});
		//发送验证码
		function sendCodes(){
			if (wait == 0) {
				obj.html("获取验证码");
				wait = 10;
				obj.removeClass("codeClick");
				$('#sendCode').removeAttr("disabled"); //移除disabled属性
			}else{
				$('#sendCode').attr('disabled',"true"); //添加disabled属性
				obj.addClass("codeClick");
				obj.html("重新发送"+wait+"s");
				wait--;	
				setTimeout(function(){
					sendCodes();
				},1000);
			}
		}
	});
	$('#douban').blur(function(){
		var id = $('#douban').val();
		if(id){
			$.ajax({
				type:'get',
				url:'https://api.douban.com/v2/movie/subject/' + id,
				cache:true,
				dataType:'jsonp',
				crossDomain:true,
				jsonp:'callback',
				success:function(data){
					$('#inputTitle').val(data.title);
					$('#inputDoctor').val(data.directors[0].name);
					$('#inputCountry').val(data.countries[0]);
					$('#inputPoster').val(data.images.large);
					$('#inputYear').val(data.year);
					$('#inputSummary').val(data.summary);
				}
			});
		}
	});
	$('#inputUpload').change(function(){
		var fd = new FormData();
		    fd.append("file",$('#inputUpload')[0].files[0]);
		$.ajax({
			type:'post',
			url:'/admin/uploadImg',
			data:fd,
			dataType:'json',
	        processData: false,  // 告诉JSLite不要去处理发送的数据
	        contentType: false   // 告诉JSLite不要去设置Content-Type请求头
		}).done(function(result){
			if (result.success == 1) {
				$('#inputPoster').val("/upload/"+result.url);
				$('#poster').attr('style','');
				$('#posterImg').attr('src','/upload/'+result.url);
				$('#updatePoster').css('display','none');
			}
		});
	});
});
$(function(){
	$("input[name=doSubmit]").click(function(){
		var username = $('#username').val();
		var code = $('#reisterCode').val();
		var password = $('#password').val();
		$.ajax({
			type:'post',
			url:'/admin/register',
			data:'username='+username+'&code='+code+'&password='+password
		}).done(function(result){
			if (result.success == 0) {
				$('#msg').html(result.msg);
			}else if(result.success == 1){
				$('#msg').html("<font color='green'>"+result.msg+"</font>");
				setTimeout(function(){
					window.location.href="http://127.0.0.1:3000/admin/login";
				},3000);	
			}
		});
	});
});
phoneReg();
pwdReg();
//手机号验证
function phoneReg(){
	$('#username').blur(function(){
    	$('#msg').html("");
    });
	$('#username').keyup(function(){
		var phone = $(this).val();
		if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
	        $('#msg').html("手机号码有误，请重填");
	    }else{
	    	$.ajax({
	    		type:'post',
	    		url:'/admin/user/register',
	    		data:'username=' + $('#username').val()
	    	}).done(function(result){
	    		if (result.success == 0) {
	    			$('#msg').html(result.msg);
	    		}else if(result.success == 1){
	    			$('#msg').html(result.msg);
	    		}
	    	});
	    }
	});
}
//密码验证
function pwdReg(){
	$('#password').blur(function(){
		$('#msg').html("");
	});
	$('#password').focus(function(){
		$('#msg').html("<font color='gray'>强烈建议密码长度为8-20字符</font>");
	});
	$('#password').keyup(function(){
		if ($(this).val().length < 6) {
			$('#msg').html("密码不能小于6!");
		}else{
			$('#msg').html("");
		}
	});
}
//手机号验证返回值
function phoneRegReturn(){
	var phone = $('#username').val();
	if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
        return 0;
    }else{
	    return 1;
    }
}

