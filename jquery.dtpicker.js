Date.prototype.format=function(f){
	if ('string'!==$.type(f)) return f;
	var m = [
			['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			['January','February','March','April','May','June','July','August','September','October','November','December']
		]
		, w = [
			['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
			['Sun','Mon','Tues','Wed','Thur','Fri','Sat']
		]
		, a = ['am', 'pm']
		, re = {
			//年
			'Y': this.getFullYear(), //4位数年份
			'y': this.getYear().toString().substr(2,2), //2位数年份
			//月
			'm': fill(this.getMonth()+1), //数字月份，有前导0
			'n': this.getMonth()+1, //数字月份，无前导0
			'F': m[1][this.getMonth()], //完整英文月份
			'M': m[0][this.getMonth()], //简短英文月份
			//天
			'd': fill(this.getDate()), //日期，有前导0
			'j': this.getDate(), //日期，无前导0
			//小时
			'H': fill(this.getHours()), //24小时格式，有前导0
			'h': fill(this.getHours()%12), //12小时格式，有前导0
			'G': this.getHours(), //24小时格式，无前导0
			'g': this.getHours()%12, //12小时格式，无前导0
			'a': a[Math.floor(this.getHours()/12)], //小写的上午和下午
			'A': a[Math.floor(this.getHours()/12)].toUpperCase(), //大写的上午和下午
			//分钟/秒/毫秒
			'i': fill(this.getMinutes()), //分钟，有前导0
			's': fill(this.getSeconds()), //秒
			'u': this.getMilliseconds(), //毫秒
			//星期
			'w': this.getDay(), //星期，0-6
			'l': w[0][this.getDay()], //完整英文星期
			'D': w[1][this.getDay()], //简短英文星期
			//其它
			't': getdays(this) //返回当月的天数
		}
	    , k;
	for (k in re){
		f = f.replace(new RegExp('('+ k+')'), re[k]);
	}
	return f;
	
	function fill(num){
		num = num.toString();
		if (num.length>1) return num;
		return '0'+num;
	};
	function getdays(d){
		var days = [31,28,31,30,31,30,31,31,30,31,30,31], y=d.getFullYear();
		days[1] = (0==y%4&&((y%100!=0)||(y%400==0)))?29:28;
		return days[d.getMonth()];
	};
};
Date.prototype.strtotime = function(str){
	if ('number'===$.type(str)) return str;
	if (!str || ''==str || 'now'===str) return this.getTime();
	if (/(\+|\-)?(\d+)(y|m|d|h|i)/i.test(str)){
		var fn = {y:['getFullYear','setYear'], m:['getMonth','setMonth'], d:['getDate','setDate'], h:['getHours','setHours'], i:['getMinutes','setMinutes']}
			, m = RegExp.$1==='-', d = m ? (0-parseInt(RegExp.$2,10)) : parseInt(RegExp.$2,10);
		if ('undefined'!==typeof fn[RegExp.$3]){
			this[fn[RegExp.$3][1]](this[fn[RegExp.$3][0]]()+d);
			switch (RegExp.$3){
				case 'y':
				this.setMonth(m ? 0 : 11);
				this.setDate(m ? 1 : this.format('t'));
				this.setHours(m ? 0 : 23);
				this.setMinutes(m ? 0 : 59);
				this.setSeconds(m ? 0 : 59);
				break;
				case 'm':
				this.setDate(m ? 1 : this.format('t'));
				this.setHours(m ? 0 : 23);
				this.setMinutes(m ? 0 : 59);
				this.setSeconds(m ? 0 : 59);
				break;
				case 'd':
				this.setHours(m ? 0 : 23);
				this.setMinutes(m ? 0 : 59);
				this.setSeconds(m ? 0 : 59);
				break;
				case 'h':
				this.setMinutes(m ? 0 : 59);
				this.setSeconds(m ? 0 : 59);
				break;
			}
		}
		return this.getTime();
	}
	return Date.parse(str.replace(/-/g, "/"));
};
(function($){
/* $.dialog('Error');
$.dialog(element);
*/
var dtpicker = function(ele, options){
	if (!ele.id) $(ele).attr('id', 'dtp-'+Math.random());
	this.ele = ele;
	this.defaults = {
		range: ['-10y','+10y'],
		calendars: 1,
		format: ['Y/m/d','H:i:s'],
		hastime: true
	};
	this.options = $.extend({}, this.defaults, options || {});
	this.now = new Date().strtotime($(ele).val());
	this.today = new Date();
	this.current = this.now;
	this.wrap = null;
	this.init();
};
dtpicker.prototype = {
	constructor: $.dtpicker,
	weeks: ['Su','Mo','Tu','We','Th','Fr','Sa'],
	init: function(){
		var k, range = this.options.range,
			ex = $(this.ele).attr('class').match(/req\-([^\s"'>]+)/i)[1];
		if ($.type(this.options.format)==='string') this.options.format = this.options.format.split(',');
		for (k in range){
			if ('number'!==$.type(range[k])) this.options.range[k] = new Date().strtotime(range[k]);
		}
		this.options.hastime = (ex==='datetime' && 'undefined'!==typeof this.options.format[1]);
	},
	mktime: function(){
		var el = this.ele, logic = $(el).attr('class').match(/(lt|gt)-([^\s"'>]+)/);
		if (null!==logic && logic[1]){
			var time = 'now'===logic[2] ? new Date().getTime() : (($('#'+logic[2]).length>0 && $('#'+logic[2]).val()!='') ? new Date().strtotime($('#'+logic[2]).val()) : null);
			if (null !== time) this.options.range[logic[1]=='lt' ? 1 : 0] = time;
		}
		if ($(el).val()!==''){
			this.now = this.current = new Date().strtotime($(el).val());
		}
	},
	show: function(){
		this.mktime();
		this.wrap = $('#dtp-' + $(this.ele).attr('id'));
		if (!this.wrap.length){
			this.wrap = $('<div />', {id: 'dtp-'+$(this.ele).attr('id'), 'class':'dtpicker'}).hide().appendTo('body');
			var css = $(this.ele).offset();
			css.top += $(this.ele).outerHeight(true);
			this.wrap.css(css);
		}
		if (this.wrap.is(':visible')) return ;
		this.make();
	},
	make: function(){
		var i, boxes, range=this.options.range
			, c= parseInt(this.options.calendars)
			, tmp=new Date(this.current)
			, ym = tmp.format('Ym');
		this.wrap.html('');
		if (ym < new Date(range[0]).format('Ym')) tmp = new Date(range[0]);
		if (new Date(new Date(this.current).setMonth(tmp.getMonth()+c)).format('Ym') >= new Date(range[1]).format('Ym')){
			tmp = new Date(range[1]);
			tmp.setMonth(tmp.getMonth()-c+1);//$.log(tmp.format('Ym'));
		}
		for(i=0;i<c;i++){
			if (i>0) tmp = new Date(tmp.setMonth(tmp.getMonth()+1));
			//if (tmp.format('Ym')<new Date(this.options.range[0]).format('Ym') || tmp.format('Ym')>new Date(this.options.range[1]).format('Ym')) continue;
			boxes = $('<div class="dtpicker-calendars" />').appendTo(this.wrap)
				.data('dtpicker-curdate', tmp.format('Y-m')).data('dtpicker-index', i);
			$('<div class="dtpicker-header" />').appendTo(boxes);
			$('<div class="dtpicker-body" />').appendTo(boxes);
			this.draw(i, tmp);
		}
		$('<div class="dtpicker-footer" />').appendTo(i===0 ? boxes : this.wrap);
		if (this.options.hastime) $('.dtpicker-footer', this.wrap).append('<input type="text" class="dtpicker-time" value="'+tmp.format(this.options.format[1])+'" /> 修改时间后，再点击对应的日期以使时间生效');
		this.finish();
		this.trigger('Render');
	},
	draw: function(i, tmp){
		var range = this.options.range
			, boxes = $('.dtpicker-calendars:eq('+i+')', this.wrap)
			, days = tmp.format('t')
			, h = [], i, fw;
		fw = new Date(tmp.setDate(1)).getDay(); //当月1号的星期
		$('.dtpicker-header', boxes).append('<a href="#" class="dtpicker-prev-year">&lArr;</a>'
			+ '<a href="#" class="dtpicker-prev-month">&uArr;</a>'
			+ '<label>'+ tmp.format('Y - m')+'</label>'
			+ '<a href="#" class="dtpicker-next-month">&dArr;</a>'
			+ '<a href="#" class="dtpicker-next-year">&rArr; </a>')
			.find('a[class*="-prev-year"]').dtpicker_dis(new Date(this.current).getFullYear() <= new Date(range[0]).getFullYear()).end()
			.find('a[class*="-prev-month"]').dtpicker_dis(new Date(this.current).format('Ym') <= new Date(range[0]).format('Ym')).end()
			.find('a[class*="-next-year"]').dtpicker_dis(new Date(this.current).getFullYear() >= new Date(range[1]).getFullYear()).end()
			.find('a[class*="-next-month"]').dtpicker_dis(new Date(this.current).format('Ym') >= new Date(range[1]).format('Ym'));
		for (i=0;i<7;i++) h.push('<li><span>'+this.weeks[i]+'</span></li>');
		$('<ul class="dtpicker-week" />').append(h.join("\n")).appendTo($('.dtpicker-body', boxes));
		h = [];
		for (i=0;i<fw;i++) h.push('<li><span>&nbsp;</span></li>');
		for (i=1;i<=days;i++){
			tmp = new Date(tmp.setDate(i));
			h.push('<li><a href="#" data-dateval="'+tmp.format(this.options.format[0])+'" rel="'+tmp.format('Ymd')+'">'+i+'</a></li>');
		}
		$('<ul class="dtpicker-days dtpicker-ym'+tmp.format('Ym')+'" />').append(h.join("\n")).appendTo($('.dtpicker-body', boxes))
			.find('a[rel="'+new Date(range[0]).format('Ymd')+'"]').parent().prevAll().find('a').dtpicker_dis(true).end().end().end().end()
			.find('a[rel="'+new Date(range[1]).format('Ymd')+'"]').parent().nextAll().find('a').dtpicker_dis(true);
	},
	finish: function(){
		this.wrap.show();
		$('a[rel='+this.today.format('Ymd')+']', this.wrap).parent().addClass('today');
		$('a[rel='+new Date(this.now).format('Ymd')+']', this.wrap).parent().addClass('current');
		//$('.dtpicker-prev-year', this.wrap)
		$(document).one('click.datepicker-hide',
		function(e){
			$('.dtpicker').hide();
		});
	},
	trigger: function(fn){
		if ('string' === $.type(fn)){
			if ($.isFunction(this[fn])){
				this[fn]();
			}else{
				fn = 'on' + fn;
				if (!this.options[fn] || !$.isFunction(this.options[fn])) return this;
				this.options[fn].call(this);
			}
		}else if ($.isFunction(fn)) fn();
		return this;
	},
	change: function(ac, cur){
		cur = cur || new Date();
		if (-1 < ac.lastIndexOf('prev-month')){
			this.current = cur.setMonth(cur.getMonth()-this.options.calendars);
			if (this.current < this.options.range[0]) this.current = this.options.range[0];
		}else if(-1 < ac.lastIndexOf('next-month')){
			this.current = cur.setMonth(cur.getMonth()+this.options.calendars);
			if (this.current > this.options.range[1]) this.current = this.options.range[1];
		}else if(-1 < ac.lastIndexOf('prev-year')){
			this.current = cur.setFullYear(cur.getFullYear()-1);
			if (this.current < this.options.range[0]) this.current = this.options.range[0];
		}else if(-1 < ac.lastIndexOf('next-year')){
			this.current = cur.setFullYear(cur.getFullYear()+1);
			if (this.current > this.options.range[1]) this.current = this.options.range[1];
		}
		this.make();
	},
	setdate: function(el){
		var time = '';
		if (this.options.hastime){
			time = $('input', this.wrap).val();
			if (time == '' || time.search(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/i)==-1) return alert('请输入正确的时间格式');
			time = ' '+time;
		}
		$(this.ele).val($(el).data('dateval') + time);
		$(document).trigger('click.datepicker-hide');
		this.trigger('Selected');
	}
};
$.dtpicker = function(ele, options){
	var ob = $(ele).data('dtpicker-object');
	if (!ob){
		ob = new dtpicker(ele, options);
		$(ele).data('dtpicker-object', ob);
	}
	return ob;
};
$.fn.dtpicker_dis = function(d){
	if (!d) return this;
	return this.each(function(){
		$(this).replaceWith('<span class="'+$(this).attr('class')+' dtpicker-disabled">'+$(this).text()+'</span>');
	});
};
$.fn.dtpicker = function(option){
	option = option || {};
	$(document).trigger('click.datepicker-hide');
	return this.each(function(){
		option = $.extend({}, $(this).data() || {}, option || {});
		$.dtpicker(this, option).show();
	});
};
if (!$.doane){
	$.doane = function(event) {
		if (event) {
			event.stopPropagation();
			event.preventDefault()
		} else {
			window.event.returnValue = false;
			window.event.cancelBubble = true
		}
	};
	$.stopbubble = function(e){
		if (e && e.stopPropagation) {//非IE浏览器 
			e.stopPropagation(); 
		}else {//IE浏览器 
			window.event.cancelBubble = true; 
		} 
	};
}
$(document).on('click.datepicker-api',
	'[data-toggle=datepicker], [class*=req-date]',
	function(e){
		jQuery.doane(e);
		$(this).dtpicker();
	}).on('click.change-mode',
	'.dtpicker-prev-month,.dtpicker-next-month,.dtpicker-prev-year,.dtpicker-next-year',
	function(e){
		if ($(this).hasClass('dtpicker-disabled')) return false;
		var id=$(this).closest('.dtpicker').attr('id').substr(4)
			, box = $(this).closest('.dtpicker-calendars')
			, ym=box.data('dtpicker-curdate').split('-')
			, d = new Date();
		d.setFullYear(ym[0]);
		d.setMonth(parseInt(ym[1],10)-1-parseInt(box.data('dtpicker-index'),10));
		$.dtpicker('#'+id).change($(this).attr('class'), new Date(d));
		return false;
	}).delegate('.dtpicker', 'click.dtpicker-keep', function(e){
		return false;
	}).on('click.dtpicker-setdate', 'ul.dtpicker-days a',
	function(e){
		if ($(this).hasClass('dtpicker-disabled')) return false;
		$.dtpicker('#'+$(this).closest('.dtpicker').attr('id').substr(4)).setdate(this);
		return false;
	});
})(jQuery);
