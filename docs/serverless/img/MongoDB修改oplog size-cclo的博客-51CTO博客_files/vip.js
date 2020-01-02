// zjf20180104
$(function(){
	var uids = '';
    var uidsArr = new Array();
    $('.is-vip-img').each(function(){
        if($(this).attr('data-uid')){
            uidsArr.push($(this).attr('data-uid'));
        }
        
    });
    uids = $.unique(uidsArr).join(',');
    if(uids){
        $.ajax({
            url: BLOG_URL +"user/get-avatar",
            data: {uids: uids},
            type: 'GET',
            dataType: 'JSON',
            success: function(e){
                if(e.status==1){
                    $('.is-vip-img').each(function(){
                        var imgobj = $(this);
                        var avataruid = $(this).attr('data-uid');
                        var a_uid_name = 'u'+avataruid;
                        var b = e.data[a_uid_name];
                        if(!b){
                          return
                        }else if(b.isvip == '0'){
                            if(! imgobj.hasClass('is-vip-img-0')) imgobj.attr('src',b.img);
                        }else if(b.isvip == '2'){
                            if(imgobj.hasClass('is-vip-img-1')){
                                imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-1 on"></i>')
                            }else if(imgobj.hasClass('is-vip-img-2')){
                                imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-2 on"></i>')
                            }else if(imgobj.hasClass('is-vip-img-3')){
                                imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-3 on"></i>')
                            }else if(imgobj.hasClass('is-vip-img-4')){
                                imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-4 on"></i>')
                            }else if(imgobj.hasClass('is-vip-img-5')){
                               imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-5 on"></i>')
                            }else if(imgobj.hasClass('is-vip-img-0')){
                                imgobj.after('<i class="vip-icon vip-icon-4 on"></i>')
                            }
                        }else{
                            if(imgobj.hasClass('is-vip-img-1')){
                                imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-1"></i>')
                            }else if(imgobj.hasClass('is-vip-img-2')){
                                imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-2"></i>')
                            }else if(imgobj.hasClass('is-vip-img-3')){
                                imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-3"></i>')
                            }else if(imgobj.hasClass('is-vip-img-4')){
                                imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-4"></i>')
                            }else if(imgobj.hasClass('is-vip-img-5')){
                               imgobj.attr('src',b.img).parent().after('<i class="vip-icon vip-icon-5"></i>')
                            }else if(imgobj.hasClass('is-vip-img-0')){
                                imgobj.after('<i class="vip-icon vip-icon-4"></i>')
                            }
                        }
                        //isClick($('.vip-icon'))
                    });
                }else{
                    new AutoBox({content:e.msg,mask:"#000",autoClose:3})
                }
            }
        })
    }
    $('.vip-icon').live('click',function(){
        window.open("https://home.51cto.com/members/in-fo")
        return false;
    })
})
