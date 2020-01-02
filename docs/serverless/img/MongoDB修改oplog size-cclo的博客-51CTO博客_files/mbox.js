/* 
 * AutoBox
 * @requires jQuery v1.7 or later
 * @create By 2014-11-12
 * @author Ravens<34263626@qq.com>
 */
// 自定义AutoMessageBox
// parms ={}
// parms.img = {ok|remind|quest}
var AutoBox = function(p){
	this.init(p);
}
AutoBox.prototype = {
	init:function(parms){//定义默认值
		this.ip = imgpath?imgpath:'./images/';
		this.id = (parms.id?'Msg_'+parms.id:'Msg_'+Math.random()*10000);
		this.W = parms.W?parms.W:260;
		this.img = parms.img?parms.img:'ok';
		this.title = parms.title?parms.title:'';
		this.content = parms.content?parms.content:'成功';
		this.Yes = parms.Yes?parms.Yes:false;
		this.No = parms.No?parms.No:false;
		this.t = parms.st?parms.st:1;
		this.noCon = parms.noCon?parms.noCon:false;
		this.noCBtn = parms.noCBtn?parms.noCBtn:false;
		this.ADD = parms.ADD?parms.ADD:false;
		this.src = parms.src?parms.src:false;
		this.cb = parms.cb?parms.cb:function(){};
		this.ok = parms.ok?parms.ok:function(){};
		this.yc = parms.yc?parms.yc:function(){};
		this.nc = parms.nc?parms.nc:function(){};
		this.autoClose = parms.autoClose?parms.autoClose:false;
		this.mask = parms.mask?parms.mask:false;
		this.parent = parms.parent?parms.parent:false;
		this.fixed = parms.fixed?parms.fixed:true;

		this.build();
	},
	build:function(){
		//半透明的边框
		this.mb = $('<div id="'+this.id+'"></div>');
		this.mb.css({
			'position':'fixed',
			'display':'none',
			'left':($(window).width()-this.W)/2+3+'px',
			'z-index':'9999999',
			'overflow':'hidden',
			'width':this.W+'px'
		});
		//容器
		this.m = $('<div></div>');
		this.m.css({
			'overflow':'hidden',
			'width':this.W+'px',
			'font-size':'14px',
			'background':'#FFF',
			'padding-bottom':'30px'
		});
		if((this.noCBtn == true)&&(this.title == '')){
			this.m.css('padding-bottom','10px');
		}
		//close
		this.cBtn = $('<img src="https://s1.51cto.com/images/201709/29/4a3cd3be93453ed191b73328f862c5be.png" />');
		this.cBtn.css({
			'overflow':'hidden',
			'width':'12px',
			'height':'12px',
			'margin':'20px 30px 0 0',
			'cursor':'pointer',
			'float':'right'
		});
		//title
		this.Title = $('<h6>'+this.title+'</h6>');
		this.Title.css({
			'overflow':'hidden',
			'max-width':this.W-32+'px',
			'height':'18px',
			'line-height':'1',
			'padding':'20px 0 14px 30px',
			'font-size':'18px',
			'font-weight':'normal',
			'color':'#666',
			'float':'left'
		});
		//Con
		this.Con = $('<div></div>');
		this.Con.css({
			'overflow':'hidden',
			'width':'100%',
			'display':'block;',
			'text-align':'center',
			'margin':'0px auto'
		});
		//Con
		this.ConFont = $('<p style="display:inline-block;padding:10px 0;line-height:25px;">'+this.content+'</p>');
		if((this.noCBtn == true)&&(this.title == '')){
			this.ConFont.css({'margin-top':'10px','line-height':'20px'});
		}

		//bottons
		this.Btns = $('<div style="text-align:right;"></div>');
		this.BtnYes = $('<button>'+this.Yes+'</botton>');
		this.BtnYes.css({
			'margin-right':'30px',
			'padding':'0 26px',
			'background': '#4285f4',
			'color': '#fff'
		})
		this.BtnNo = $('<button>'+this.No+'</botton>');
		this.BtnNo.css({
			'margin-right':'30px',
			'padding':'0 26px',
			'background':'#fff',
			'color':'#333',
			'border':'1px solid #9A9A9A',
			'border-radius':'4px'
		});

		//Mask
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
			'opacity':0.2
		});

		this.builder();
	},
	builder:function(){
		//
		var me = this;
		this.mb.append(this.m);
		if(this.noCBtn == false){
			this.m.append(this.cBtn);
		}
		if(this.title != ''){
			this.m.append(this.Title);
		}
		this.m.append(this.Con);

		if(this.noCon == false){
			this.Con.append(this.ConFont);
		}
		this.Con.append(this.ADD);

		this.Con.append(this.Btns);
		if(me.Yes || me.No){
			if(me.Yes){
				this.Btns.append(this.BtnYes)
			};
			if(me.No){
				this.Btns.append(this.BtnNo)
			}
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
		$(this.mb).find('a.closeMB').click(function(){//
			me.close();
			me.complete();
		});
		//
		$(this.cBtn).click(function(){//
			me.close();
			me.closed();
		}).bind('mouseover',function(){//
			$(this).css('transform','rotate(30deg)');
		}).bind('mouseout',function(){//
			$(this).css('transform','rotate(0deg)');
		});

		if(this.Yes || this.No){
			$(this.BtnYes).click(function(){//
				me.close();
				me.YesClick();
			});
			$(this.BtnNo).click(function(){//
				me.close();
				me.NoClick();
			});
		}else{
			$(this.mb).find('button.closeMB').click(function(){//
				me.close();
				me.complete();
			});
		}
		if (this.autoClose) {//
			setTimeout(function(){//
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
		if(this.parent){
			var p = typeof(this.parent)=='string'?$("#"+this.parent):this.parent
			this.mb.css({
				'position':'absolute',
				'left':(p.width()-this.W)/2+3+'px'
			})
			p.append(this.mb)
		}
	},
	close:function(){
		var me = this;
		$(this.Mask).remove();
		$(this.mb).fadeOut(500,function(){//
			$(this).remove();
		});
		
	},
	closed:function(){
		this.cb();
	},
	complete:function(){
		this.ok();
	},
	YesClick:function(){
		this.yc();
	},
	NoClick:function(){
		this.nc();
	}
}