// 使用方法：
// new Follow(Dom(id|obj),uid,status,['on','in','mutual','off'])
var Follow = function(){
  this.init(arguments)
}
Follow.prototype.init = function(e){
  var me=this
  this.btn = typeof e[0]=='string'?$("#"+e[0]):e[0] //按钮
  this.uid = e[1] //目标用户id
  this.s   = e[2] //关注状态[1|2|3]【未关注|已关注|互相关注】
  this.css = e[3] //状态关联css[a,b,c,d] 顺序：【未关注，已关注，互相关注，取消关注】
  this.text = e[4]?e[4]:['关注','已关注','互相关注','取消关注'] //【关注，已关注，互相关注，取消关注】
  this.lock= false
  this.btn.click(function(){
    if(isLogin != 1){Login()}
    if(me.lock) return false;
    if(me.s>1){//未关注
      me.start()  
    }else{
      if(me.msg){
        me.msg(me.start())
      }else{
        me.start()
      }
    }
    
  })
  .mouseenter(function(){
    if(me.s>1) 
      me.set(3);
  })
  .mouseleave(function(){
    me.set(me.s,true)
  })
}
Follow.prototype.start = function(e){
  var me = this;
  this.lock=false
  $.post('/index/follow',{fid:this.uid,type:(this.s==1?1:2)},function(res){
    me.lock=false;
    if(res.status==1){
      me.s=res.data.status
      me.set(me.s, true) //要求返回值中 data 值必须为当前关注状态 【1|2|3】
      me.success(me.s)
    }
  },'json')
}
Follow.prototype.set = function(e,s){
  /*e:目标状态序号
    0:未关注
    1:已关注
    2:互相关注
    3:取消关注
  */
  if(s) e=e-1
  this.reset()
  this.btn.addClass(this.css[e]).text(this.text[e])
}
Follow.prototype.reset = function(){//重置状态
  var me=this
  $.each(this.css,function(i,e){
    me.btn.removeClass(e)
  })
}
Follow.prototype.success = function(e){//关注成功
}
var mask = $('<div class="mask"></div>')
    msg_index_box = $('<div class="msg-index-box"></div>'),
    cls = $('<p class="follow-close"></p>'),
    top_bg = $('<p class="top-bg"></p>'),
    con_box = $('<div class="con-box"></div>'),
    icon_1 = $('<p class="icon-bg icon-1"></p>')
    icon_2 = $('<p class="icon-bg icon-2"></p>')
    h21 = $('<h2>发布成功</h2>')
    h22 = $('<h2>关注成功</h2>')
    con1 = $('<div class="con">该作者所有的新文章都可在<a href="https://blog.51cto.com/blog/follow" target="_blank">文章&gt;关注</a>中查看到</div><div class="con">关注并绑定官方微信服务号还可第一时间收到更新提醒</div>'),
    con2 = $('<div class="con">关注并绑定官方微信服务号可随时随地</div><div class="con">收到回复提醒</div>'),
    code_bg = $('<div class="code-bg"><iframe id="childframe" src="https://home.51cto.com/wechat/get-iframe-qr-code?reback='+location.href+'" iframeboder="0" scrolling="no" allowtransparency="true" style="border: 0 none;margin: 8px 14px;" width="120" height="120" name=""></iframe></div>')
    btn_box = $('<div class="btn-box"><p class="btn-1">不再提醒</p><p class="btn-2">知道了</p></div>')
function box1(){//关注成功code
    $('body').append(mask).append(msg_index_box)
    msg_index_box.append(cls).append(top_bg).append(con_box)
    con_box.html('').append(icon_2).append(h22).append(con1).append(code_bg).append(btn_box)
    msg_index_box.css('height','330px')
    boxCls1()
}
function box2(){//关注成功
    $('body').append(mask).append(msg_index_box)
    msg_index_box.append(cls).append(top_bg).append(con_box)
    con_box.html('').append(icon_2).append(h22).append(con1).append(btn_box)
    msg_index_box.css('height','150px')
    boxCls2()
}
function boxCls1(){
    $('.mask').show()
    $('.btn-box .btn-2, .msg-index-box .follow-close').bind('click',function(){
      $('.msg-index-box').remove()
      $('.mask').remove()
    })
    $('.btn-box .btn-1').bind('click',function(){
      setCookie('follow1','follow1',3650)
      $('.msg-index-box').remove()
      $('.mask').remove()
    })
}
function boxCls2(){
    $('.mask').show()
    $('.btn-box .btn-2, .msg-index-box .follow-close, .btn-box .btn-1').bind('click',function(){
      setCookie('follow2','follow2',3650)
      $('.msg-index-box').remove()
      $('.mask').remove()
    })
}
