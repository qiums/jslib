(function($) {
    $.fn.slider = function(options){
        var options = $.extend({}, $.fn.slider.defaults, options);
        this.each(function() {
            var count=0,obj=$(this),curr=0,$div=obj.find(">div"),s=$div.length,w=obj.width(),h=obj.height(),timeout;
            !options.height?obj.height(h):obj.height(options.height);
            !options.width?obj.width(w):obj.width(options.width);
            obj.css({"overflow":"hidden","position":"relative"});
			$div.css({'position':'absolute','z-index':'5'}).eq(0).css('z-index',6);
            if ('scroll'===options.animate){
				if (!options.vertical) $div.css('float','left');
            };
            if (s>1 && options.controlsShow){
				var nav=jQuery('<div>',{id:'slidenum','class':'slidernum'});
                for (i=0;i<s;i++){
                    jQuery('<span>').text(i+1)
						.hover(function(){
							//clearInterval(timeout);
							if($(this).hasClass('on')) return false;
							curr=parseInt($(this).text(),10)-1;play();
						})
						.appendTo(nav);
                }
                nav.appendTo(obj);
            };
			obj.hover(function(){
				clearInterval(timeout);
				count=0;
			},function(){/*play();*/relay();});
			play();
			relay();
			function play(){
				if (s===1) return ;
				if(count>=100) return clearInterval(timeout);
                $div.stop(true,true);
				flash();
				curr++;
				count++;
				if (curr>=s) curr=0;
			};
			function relay(){
				timeout = setInterval(function(){
					play();
				},options.pause);
			};
            function flash() {
                if (nav) $('span',nav).removeClass('on').eq(curr).addClass('on');
                if ('fade'==options.animate){
					$div.fadeTo('normal',0, function(){$(this).css('z-index','5');})
						.eq(curr).fadeTo('norma',1,function(){
							$(this).css('z-index','6');
						});
				}else{
					var self=$div.eq(curr),prev=$div.filter('.active'),css;
					css = (!options.vertical)?{left:w}:{top:h};
					css['z-index'] = 7;
					prev.css('z-index','6');
					self.css(css)
						.animate({left:0,top:0},
						options.speed, options.easing,
						function(){
							prev.css('z-index','5').removeClass('active');
							$(this).addClass('active');
						});
				};
           }
        });
    };
    //默认值
    $.fn.slider.defaults = {
        controlsShow: true, //是否显示数字导航
		animate:'fade', //fade,scroll
        vertical: false, //纵向还是横向滑动
        speed: 'fast', //滑动速度
        auto: true, //是否自定滑动
        pause: 5000, //两次滑动暂停时间
        easing: "swing", //easing效果，默认swing，更多效果需要easing插件支持
        height: 0, //容器高度，不设置自动获取图片高度
        width: 0//容器宽度，不设置自动获取图片宽度
    }
})(jQuery);