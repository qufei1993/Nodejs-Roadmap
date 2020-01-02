// save && get && del Cookies
function setCookie(name,value,iDay){var oDate=new Date();oDate.setTime(oDate.getTime()+iDay*1000);var dateStr=(iDay==0)?"":";expires="+oDate.toGMTString();document.cookie=name+"="+value+dateStr+";path=/"}function getCookie(name){var arr=document.cookie.split("; ");var i=0;for(i=0;i<arr.length;i++){var arr2=arr[i].split("=");if(arr2[0]==name){return arr2[1]}}return""}function removeCookie(name){setCookie(name,"",-1)};
// select tab list
function setHover(obj){
  obj.mouseenter(function(){
    if(obj.find('ul li').length > 0){
      obj.addClass('on')
    }
  }).mouseleave(function(){
    obj.removeClass('on')
  })
}
function setPraise(obj){//赞
  obj.click(function(ev){
    var me = $(this),
  	    text = parseInt(me.text() == '' ? 0 : me.text()),
  			par = me.parent(),
  			type = me.attr('type'),
  			blog_id = me.attr('blog_id');
  			userid = me.attr('userid');
    if(par.hasClass('on'))return false;
    if(isLogin == 1){//登录
      $.post(praise_url,{id:blog_id,type:type,userid:userid},function(e){
        if(e.status == 1){
          me.text(text+1)
          par.addClass('on')
          var x = $('<div class="jia1">+1</div>')
          .css({'top':ev.pageY-15,'left':ev.pageX+6,'z-index':10})
          $("body").append(x)
          x.animate({top:ev.pageY-20,left:ev.pageX+10,'font-size':'16px',opacity:'show'},300,'swing',function(){
            x.fadeOut(500)
          })
        }else{
          new AutoBox({content:e.msg,img:'remind',mask:"#000",autoClose:3})
        }
      },'JSON')
    }else{//没登录
      Login()
    }
  })
};
$(function(){
  if(!getCookie('showMsgOver')){
    var mask = $('<div style="position:fixed;left:0;right:0;top:0;bottom:0;background:#000;display:none;z-index:100;"></div>').css('opacity','0.3'),
    close = $('<button style="width:24px;height:24px;background:url(https://s1.51cto.com/images/201711/16/08ef236877f1bc9b4718ecc20477d3dd.png) no-repeat;padding:0;margin:0;position:absolute;right:10px;top:10px;z-index:102;">&nbsp;</button>').click(function(){mask.remove();fadm.remove()}),
    fadm = $('<div style="position:fixed;left:50%;top:50%;margin-left:-300px;margin-top:-205px;z-index:101;display:none;"></div>')
    .append('<img style="display:block;" src="https://s1.51cto.com/images/201711/21/dc0850ffaacc7e371b8996d6f163c58f.png">')
    .append(close)
    //$('body').append(mask).append(fadm)
    mask.fadeIn(500)
    fadm.fadeIn(1000)
    setCookie('showMsgOver',1,86400*30)
  }
})
