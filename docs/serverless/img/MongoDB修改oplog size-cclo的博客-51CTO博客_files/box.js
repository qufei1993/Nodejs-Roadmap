var Class = {
 create: function() {   
    return function() {
      this.initialize.apply(this, arguments);
    }
 }
}
var AutoAD = Class.create()
AutoAD.prototype = {
  initialize:function(parms){
    this.ip     = imgpath?imgpath:'https://static1.51cto.com/edu/images/whitestyle/';
    this.cookie = parms.cookie?parms.cookie:'AutoAD';
    this.ts     = parms.ts?parms.ts:86400;
    this.W      = parms.W?parms.W:500;
    this.H      = parms.H?parms.H+'px':'auto';
    this.ADD    = parms.ADD?parms.ADD:'';
    this.cb     = parms.cb?parms.cb:function(){}; 
    this.ok     = parms.ok?parms.ok:function(){};
    this.autoClose = parms.autoClose?parms.autoClose:false;
    this.noCBtn = parms.noCBtn?parms.noCBtn:false;
    this.mask   = parms.mask?parms.mask:false;
    this.fixed  = parms.fixed?parms.fixed:true;
    this.last   = parms.last?parms.last:false;
    if(this.last && new Date().getTime()>new Date(this.last).getTime()) return false;
    if(!getCookie(this.cookie)){
      this.build();
      setCookie(this.cookie,1,this.ts)
    }
  
  },
  build:function(){
    this.mb = $('<div></div>');
    this.mb.css({
      'position':'fixed',
      'display':'none',
      'left':($(window).width()-this.W)/2+3+'px',
      'z-index':'9999999',
      'overflow':'hidden',
      'width':this.W+'px',
      'height':this.H,
      'padding':'3px'
    });
    this.cBtn = $('<img />');
    this.cBtn.css({
      'overflow':'hidden',
      'cursor':'pointer',
      'position':'absolute',
      'right':10,
      'top':0,
      'z-index':10
    });
    this.Mask = $('<div id="Mask"></div>');
    this.Mask.css({
      'overflow':'hidden',
      'z-index':'9999998',
      'width':'100%',
      'height':$(window).height(),
      'position':'fixed',
      'top':'0px',
      'left':'0px',
      'background':'#FFF',
      'opacity':0.6
    });
    this.builder();
  },
  builder:function(){
    var me = this;
    this.mb.append(this.ADD);
    if(this.noCBtn == false){
      this.mb.append(this.cBtn);
    }
    this.show();
  },
  show:function(){
    var me = this;
    if(this.mask) $('body').append(this.Mask);
    if(typeof(this.mask)=='string') this.Mask.css('background',this.mask)
    if($("#"+this.id).length>0) $("#"+this.id).remove();
    $('body').append(this.mb);
    this.mb.css('top',($(window).height()-this.mb.height())/2);
    if(this.mb.height()>$(window).height()){
      $(window).css('overflow','hidden');
      $(this.mb).css({
        'position':'absolute',
        'top':30+$(window).scrollTop()
      })
    }
    $(this.mb).fadeIn(this.t*1000);
    $(this.mb).find('a.closeMB').click(function(){
      me.close();
      me.complete();
    });
    $(this.cBtn).click(function(){
      me.close();
      me.closed();
    }).bind('mouseover',function(){
      $(this).css('transform','rotate(30deg)');
    }).bind('mouseout',function(){
      $(this).css('transform','rotate(0deg)');
    });
    $(this.mb).find('button.closeMB').click(function(){
      me.close();
      me.complete();
    });
    if (this.autoClose) {
      setTimeout(function(){
        me.close();
        me.complete();
      },this.autoClose*1000);
    };
    if(this.fixed!==true){
      this.mb.css({
        'position':'absolute',
        'top':$(window).scrollTop()+100
      })
    }
  },
  close:function(){
    var me = this;
    $(this.Mask).remove();
    $(this.mb).remove();
  },
  closed:function(){
    this.cb();
  },
  complete:function(){
    this.ok();
  }
}
