(function($){
$.fsgallery = {
	defaults:{
		mode:'full',
		twidth:160,
		theight:90,
		dtopacity:0.6,
		toutopacity:0,
		copacity:0.8,
		kbcontrol:true,
		navbutton:true,
		speed:200,
		easing:0,
		eatype:'easeOutCirc',
		postdata:''
	}
};
$.fn.fsgallery = function(op){
	op = $.extend($.fsgallery.defaults, op||{});
	return this.each(function(){
		var tid=$(this).attr('id');
		if(!tid){
			tid='tid-'+new Date().getTime();
			$(this).attr('id',tid);
		}
		/*if($(this).attr('href')){
			if('undefined'!=typeof $.datacache['data'][tid]) return init.call($('#fsgallery-thumb-'+tid)[0]);
			return getdata.call(this);
		}*/
		init.call(this);
	});
	function init(){
		var me=this,id=$(me).attr('id'),wrap=$('#fsgallery-wrapper'),cb=$('#fsgallery-container-'+id),tw;
		if(!wrap.length){
			wrap=$('<div>',{id:'fsgallery-wrapper','class':'fsgallery-wrapper'})
				.prependTo('body');
		}
		$('body').css('overflow','hidden');
		if($(this).attr('href')){
			if('undefined'==typeof $.datacache['data'][id]) return getdata.call(me);
			me=$('#fsgallery-thumb-'+id)[0];//return init.call($('#fsgallery-thumb-'+tid)[0]);
		}
		wrap.show();$(this).show();
		if(cb.length>0) return cb.siblings('div').hide().end().show();
		cb=$('<div>',{id:'fsgallery-container-'+id,'class':'fsgallery-container'}).prependTo(wrap);
		cb.append('<a href="#close" class="close"></a><a href="#viewmode" class="viewmode"></a><a href="#next" class="next"></a><a href="#prev" class="prev"></a><span class="pictitle"></span><img />');
		tw=$('li',me).length*$('li:first',me).outerWidth()+10;
		$('ul',me).css({'width':tw});
		$('>div',me).css({'height':$('li:first a',me).outerHeight()});
		$('img',me).fadeTo(op.speed, op.dtopacity);
		$(me).mousemove(function(e){
			if($(this).outerWidth()>tw) return false;
			fgscroll.call($('>div',this),e,tw);
		}).hover(function(){
			$(this).stop().fadeTo(op.speed, 1);
		}, function(){
			$(this).stop().fadeTo(op.speed, op.toutopacity);
		});
		$('a',cb).bind('click', function(){
			nav.call(cb,me,this);
			return false;
		});
		$('a',me).hover(function(){
			$(this).fadeTo(op.speed, 1);
		}, function(){
			$(this).fadeTo(op.speed, op.dtopacity);
		}).live('click', function(){
			showpic.call(cb,this);
			return false;
		}).eq(0).trigger('click');
		$(window).resize(function(){
			//wrap.css('height',$(window).height());
			showpic.call(cb,$('li.active',me).removeClass('active').find('a').get(0));
		});
	};
	function nav(sc,a){
		var url=$(a).attr('href'),fn=url.substr(url.lastIndexOf('#')+1);
		if('close'==fn){
			$(this).hide();
			$(this).parent().hide();
			$(sc).hide();
			$('body').css('overflow','auto');
		}else if('viewmode'==fn){
			if($(a).hasClass('dmode')){
				$(a).removeClass('dmode');
			}else{
				$(a).addClass('dmode');
			}
			$('img',this).attr('src','');
			showpic.call(this,$('li.active',sc).removeClass('active').find('a').get(0));
		}else{
			var li=$('li.active',sc)[fn]();
			if(!li.length) return ;
			showpic.call(this,$('a',li).get(0));
		}
	};
	function showpic(ob){
		if($(ob).parent().hasClass('active')) return false;
		$(ob).parent().siblings('.active').removeClass('active')
			.end().addClass('active');
		var me=this,img=$('img',me),src=$(ob).attr('href'),pt=$(ob).attr('title'),span=$('.pictitle',me);
		img.fadeOut('fast', function(){
			$.imgReady(src, function(){
				img.attr('src',src);//.css('visibility','hidden');
			}, function(){
				var css={},w=$(me).width(),h=$(me).height(),mode=$('.viewmode',me),zoom;
				img.removeAttr('style');
				if(mode.hasClass('dmode')){
					zoom=Math.min(w/this.width,0==h?10000:h/this.height);
					if(zoom<1){
						css.width=this.width*zoom;
						css.height=this.height*zoom;
					}else{
						css.marginTop=parseInt((h-this.height)/2);
					}
				}else{
					css.marginTop=parseInt((h-this.height)/2);
					if(w<this.width) css.marginLeft=parseInt((w-this.width)/2);
				}
				img.css(css).fadeIn('slow');//.css('visibility','visible');
			});
			if(pt){
				img.attr("alt", pt).attr("title", pt);
				span.fadeOut("fast",function(){
					span.html(pt).fadeIn();
				});
			}else{
				span.fadeOut("fast");
			}
		});
	};
	function fgscroll(e,tw){
		var pos=$(this).offset(),w=$(this).outerWidth(),mc=(e.pageX-pos.left),ul=$('ul',this);
			var mpx=mc/w;
			var destX=-((tw-w*2)*mpx);
			var thePosA=mc-destX;
			var thePosB=destX-mc;
			if(mc>destX){
				ul.stop().animate({'left': -thePosA}, op.easing, op.eatype); //with easing
			} else if(mc<destX){
				ul.stop().animate({'left': thePosB}, op.easing, op.eatype); //with easing
			} else {
				ul.stop();  
			}
	};
	function datapic(data){
		var div,sc,ul,li,id=$(this).attr('id');
		$.datacache['data'][id] = data;
		div=$('<div>',{id:'fsgallery-thumb-'+id,'class':'fsgallery-thumb-outer'}).prependTo('body');
		sc=$('<div>',{id:'fsgallery-thumb-scroll-'+id,'class':'fsgallery-thumb-scroll'}).prependTo(div);
		ul=$('<ul>').appendTo(sc);
		$.each(data, function(k,one){
			li=$('<li>').appendTo(ul);
			li.append('<a href="'+one.fileurl+'" title="'+one.description+'" class="fsgallery-thumb"></a>');
			$('<img>',{src:one.thumb}).appendTo($('a',li));
		});
		init.call(div[0]);
	};
	function getdata(){
		if(!$.isFunction(op.datasuccess)){
			op.datasuccess = function(data){
				datapic.call(this.tid,data.subdata || data);
			}
		}
		$.ajax({
			url:$(this).attr('href'),
			type:'post',
			data:op.postdata,
			dataType:'json',
			tid:this,
			success:op.datasuccess
		});
		return true;
	};
};
})(jQuery);