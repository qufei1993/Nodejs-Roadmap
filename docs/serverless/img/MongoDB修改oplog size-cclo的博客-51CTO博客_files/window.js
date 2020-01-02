(function(){
	if(typeof isLogin !='undefined' && isLogin=='0'){
        return true;
    }
	var couponDiv = $('<div class="mask3"></div><div class="newcoupon-div"><span class="close"></span></div>');

	getCouponPop();
	function getCouponPop() {
		$.ajax({
			url: '/site/get-pop',
			data: {},
			type: 'POST',
			dataType: 'json',
			success: function (e) {
				if(e.status == 0 && typeof e.data.newcoupon !='undefined'){
					createCouponDiv(e);
				}
			}
		});

	}
	function createCouponDiv(e) {
		if(e.data == '') {return;}
		var newcoupon = e.data.newcoupon.list;
		var couponLength = e.data.newcoupon.count;
		var couponUlClass = couponLength == 1 ?  'newcoupon-div1' : 'newcoupon-div2';
		var couponLeftBtn = couponLength <= 2 ? '查看优惠券' : '查看全部优惠券';
		var couponUl = '<ul class="coupon-list">';
		$.each(newcoupon.slice(0,2), function(index, item) {
			couponUl += '<li class="clearfix">' +
				'<a class="close" data-action="'+BLOG_URL+'cloumn/index">' +
					'<div class="left fl">' +
						'￥<span class="price">'+item.coupon_price+'</span>' +
					'</div>' +
					'<div class="right fl">' +
						'<p class="type">'+item.name+'</p>' +
						'<p class="time">到期时间：'+item.expire+'</p>' +
						'<p class="name">'+item.scope_desc+'</p>' +
					'</div>' +
				'</a>' +
			'</li>';
		});
		couponUl += '</ul>';
		var bottomBtn = '<div class="btn-wrap1 clearfix">' +
											'<a class="left close" href="javascript:;" data-action="'+BLOG_URL+'coupon/list">'+couponLeftBtn+'</a>' +
											'<a class="right close" href="javascript:;" data-action="'+BLOG_URL+'cloumn/index">去选专栏</a>' +
										'</div>';

		couponDiv.remove();
		$('body').append(couponDiv);
		$('.mask3').show();
		$('.newcoupon-div').addClass(couponUlClass)
											 .append('<p class="tip">持续学习是一种竞争力</p>' +
															 '<p class="number">恭喜你获得'+couponLength+'张优惠券</p>' +
															 couponUl + bottomBtn
															);
		$('.newcoupon-div .close').click(function() {
		  couponDiv.remove();
		  var actionHref = $(this).data('action');

			 $.ajax({
	        url: '/site/close-pop',
	        data: {type: 'newcoupon'},
	        type: 'GET',
	        dataType: 'json',
	        success: function(e){
						if (e.status == 0) {
							if (actionHref) {
								window.location.href = actionHref;
							}
						}
	        }
	    },'json');
		});
	}
})();
