$(function(){
	$('#publishComment').click(function(e){
		if($("#com-textarea").val() == ''){
			layer.alert('您还没有输入内容呢!', {
			  icon:5,
			  skin: 'layer-ext-moon'
			})
			return false;
		}
		var movie = $("input[name=movie]").val();
		var from = $("input[name=from]").val();
		var content = $("textarea[name=content]").val();
		$.ajax({
			type:'post',
			url:'/user/comment/',
			data:'movie='+movie+'&from='+from+'&content='+content
		}).done(function(result){
			if(result.success == 1){
				var count = parseInt($('.commentCount').text()) + 1;
				$('.commentCount').text(count);
				var date = FormatDate(result.movie.meta.createAt);
				var $comTit02 = $('.comTit02');
				var commentItem = $("<div class='commentItem clearfix'>");
				var userPhoto = $("<div class='col-1 userPhoto'><img src='/image/photo.jpg' alt=''></div>");
				var commentMain = $(" <div class='col-11 commentMain'></div>");
				var title = $(" <p class='title'><span class='userName'>"+result.movie.from.username+"</span><span class='publishTime'>"+date+"</span></p>");
				var content = $("<p class='content'>"+result.movie.content+"</p>");
				var comicon = $(" <p class='comicon'><i class='fa fa-thumbs-o-up'></i><i class='fa fa-thumbs-o-down'></i></p>");
				var span1 = $("<span onclick=\"showAnswer('"+result.movie._id+"')\" id='show-"+result.movie._id+"'>回复</span>");
				var span2 = $("<span onclick=\"hideAnswer('"+result.movie._id+"')\" id='hide-"+result.movie._id+"' style='display:none'>取消回复</span>")
				var share = $("<span>分享</span>");

				var answer = $("<div class='div answer data-id-"+result.movie._id+"'>");
				var form = $("<form></form>");
				var replyCid = $("<input type='hidden' name='cid"+result.movie._id+"' value='"+result.movie._id+"'>");
				var replyTid = $("<input type='hidden' name='tid"+result.movie._id+"' value='"+result.movie.from._id+"'>");
				var commentFrom = $("<input type='hidden' name='from"+result.movie._id+"' value='"+$("#userId").attr('userId')+"'>");
				var commentContent = $("<input placeholder='0/140字' class='form-control' id='reply-"+result.movie._id+"' name="+result.movie._id+">");
				var answerBtn = $("<button type='submit' class='btn btn-success answerBtn ' id="+result.movie._id+">回复评论</button>");
				comicon.append(span1);
				comicon.append(span2);
				comicon.append(share);
				form.append(replyCid);
				form.append(replyTid);
				form.append(commentFrom);
				form.append(commentContent);
				form.append(answerBtn);
				answer.append(form);
				commentMain.append(title);
				commentMain.append(content);
				commentMain.append(comicon);
				commentMain.append(answer);
				commentItem.append(userPhoto);
				commentItem.append(commentMain);
				$comTit02.after(commentItem);
			}
		});
	});
});
function showAnswer(obj){
	if($("#userId").attr('userId') == undefined){
			layer.alert('您还未登录,请登录后在回复!', {
			  icon:5,
			  skin: 'layer-ext-moon'
			})
			return false;
	}
	$('#show-'+obj).css('display','none');
	$('#hide-'+obj).css('display','inline-block');
	displayAnswer(obj,'block');
	$("#"+obj).click(function(){
		if($("#reply-"+obj).val() == ''){
			layer.alert('回复内容不能为空!', {
			  icon:5,
			  skin: 'layer-ext-moon'
			})
			return false;
		}
		var cid = $("input[name=cid"+obj+"]").val();
		var tid = $("input[name=tid"+obj+"]").val();
		var from = $("input[name=from"+obj+"]").val();
		var content = $("input[name='"+obj+"']").val();
		$.ajax({
			type:'post',
			url:'/user/comment/',
			data:'cid='+cid+'&tid='+tid+'&from='+from+'&content='+content
		}).done(function(result){
			var date = FormatDate(result.reply.createAt);
			var commentItem = $("<div class='commentItem clearfix'>");
			var userPhoto = $("<div class='col-1 userPhoto'><img src='/image/photo.jpg' alt=''></div>");
			var commentMain = $(" <div class='col-11 commentMain'></div>");
			var title = $(" <p class='title'><span class='userName'>"+result.reply.from.username+"</span><span class='publishTime'>"+date+"</span></p>");
			if(result.reply.from.username == result.reply.to.username){
				var content = $("<p class='content'>"+result.reply.content+"</p>");
			}else{
				var content = $("<p class='content'><span class='aite'>回复@"+result.reply.to.username+":</span>"+result.reply.content+"</p>");
			}
			var comicon = $(" <p class='comicon'><i class='fa fa-thumbs-o-up'></i><i class='fa fa-thumbs-o-down'></i></p>");
			var span1 = $("<span onclick=\"showAnswer('"+result.reply._id+"')\" id='show-"+result.reply._id+"'>回复</span>");
			var span2 = $("<span onclick=\"hideAnswer('"+result.reply._id+"')\" id='hide-"+result.reply._id+"' style='display:none'>取消回复</span>")
			var share = $("<span>分享</span>");
			var answer = $("<div class='div answer data-id-"+result.reply._id+"'>");
			var form = $("<form></form>");
			var replyCid = $("<input type='hidden' name='cid"+result.reply._id+"' value='"+result.cid+"'>");
			var replyTid = $("<input type='hidden' name='tid"+result.reply._id+"' value='"+result.reply.to._id+"'>");
			var commentFrom = $("<input type='hidden' name='from"+result.reply._id+"' value='"+$("#userId").attr('userId')+"'>");
			var commentContent = $("<input placeholder='0/140字' class='form-control' id='reply-"+result.reply._id+"' name="+result.reply._id+">");
			var answerBtn = $("<button type='button' class='btn btn-success answerBtn ' id="+result.reply._id+">回复评论</button>");
			comicon.append(span1);
			comicon.append(span2);
			comicon.append(share);
			form.append(replyCid);
			form.append(replyTid);
			form.append(commentFrom);
			form.append(commentContent);
			form.append(answerBtn);
			answer.append(form);
			commentMain.append(title);
			commentMain.append(content);
			commentMain.append(comicon);
			commentMain.append(answer);
			commentItem.append(userPhoto);
			commentItem.append(commentMain);
			$('#answer-id-'+result.cid).after(commentItem);
		});
	});
}
function hideAnswer(obj){
	$('#show-'+obj).css('display','inline-block');
	$('#hide-'+obj).css('display','none');
	displayAnswer(obj,'none');
}
function displayAnswer(obj,val){
	$(".data-id-"+obj).css('display',val);
}
function FormatDate (strTime) {
    var date = new Date(strTime);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}
