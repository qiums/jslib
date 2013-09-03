(function($){
var dialog = function(ele, options){
	options = $.extend({id: 'default'}, options || {});
	if (options.ele){
		ele = options.ele;
		delete options.ele;
	}
	if ('string' !== $.type(ele)){
		this.ele = ele;
		if (!options.id && $(this.ele).attr('id')) options.id = $(this.ele).attr('id');//$(this.ele).attr('id', options.id);
		$(this.ele).data('options', $.extend({}, this.defaults, options || {}));
	}else{
		options.message = ele;
		this.show($.extend({}, this.defaults, options || {}));
	}
};
dialog.prototype = {
	constructor: $.dialog,
	timer: null, options: {},
	defaults: {backdrop:true, zi:1001, reload:0, opacity:.6},
	getopt: function(){
		if (this.ele) return $(this.ele).data('options');
		if (this.boxes) return this.boxes.data('options');
		return this.options;
	},
	show: function(opt){
		this.options = opt || this.getopt();
		this.isshow = true;
		this.backdrop('draw');
	},
	follow: function(opt){
		this.popover(opt, 'follow');
	},
	popover: function(opt, mode){
		if (!this.ele) return ;
		this.options = opt || this.getopt();
		var title = this.options.title
			, message = this.options.message
			, pos = this.options.position
			, id = this.options.id || $(this.ele).attr('id');
		if (!id){
			id = 'element-popover-' + new Date();
			$(this.ele).attr('id', id);
		}
		this.boxes = $('#popover-' + id);
		this.backdrop = false;
		$('.ui-popover').css('top', -1000);
		if (!pos) pos = 'bottom'; // top,bottom,left,right
		if (!this.boxes.length){
			if (!message){
				message = title;
				title = null;
			}
			if (!message && !this.options.target) return ;
			this.boxes = $('<div class="ui-popover ui-popover-' + pos + '" id="popover-'+ id + '" />');
			this.options.float==='abs' ? this.boxes.prependTo('body') : this.boxes.insertAfter(this.ele);
			if (title){
				var header = $('<h3 class="ui-popover-title" />').append(title).appendTo(this.boxes);
				if ('follow'===mode){
					$('<button type="button" class="close" data-dismiss="dialog">&times;</button>').appendTo(header)
						.on('click.hide.popover', {ob: this.boxes}, function(e){
							e.data.ob.css('top', '-1000px');
							return false;
						});
				}
			}
			$('<div class="arrow" />').appendTo(this.boxes);
			var container = $('<div class="ui-popover-content" />').appendTo(this.boxes);
			if (this.options.target){
				$(this.options.target).appendTo(container);
			}else{
				container.append(message);
			}
			//this.boxes.append('<div class="ui-popover-content">'+message+'</div>');
			if (this.options.addclass) container.addClass(this.options.addclass);
			if (this.options.width) container.css('width', this.options.width).css('max-width',this.options.width);
			this.boxes.on('click.hide-boxes', function(e){
				//if ($(e.target).is('a')) return true;
				$.doane(e);
			});
		}
		//if (parseInt(this.boxes.css('top'),10)>0) return ;
		var oldrender = this.options.onRender
		, render = function(){
			if ($.isFunction(oldrender)) oldrender.call(this);
			var w = this.boxes.outerWidth(),
				h = this.boxes.outerHeight(),
				ew = $(this.ele).outerWidth(),
				eh = $(this.ele).outerHeight(),
				css = $(this.ele)[this.options.float==='abs' ? 'offset' : 'position']();
			if ('top' === pos){
				css.left = parseInt((css.left+ew/2) - w/2, 10);
				css.top = css.top - h;
			}else if ('bottom' === pos){
				css.left = parseInt((css.left+ew/2) - w/2, 10);
				css.top = css.top + eh;
			}else if ('left' === pos){
				css.left -= w;
				css.top = parseInt((css.top+eh/2) - h/2, 10);
			}else if ('right' === pos){
				css.left += ew;
				css.top = parseInt((css.top+eh/2) - h/2, 10);
			}
			this.boxes.css(css);
		};
		this.options.onRender = render;
		this.trigger('Render');
		if ('follow' === mode) return ;
		$(document).off('click.hide-popover scroll.hide-popover');
		setTimeout(function(){
			$(document).one('click.hide-popover scroll.hide-popover',
			function(e){
				//$(this).unbind('click.hide-popover scroll.hide-popover');
				$('.ui-popover').css('top', -1000);
			});
		}, 500);
	},
	draw: function(){
		var id = this.options.id
			, title = this.options.title
			, zi = [];
		this.boxes = $('#ui-dialog-' + id);
		if (this.ele){
			if (this.ele && $(this.ele).closest('.ui-dialog').length>0){
				zi = parseInt($(this.ele).closest('.ui-dialog').css('z-index'));
				this.$backdrop.css('z-index', zi+1);
				this.options.zi = zi+2;
			}
		}else{
			$('.ui-dialog').each(function(){
				if (parseInt($(this).css('top'),10)>0) zi.push($(this).css('z-index'));
			});
			if (zi.length>0){
				zi = Math.max.call(window, zi);
				this.$backdrop.css('z-index', zi+1);
				this.options.zi = zi+2;
			}
		}
		if (!this.boxes.length){
			this.boxes = $('<div class="ui-dialog" id="ui-dialog-' + id + '" />')
				.css('z-index', this.options.zi)
				.appendTo('body');
			if (this.options.addclass) this.boxes.addClass(this.options.addclass);
			if (title){
				var header = $('<div class="ui-header" />').appendTo(this.boxes), ht;
				$('<button type="button" class="close" data-dismiss="dialog">&times;</button>').appendTo(header);
				ht = $('<h3 />').appendTo(header).html(title);
				this.drag(ht);
			}
			this.dbody = $('<div class="ui-body"></div>').appendTo(this.boxes);
			if (this.options.buttons || this.options.timeout || this.options.tip){
				var foot = $('<div class="ui-footer"></div>').appendTo(this.boxes);
				if (this.options.tip || this.options.timeout){
					var left = $('<div class="ui-footer-left" />').appendTo(foot);
					if (this.options.tip){
						var ftip = $('<span class="ui-footer-tip" />').appendTo(left);
						if ('string'===$.type(this.options.tip)){
							ftip.append(this.options.tip);
						}else if (this.options.tip instanceof jQuery){
							this.options.tip.appendTo(ftip).trigger('ui-tip-callback');
						}
					}
					if (this.options.timeout)
						$('<span class="ui-footer-timeout" />').append('<strong>' + this.options.timeout + '</strong> 秒后关闭').appendTo(left);
				}
			}
			this.boxes
				.delegate('[data-dismiss="dialog"]', 'click.dismiss-dialog', $.proxy(this.hide, this));
			this.buttons();
			this.content();
		}else{
			if (title) $('.ui-header > h3', this.header).html(title);
			this.dbody = $('.ui-body', this.boxes);
			this.content();
		}
	},
	drag: function(head){
		var drag, b = this.boxes;
		head.unbind('mouseover.move-dialog')
		.bind('mouseover.move-dialog', function(){
			$(this).css('cursor', 'move');
		}).unbind('mousedown.move-dialog')
		.bind('mousedown.move-dialog', function(e){
			e = window.event?window.event:e;
			drag = true;
			var moveX = e.clientX - b[0].offsetLeft,
				moveY = e.clientY - b[0].offsetTop;
			$(document).mousemove(function(e){
				if (!drag) return ;
				e = window.event?window.event:e;
				window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
				var left = e.clientX - moveX,
					top = e.clientY - moveY,
					bw = $(document.body).innerWidth();
				if (left < 0) left = 0;
				if (left + b.width() >= bw) left = bw - b.width();
				if (top < 0) top = 0;
				b.css({left: left, top : top});
			}).mouseup(function(){
				drag = false;
			});
		});
	},
	backdrop: function(callback){
		if (this.isshow && this.options.backdrop){
			this.$backdrop = $('.ui-backdrop');
			if (!this.$backdrop.length){
				this.$backdrop = $('<div class="ui-backdrop" />').appendTo('body');
				//this.$backdrop.bind('click.hide-dialog', $.proxy(this.hide, this));
			}
			//this.$backdrop.fadeIn(callback);
			this.$backdrop.show();
			this.trigger(callback);
		}else if (!this.isshow && this.options.backdrop){
			//this.$backdrop.fadeOut(callback);
			this.$backdrop.hide();
			this.trigger(callback);
		}else{
			this.trigger(callback);
		}
	},
	content: function(){
		var me = this, b = this.dbody;
		if (b.is(':empty') || this.options.reload){
			if (this.options.message){
				if (!this.options.appdata) b.empty();
				if (this.options.message instanceof jQuery){
					this.options.message.appendTo(b);
				}else{
					b.append(this.options.message);
				}
			}else{
				var target = this.options.target, href;
				if (this.ele){
					href = $(this.ele).attr('href');
					if (!target && -1 !== href.lastIndexOf('#')){
						target = href.substr(href.lastIndexOf('#'));
					}
				}
				if ($(target).length){
					$(target).appendTo(b);
				}else{
					if (this.options.type === 'frame') return this.frame();
					if (href && '#'!==href && 'javascript:;'!==href){
						//b.height(200);
						this.position();
						return b.addClass('loading')
							.load(href, {'ajax':'html'}, function(){
								b.removeClass('loading');
								me.position();
								me.render();
							});
					}
				}
			}
		}
		this.position();
		this.render();
	},
	buttons: function(){
		var k, foot = $('.ui-footer', this.boxes);
		if (!this.options.buttons) return this.position();
		for (k in this.options.buttons){
			fn = this.options.buttons[k];
			k = k.split('.');
			if ('string' === $.type(fn)){
				if ('close' === fn){
					fn = this.hide;
				}else if ('reload' === fn){
					fn = function(){ window.location.reload(); };
				}else{
					$('<a class="btn" href="' + fn + '">' + this.lang(k[0]) + '</a>').appendTo(foot);
					continue;
				}
			}else if (!$.isFunction(fn)){
				fn = function(){};
			}
			$('<button class="btn' + ('undefined'===typeof k[1] ? '' : ' '+k[1]) + '">' + this.lang(k[0]) + '</button>')
				.bind('click.trigger-fun', $.proxy(fn, this)).appendTo(foot);
		}
	},
	position: function(){
		var w = this.options.width, h = this.boxes.outerHeight(), css = {}
			,top = this.options.top ? parseInt(this.options.top, 10) : parseInt($(window).height()-h)/2;
		if (w){
			this.boxes.css('width', w);
		}else{
			w = this.boxes.outerWidth();
		}
		css.left = parseInt($(document.body).innerWidth()-w)/2;
		css.top = top>0 ? top : 0;
		this.boxes.css(css);
	},
	render: function(){
		if (this.options.timeout){
			var me = this, timer = this.options.timeout;
			this.timer = setInterval(function(){
				timer--;
				var t = $('.ui-footer-timeout>strong', me.boxes)
					, b = $('.ui-footer .btn:first', me.boxes);
				if (0 < timer) return t.text(timer);
				t.text('0');
				if (b.length>0) return b.trigger('click');
				return me.hide();
			}, 1000);
		}
		if (this.options.buttons){
			try{
				$('.ui-footer .btn:first', this.boxes).get(0).focus();
			}catch(e){};
		}
		/*this.boxes.fadeIn('fast', function(){
			me.trigger('Success');;
		});*/
		this.boxes.show();
		this.trigger('Render');
	},
	hide: function(){
		var me = this, has = false;
		this.isshow = false;
		if (this.timer) clearInterval(this.timer);
		/*this.boxes.fadeOut('fast', function(){
			if ($('.ui-dialog:visible').length>0){
				var zi = parseInt(me.$backdrop.css('z-index'), 10);
				me.$backdrop.css('z-index', zi-2);
				me.trigger('Close');
				return ;
			}
			me.backdrop(function(){
				me.trigger('Close');
			});
		});*/
		this.boxes.css('top', '-1000px');
		me.trigger('Close');
		$(this.boxes).siblings('.ui-dialog')
		.each(function(){
			if (parseInt($(this).css('top'), 10)>0){
				has = true;
				return false;
			}
		});
		if (has){
			var zi = parseInt(me.$backdrop.css('z-index'), 10);
			return me.$backdrop.css('z-index', zi-2);
		}
		me.backdrop('Close');
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
	lang: function(k){
		if (!$.lang) return k;
		return $.lang(k);
	}
};
$.dialog = function(ele, options){
	if ('undefined'===typeof options && 'object'===$.type(ele)){
		options = ele;
		ele = '';
	}
	return new dialog(ele, options);
};
$.fn.dialog = function(option){
	option = option || {};
	if ('string' === $.type(option)){
		option = {type: option};
	};
	var type = option.type ? option.type : 'show';
	delete option.type;
	return this.each(function(){
		option = $.extend({}, $(this).data() || {}, option || {});
		if ('popover' === type){
			option = $.extend({message: $(this).attr('title'), title: $(this).text()}, option || {});
		}
		$.dialog(this, $.extend({title: $(this).attr('title') || $(this).attr('alt')}, option)).trigger(type);
	});
};
$.dropmenu = {
	render: function(){
		var pos = $('.ui-popover-content ul.pos', this.boxes), data=$.datacache[this.options.url];
		if (!pos.length){
			var k, cid, po=[this.options.message];
			delete this.options.message;
			for (k in this.options.node){
				cid = this.options.node[k];
				if ('undefined'===typeof data[cid]) continue;
				po.push('<li><a href="#" rel="'+cid+'">'+data[cid][this.options.datakey]+'</a></li>');
			}
			pos = $('<ul class="tab-union clearfix pos" />').append(po.join("\n")).appendTo($('.ui-popover-content', this.boxes));
			pos.delegate('a', 'click', {ob:this}, $.dropmenu.subdata);
		}
		pos.find('li:last-child').addClass('active').find('a').trigger('click');
	},
	subdata: function(e){
		var id=$(this).attr('rel'), op=e.data.ob.options, ex=$('#union-'+op.cachekey+id), data=$.datacache[op.url];
		if (!ex.length){
			ex=$('<div class="union-content" />').attr('id','union-'+op.cachekey+id).insertAfter($(this).closest('ul'));
			var k, po=['<a href="#0"><b>All</b></a>'];
			for (k in data){
				if (data[k]['pid']==id) po.push('<a href="#" rel="'+data[k]['id']+'" title="'+data[k][op.datakey]+'">'+data[k][op.datakey]+'</a>');
			}
			ex.append(po.join("\n"));
			$('a', ex).on('click', {res:data, el:e.data.ob.ele}, $.dropmenu.change);
		}
		$(this).parent().siblings('li').removeClass('active').end().addClass('active');
		ex.siblings('.union-content:visible').hide().end().show();
		return false;
	},
	change: function(e){
		var id=$(this).attr('rel'), pos=$(this).closest('div').siblings('ul'), li=$('<li />');
		pos.find('li.active').nextAll().remove();
		$(this).siblings('.active').removeClass('active').end().addClass('active');
		if (id>0 && parseInt(e.data.res[id]['childs'],10)>0){
			$(this).clone().appendTo(li);li.appendTo(pos);
			pos.find('li').removeClass('active').filter(':last-child').addClass('active').find('a').trigger('click');
		}else if (e.data.el){
			li = id>0 ? $(this) : pos.find('li:last-child > a');
			$(e.data.el).text(li.text()).prev().val(li.attr('rel')>0 ? li.attr('rel') : '');
			$('.ui-popover').css('top', -1000);
		}
		return false;
	}
};
$.fn.dropmenu = function(op, g){
	op = jQuery.extend({}, {message: '<li><a href="#" rel="0">All</a></li>'}, op || {});
	return this.each(function(){
		var handle = $(this).next('.dropmenu-handle')
			,target = 'dropmenu-'+$(this).attr('name');
		op = jQuery.extend({}, $(this).data('options') || {});
		op.datakey = $(this).data('kname');
		op.cachekey = $(this).attr('name').replace(/[\[\]]/, '');
		if (!handle.length){
			handle = $('<a href="javascript:;" class="dropmenu-handle" />')
				.data('target', target).text($(this).data('label')).insertAfter(this);
		}
		handle.attr('title', $(this).data('label') || $(this).data('alt'));
		if (!$('#'+target).length) $('<div id="'+target+'" />').appendTo('body');
		if ($(this).val()!=='' || 'init'===g){
			dropmenu.call(this, 'init');
			if ('init'===g) return true;
		}else{
			if ('go' === g) return handle.trigger('click.dropmenu');
		}
		$(this).data('options', op);
		handle.on('click.dropmenu', {handle: handle}, $.proxy(dropmenu, this));
	});
	function dropmenu(e){
		var me=this, data=$.datacache[op.url];
		if (op.url && undefined===data){
			return $.post(op.url, op.data||{}, function(res){
				$.datacache[op.url] = res.body;
				$(me).dropmenu(op, 'go');
			});
		}
		if ('init' === e){
			for (k in data){
				if (data[k]['id'] === $(this).val()){
					$(this).next().text(data[k][op.datakey]).data('node', data[k]['node']);
					if ($.isFunction(op.onRender)){
						op.onRender.call(this);
						delete op.onRender;
					}
					break;
				}
			}
			return ;
		}
		//delete op.url;
		delete op.data;
		e.data.handle.dialog(jQuery.extend({},
			{type: 'follow', message:'adfd', width:500,	onRender: $.dropmenu.render},
			op || {})
		);
	};
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
		if (e && e.stopPropagation) {//非IE浏览�?
			e.stopPropagation(); 
		}else {//IE浏览�?
			window.event.cancelBubble = true; 
		} 
	};
}
$(document).on('click.dialog-api',
	'[data-toggle=dialog]',
	function(e){
		jQuery.doane(e);
		$(this).dialog();
	})
	.on('mover.dialog-tip',
	'[data-toggle=tip]',
	function(e){
		$(this).dialog('tip');
	})
	.on('click.dialog-popover',
	'[data-toggle=popover]',
	function(e){
		jQuery.doane(e);
		$(this).dialog('popover');
	});
})(jQuery);
