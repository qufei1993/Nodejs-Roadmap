(function(){
	var checkdata, checkResult;
	var Appreciate = function(){
	  	this.init()
	}
	Appreciate.prototype.init = function(){
		this.pointerClick()
	}
    Appreciate.prototype.setHTML = function() {
    	var text = '<div class="mask"><div class="appreciate-nbox"><p class="close"></p><div class="appreciate-nbox-1"><h2>有你赞赏支持，博客原创会更美好</h2>'
			text += '<ul class="list"><li><span>1</span>元</li><li><span>2</span>元</li><li class="on"><span>5</span>元</li><br><li><span>10</span>元</li><li><span>20</span>元</li><li><span>50</span>元</li><div class="clear"></div></ul>'
			text += '<input class="place_number" type="text" value="手动输入"><p class="msg">您需支付<font class="show-money">5</font>元，感谢您的赞赏</p><p class="appreciate-ajax">去支付</p></div>'
			text += '<div class="appreciate-nbox-2"><h3>微信/支付宝扫码付款</h3><img src=""><p class="error-1 error-msg">赞赏金额<em>￥0</em></p><p class="error-2 error-msg"></p><p class="error-3 error-msg"><i></i>支付成功</p></div>'
			text += '</div></div>'
		$('body').append(text)
    }
	Appreciate.prototype.checkMoney = function() {
		var value = $('.show-money').text()
		$('.appreciate-nbox-1 .error-msg').remove();
		var re = /^[0-9]+$/ ;
		if(value == '' || value == 0) {
			$('.appreciate-ajax').before('<p class="error-msg">请选择赞赏金额或输入任意金额</p>');
			return false;
		} else if(!re.test(value)) {
			$('.appreciate-ajax').before('<p class="error-msg">请选择赞赏金额或输入任意金额</p>')
			return false;
		} else if(value < 0 || value > 200) {
			$('.appreciate-ajax').before('<p class="error-msg">最多可赞赏200哦</p>')
			return false;
		} else {
			return true;
		}
	}

	Appreciate.prototype.getQrcode = function() {
		var me = this
			money = parseInt($('.show-money').text());
		$('.appreciate-nbox-2 .error-1 em').html('￥'+money);
		$('.appreciate-nbox-2 .error-msg').hide();
	    $('.appreciate-nbox-2 .error-1').show();
		$.ajax({
	        url: blog_url + 'qr/get-qr-url',
	        data: {'id':blog_id, 'type':2, 'm':money},
	        type: 'POST',
	        dataType: 'JSON',
	        success: function(e){
	            if(e.status == 1){
	            	var qr_url = e.data.url;
	            	$('.appreciate-nbox-2 img').attr('src', qr_url);
	            	checkdata = e.data.checkdata
					checkResult = setInterval(me.checkPayResult, 5000)
	            } else {
	                new AutoBox({content:'<div style="padding: 0 40px;">'+e.msg+'</div>',mask:"#000",autoClose:3})
	            }
	        }
	    })
	}
	Appreciate.prototype.stopCheckPay = function() {
		var me = this
		checkResult=window.clearInterval(checkResult);
	}
	Appreciate.prototype.checkPayResult = function() {
		var me = this
		if(!checkdata) {return false;}
		$.ajax({
	        url: blog_url + 'pay/check-buy',
	        data:{checkdata: checkdata},
	        type: 'POST',
	        dataType: 'JSON',
	        success: function(e){
	            if(e.status == 1){
	            	Appreciate.stopCheckPay()
	            	$('.appreciate-nbox-2 .error-msg').hide();
	            	$('.appreciate-nbox-2 .error-3').show();
	            } else if(e.status == 2) {
	            } else if(e.status == -1) {
	            	Appreciate.stopCheckPay();
	            	$('.appreciate-nbox-2 .error-msg').hide();
	            	$('.appreciate-nbox-2 .error-2').html('<i></i>二维码失效<br><span>二维码失效，请点击二维码刷新</span>').show();
	            } else if(e.status == 0) {
	            	Appreciate.stopCheckPay();
	            	$('.appreciate-nbox-2 .error-msg').hide();
	            	$('.appreciate-nbox-2 .error-2').html('<i></i>'+e.msg).show();
	            } else {
	            	$('.appreciate-nbox-2 .error-msg').hide();
	            	$('.appreciate-nbox-2 .error-1').show();
	            }
	        }
	    })
	}
	Appreciate.prototype.isShow1 = function (obj,objpar,sClass){
		if($(obj).hasClass(sClass)){
			$(objpar).css('visibility','hidden')
			$(obj).removeClass(sClass)
		}else{
			$(objpar).css('visibility','visible')
			$(obj).addClass(sClass)
		}
	}
	Appreciate.prototype.isShow2 = function (obj,objpar,sClass){
		if($(obj).hasClass(sClass)){
			$(objpar).removeClass(sClass)
			$(obj).removeClass(sClass)
		}else{
			$(objpar).removeClass(sClass)
			$(obj).addClass(sClass)
		}
	}
	Appreciate.prototype.setPos = function (){
		var me = this
			me.setHTML()
			$('.mask').show()
		var width = $('.appreciate-nbox').width()
			height = $('.appreciate-nbox').height()
		$('.appreciate-nbox').css({'margin-left':-width/2+'px','margin-top':-height/2+'px' })
	}
	Appreciate.prototype.placeNumberCheck = function() {
	    var place_number = $(".place_number").val();
	    var str = place_number.replace(/[^\d]/g, "");
	    var maxlen = 3;
	    if (str.length < maxlen) {
	        maxlen = str.length;
	    }
	    var temp = "";
	    for (var i = 0; i < maxlen; i++) {
	        temp = temp + str.substring(i, i + 1);
	        if (i != 0 && (i + 1) % 4 == 0 && i != 11) {
	            temp = temp + " ";
	        }
	    }
	    $(".place_number").val(temp);
	}
	Appreciate.prototype.pointerClick = function(){
		var me = this
		$('.appreciate-end').click(function(){
			if(isLogin != 1){Login()}else{
				new AutoBox({content:'<div style="padding: 0 40px;margin-top: -20px;">自己不能赞赏自己的文章</div>',mask:"#000",autoClose:3})
			}
		})
		$('.appreciate-open').click(function() {
			if(isLogin != 1){Login()}else{me.setPos()}
		})
		$('.Blog-Right .catalog').click(function(){me.isShow1('.catalog', '.directoryBox', 'on')})
		$('body').on('keyup', '.place_number', function() {
	        me.placeNumberCheck()
	    })
		$('body').on('focus','.place_number',function() {
			$('.appreciate-nbox-1 li').removeClass('on')
			$('.yuan').remove()
			if($(this).val() == "手动输入"){
				$(this).val('').after('<b class="yuan">元</b>')
				$('.show-money').text('0')
			}else{
				$('.show-money').text($(this).val())
			}
		})
		$('body').on('blur','.place_number',function() {
			if($(this).val() == "手动输入" || $(this).val() == "" ){
				$(this).val("手动输入")
				$('.yuan').remove()
				$('.show-money').text('0')
			}else{
				$('.show-money').text($(this).val())
			}
			return me.checkMoney();
		})
		$('body').on('change','.place_number',function() {
			$('.appreciate-nbox-1 li').removeClass('on')
			return me.checkMoney();
		})
		$('body').on('click','.appreciate-nbox-2 img',function(){me.getQrcode();})
		$('body').on('click','.appreciate-nbox .close',function() {
			$('.mask').remove();
			me.stopCheckPay();//停止计时器
		})
		$('body').on('click','.appreciate-nbox-1 li',function() {
			me.isShow2($(this), '.appreciate-nbox-1 li', 'on')
			var text = $('.appreciate-nbox-1 li.on span').text()
			if(text == ""){
				$('.show-money').text(0);
				$('.appreciate-ajax').before('<p class="error-msg">请选择赞赏金额或输入任意金额</p>');
			}else{
				$('.place_number').val('手动输入')
				$('.show-money').text(text)	
				$('.appreciate-nbox-1 .error-msg').remove();
			}
		})
		$('body').on('click','.appreciate-ajax',function() {
			if(!me.checkMoney()) {return false;}
			me.stopCheckPay();
			me.getQrcode();
			$('.appreciate-nbox-1').hide();
			$('.appreciate-nbox-2').show();
		})
	}
	var Appreciate = new Appreciate();
	lowest();
	$(window).scroll(function(){lowest()})
    function lowest(){
    	if($(window).scrollTop()-30+$(window).height() > $('.more-list').offset().top){ 
	    	$('.the-lowest-bg').hide()
	    }else{
	    	$('.the-lowest-bg').show()
	    }
    }
	//目录
	function getLv(n){return parseInt(n.replace('H',''))}
	var h1_num = 1;
	var directory_con = $('<div class="directoryBox"><span class="top-icon"></span><div class="list directory"><ul class="directory-list"></ul></div><span class="bot-icon"></span></div>');
	var list = directory_con.find('ul')
	var ts = []
	var jts = $(".artical-content").find('h1,h2,h3')
	  jts = jts?jts:''
	if(jts.length>0){
		$('.artical-Right').append(directory_con);
	}else{
		$('.catalog').hide()
		//return false;
	}
	jts.each(function(i,e){
		ts.push(e)
	})
	var sort = [0,1,1,1]
	$.each(ts,function(i,e){
		var Lv = 1
		var item = $('<li>'+$(e).text()+'</li>').click(function(){
		  $(window).scrollTop($(e).offset().top)
		  $(this).addClass('on').siblings().removeClass('on')
		})
		list.append(item)
		if(item.prev().hasClass('lv2')){Lv++;};
		if(ts[i-1]&&getLv($(ts[i-1])[0].tagName)<getLv(e.tagName)){Lv++;};
		if(e.tagName=='H1'){Lv=1;}
		if(e.tagName=='H3'){Lv=3;}
		if(ts[i-1]&&getLv($(ts[i-1])[0].tagName)>getLv(e.tagName)){Lv=1;};
		item.addClass('lv'+Lv)
		if(e.tagName=='H1' == 1) {
			item.html('第'+h1_num+'章&nbsp;&nbsp;'+$(e).text())
			h1_num++
		}
	})
	// 滑块
	var $sliderBlock = $('<div class="arrow"></div>');
		list.append($sliderBlock)
    var timer = false;
    $(window).scroll(function(){
        jts.each(function(i,e){
            if($(window).scrollTop()-30 < $(e).offset().top){
                var ch = list.children().eq(i)
                ch.addClass('on').siblings().removeClass('on')
            	if(timer){clearTimeout(timer)}
            	timer = setTimeout(function(){
            		// 滑块位置计算
            		var chTop = ch.position().top;
            		// 第一个没有上边距，其他的加上20上边距
            		if (chTop != 0) {
            			chTop += 18
            		}
            		$sliderBlock.animate({top:chTop}, 100)
            		// 滑块位置结算
            		$(".directory").animate({
            			scrollTop: (ch.position().top-directory_con.height()/2)
            		})
            	},40)
                return false;
            }
        })
        if($(window).scrollTop() < 1200){
    		$('.catalog, .scrollTop').hide()
    	}else{
    		if($('.directory-list').html() == null){
    			$('.scrollTop').css('display','block')
    			$('.catalog').hide()
    		}else{
    			$('.catalog, .scrollTop').css('display','block')
    		}
    	}
    })
})();
