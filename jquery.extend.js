String.prototype.csubstr = function(len, pix) {
	if (!this || !len) return '';
	var a = 0,
	i,
	temp = '';
	pix = pix || '';
	for (i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 255) {
			a += 2;
		} else {
			a++;

		}
		if (a > len) return temp + pix;
		temp += this.charAt(i);

	}
	return this;

};
String.prototype.str_length = function() {
	return this.replace(/[^\x00-\xff]/g, '##').length
};
String.prototype.addZero = function(len) {
	var str = String(this);
	len = len || 2;
	if (str.length >= len) return str;
	for (var i = 0; i < len - str.length; i++) {
		str = ('0' + String(str))

	}
	return str;
};

if ('undefined' == typeof Number.prototype.toFixed) {
	Number.prototype.toFixed = function(dot) {
		with(Math) {
			var m = pow(10, Number(dot));
			var s = (round(this * m) / m).toString()

		}
		if (s.indexOf('.') < 0) s += ".";
		s += "00000000000000000000000000";
		return s.substr(0, s.indexOf('.') + dot + 1)

	}

};
jQuery.imgReady = (function() {
    var list = [], intervalId = null,
    // 用来执行队列
	tick = function() {
	    var i = 0;
	    for (; i < list.length; i++) {
	        list[i].end ? list.splice(i--, 1) : list[i]();
	    };
	    !list.length && stop();
	},
    // 停止所有定时器队列
	stop = function() {
	    clearInterval(intervalId);
	    intervalId = null;
	};
    return function(url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
		img = new Image();
        img.src = url;
        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        };
        width = img.width;
        height = img.height;
        // 加载错误后的事件
        img.onerror = function() {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };
        // 图片尺寸就绪
        onready = function(){
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024){
                ready.call(img);
                onready.end = true;
            };
        };
        onready();
        // 完全加载完毕的事件
        img.onload = function() {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();
            load && load.call(img);
            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };
        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();
jQuery.extend(jQuery.fn, {
	swapClass: function(c1, c2) {
		return this.each(function() {
			var $this = $(this);
			if ($this.hasClass(c1)) $this.removeClass(c1).addClass(c2);
			else if ($this.hasClass(c2)) $this.removeClass(c2).addClass(c1)
		})

	},
	replaceClass: function(c1, c2) {
		return this.each(function() {
			var $this = $(this);
			if ($this.hasClass(c1)) $this.removeClass(c1).addClass(c2);
		})

	},
	check: function(mode, fn) {
		var mode = mode || 'on';
		return this.each(function() {
			switch (mode) {
				case 'on':
				this.checked = true;
				break;
				case 'off':
				this.checked = false;
				break;
				case 'toggle':
				this.checked = !this.checked;
				break

			}
			if ('function' == typeof fn) fn(this, mode)

		})

	},
	placeholder: function() {
		if ("placeholder" in document.createElement("input")) return;
		return this.each(function(){
			placeholder = $(this).attr('placeholder');
			if (!placeholder || $(this).is(':hidden')) return true;
			var a,b,c,id = this.id,
			label, timer, self=this;
			if (!id) {
				id = "placeholder-" + new Date().getTime();
				$(this).attr('id', id);

			}
			label=$(this).prev('label.placeholder');
			$(this).parent().css('position','relative');
			if (!label.length){
				a=$(this).position();
				b={top:$(this).parent().css('padding-top'), left:$(this).parent().css('padding-left')};
				c={position: 'absolute',//height:$(this).height(),
					padding: '0 0 0 '+$(this).css('padding-left'),
					overflow:'hidden',color: 'gray', width:$(this).outerWidth(true),
					cursor: 'text',float:'none','font-weight':'normal'
				};
				if(parseInt(a.top,10)>parseInt(b.top,10)){
					if($.browser.msie&&('7,9').indexOf($.browser.version)) c.top=a.top;
					c.left = a.left;
				}
				if($(this).parent().is('.textsplit')) c.top=0;
				label = jQuery('<label>', {
					'for': id, 'class':'placeholder'
				}).html(placeholder)
				.css(c).insertBefore(this);//.prependTo($(this).parent().get(0));
			}else{
				label.css({width:$(this).outerWidth(true),height:$(this).height()});
			}
			$(this).bind('keydown.placeholder',
			function(){
				label.html('');
			}).bind('blur.placeholder',
			function() {
				if (''===this.value) label.html($(this).attr('placeholder'));
			});
		});
	},
	highlight_word: function(word) {
		if (!word) return;
		word = '(' + word.replace(/(\s|\_|\+)+/ig, '|') + ')';
		return $(this).each(function() {
			$(this).html($(this).text().replace(new RegExp(word, 'ig'), '<span class="highlight">$1</span>'))
		})

	},
	loadimg: function(url, w, h, f){
		var self=this;
		if(!h) h=0;
		$.imgReady(url, function(){
			self.attr('src',url).hide();
		}, function(){
			var css={'display':'inline-block'},zoom=Math.min(w/this.width,0==h?10000:h/this.height);
			self.removeAttr('style');
			if (zoom>1){
				//css.marginTop=parseInt((h-this.height)/2);
			}else{
				css.width = this.width*zoom;
				css.height = this.height*zoom;
			}
			self.css(css);
			if($.isFunction(f)) f.call(self[0],$.isEmptyObject(css)?{width:this.width,height:this.height}:css);
		});
		return self;
	},
	loadhtml: function(url, fn, data){
		if('object'==$.type(fn)){
			fn = null,
			data = fn;
		}
		$(this).addClass('loading');
		return $.ajax({type:'get',
			async:false,
			//obload:$.dialog({type:'load'/*,modal:false*/}),
			handle: this,
			data: jQuery.extend({ajaxget:'html'}, data||{}),
			dataType:'html',
			timeout:10000,
			url:url,
			error: function(xhr, str){
				if('timeout'==str) this.async=true;
				$.ajax(this);
			},
			success: function(result){
				/*this.obload.dialog('destroy');
				this.obload = null;*/
				this.handle.removeClass('loading')
					.empty().append(result);
				if($.isFunction(fn)) fn.call(this, result);
			}
		});
	},
	saveForm: function(options){
		var defaults = {form: this}, success;
		options = options || function(json){return true;};
		options = jQuery.extend({}, defaults, $.isFunction(options)?{success: options}:options);
		if (!options.success || undefined==jQuery.fn.ajaxForm) return false;
		if (!options.beforeSubmit){
			options.beforeSubmit = function(a,form,op){
				if (false===$(form).ckForm()) return false;
				if(undefined!=window.dialog) op.obload = $.dialog({type:'load',name:'form-loading'});
				$('button', form).attr('disabled', true);
				return true;
			}
		}
		success = options.success;
		delete options.success;
		options.success = function(data){
			if (this.obload&&null!=this.obload){
				this.obload.dialog('destroy');
				this.obload = null;
				delete this.obload;
			}
			$('button', this.form).attr('disabled', false);
			if(!data || ''==data) return ;
			if($.isFunction(success)) data = success.call(this, data);
			if(!data || ''==data) return ;
			if(data.error){
				if(data.elem) return $(this.form).trigger('form-check-error', [data.elem, data.error]);
				return dialog.error('<p>'+data.error+'</p>', {timeout:2,goto:'close',width:250});
			}
			if(data){
				dialog.ok('<h3>'+(data.ok || data.message || 'Success!')+'</h3>',
				{
					timeout:3,goto:'close',width:300,
					onclose: function(){window.location.reload();}
				});
			}
		};
		return this.ajaxForm(options);
	}
});
jQuery.extend({
	lang: {},
	doane: function(event) {
		if (event) {
			event.stopPropagation();
			event.preventDefault()
		} else {
			window.event.returnValue = false;
			window.event.cancelBubble = true
		}
	},
	stripos: function(haystack, needle, offset) {
		offset = offset || 0;
		var index = haystack.toLowerCase().indexOf(needle.toLowerCase(), offset);
		return (index == -1 ? false: index)
	},
	empty: function(str) {
		if ('string' == (typeof str).toLowerCase()) {
			str = $.trim(str);
			return '' == str
		}
		return 'undefined' == typeof str
	},
	isset: function(key, obj) {
		if ('undefined' == typeof obj) return false;
		return 'undefined' != typeof obj[key]
	},
	cklen: function(val, _min, _max) {
		val = $.trim(val).str_length();
		return val > _min && val < _max
	},
	checklen: function(val, _min, _max) {
		return $.cklen(val, _min, _max)
	},
	setlen: function(val, el) {
		el.text(val.str_length())
	},
	str_repeat: function(input, multiplier) {
		var i,
		str = '';
		for (i = 0;
		i < multiplier;
		i++) {
			str += input
		}
		return str
	},
	to_object: function(input, first, pix) {
		var out = {},
		i,
		v,
		start = 0;
		first = first || null;
		pix = pix || '/';
		if ('string' == (typeof input).toLowerCase() && false !== $.stripos(input, pix)) {
			input = input.split(pix);
			if (null != first) {
				out[first] = input[0];
				start = 1

			}
		}
		if ('array' == typeof input || 'object' == typeof input) {
			for (i = start;
			i < input.length;
			i += 2) {
				v = 'undefined' != typeof input[i + 1] ? input[i + 1] : null;
				if ('false' == v || 'true' == v) v = (v === true);
				out[input[i]] = v
			}
		}
		return out
	},
	join_object: function(obj, pi) {
		if (!obj) return '';
		pi = pi || '-';
		var k,
		str = [];
		for (k in obj) {
			str.push(k + pi + obj[k]);
		}
		return str.join(pi);
	},
	addEvent: function(el, type, fn) {
		if (window.addEventListener) {
			el.addEventListener(type, fn, false)
		} else if (window.attachEvent) {
			var f = function() {
				fn.call(el, window.event)
			};
			el.attachEvent('on' + type, f)
		}
	},
	textlen: function(el, pos) {
		$(el).keyup(function() {
			$.setlen($(this).val(), $(pos))
		}).each(function() {
			$.setlen($(this).val(), $(pos))
		})

	},
	result: function(frame, type) {
		var respone;
		type = type || 'text';
		$.addEvent(frame, 'load',
		function(e) {
			var doc = $(frame).attr('contentWindow').document;
			if (doc.readyState && 'complete' != doc.readyState) return;
			if (doc.body && 'false' == doc.body.innerHTML) return;
			if (doc.XMLDocument) {
				response = doc.XMLDocument
			} else if (doc.body) {
				response = doc.body.innerHTML;
				if (type == 'json') {
					if ($(response).find('pre').size() > 0) response = $(response).find('pre').html();
					if (response) {
						response = window['eval']("(" + response + ")")
					} else {
						response = {}
					}
				} else if (type == 'script') {
					try {
						eval(response)
					} catch(e) {}
					return true
				} else if ('text' == type) {
					response = doc.body.innerText
				}
			} else {
				response = doc
			}
		});
		return response;
	},
	ajaxPost: function(url, data, suc, type) {
		if ('object' != typeof data) return;
		if($('[name=formhash]').length>0) data.formhash = $('[name=formhash]:first').val();
		type = type || 'json';
		$.ajax({
			url: url,
			data: data,
			dataType: type,
			obload: $.dialog({type:'load'}),
			type: 'post',
			success: function(callback){
				if (this.obload&&null!=this.obload){
					this.obload.dialog('destroy');
					this.obload = null;
				}
				if(!callback) return ;
				if (this.dataType=='json'&&callback.error) return dialog.error(callback.error,3);
				if ($.isFunction(suc)) suc.apply(this, [callback])
			}
		});
		return false
	},
	log: function() {
		var msg = '[jquery.log] ' + Array.prototype.join.call(arguments, '');
		if (window.console && window.console.log) {
			window.console.log(msg)
		} else if (window.opera && window.opera.postError) {
			window.opera.postError(msg)
		}
	},
	include: function(file) {
		var files = typeof file == "string" ? [file] : file;
		var name,
		att,
		ext,
		isCSS,
		tag,
		attr,
		link;
		for (var i = 0; i < files.length; i++) {
			name = files[i].replace(/^\s|\s$/g, "");
			if (document.createStyleSheet){
				document.createStyleSheet(name);
				continue;
			}
			att = name.split('.');
			ext = att[att.length - 1].toLowerCase();
			isCSS = ext == "css";
			tag = isCSS ? "link": "script";
			attr = isCSS ? " type='text/css' rel='stylesheet' ": " language='javascript' type='text/javascript' ";
			link = (isCSS ? "href": "src") + "='" + name + "'";
			if ($(tag + "[" + link + "]").length == 0) $("<" + tag + attr + link + "></" + tag + ">").appendTo('head');
		}
	}

});
jQuery.fn.mxTabs = function() {
	var selector=$(this).selector;
	return this.each(function() {
		var self=this, 
		action = $(self).hasClass('mouseover') ? 'mouseover': 'click';
		if ($(self).hasClass('steptabs')) $(self).find('li.active').nextAll('li').addClass('disabled');
		$(self).siblings('[id^=tab]').hide();
		$('a[rel]', self).live(action,
		function() {
			this.blur();
			if ($(this).parent().hasClass('active')) return false;
			return $(this).mxTabs_change(selector);
		}).each(function() {
			if ($(this).parent().hasClass('active')) {
				$(this).mxTabs_change(selector);
			}
		});
	});
};
jQuery.fn.mxTabs_change = function(selector, fn) {
	var parent = $(this).parent(), href=$(this).attr('href'),
	expr='#tab-'+$(this).attr('rel');
	if (!selector) selector = '.tabnav';
	if (parent.hasClass('disabled')) {
		return false;
	}
	parent.closest(selector).siblings('[id^=tab]').hide();
	$(expr).show().trigger('tab-function', [this[0], fn]);
	parent.siblings('.active')
	.removeClass('active')
	.end().addClass('active');
	return false;
};
jQuery.fn.popmenu = function(ob) {
	return this.each(function() {
		$(this).hover(function() {
			if ($('>a', this).hasClass('disabled')) return;
			$('>ul', this).find('li:last').addClass('last').end().fadeIn();
		},
		function() {
			$('>ul', this).hide();
		});
	});
};
jQuery.datacache = jQuery.extend({data:{}, link:[]}, jQuery.datacache || {});
jQuery.fn.mxmenu = function() {
	$(this).each(function(index){
		var href=$(this).attr('href'),config,prev;
		if('javascript:;'==href || href.lastIndexOf('#')!=-1) return true;
		config=$.to_object($(this).attr('rel'));
		prev=$(this).prev('input:hidden');
		if (prev.length>0&&''!=prev.val()) init.call(this, index, config, 'load');
		$(this).unbind(config['bind'] || 'click')
		.bind(config['bind'] || 'click',
		function(){
			if(prev&&prev.hasClass('disabled')) return false;
			init.call(this, index, config);
			return false;

		});
	});
	function init(index, config, ac){
		var self=this,j,href=$(self).attr('href'),key=href.replace(/[^\w]/ig,'-');
		/*if(-1 != (j=$.inArray(href, jQuery.datacache.link))){
			jQuery.datacache.data[index] = jQuery.datacache.data[j];
		}else{
			jQuery.datacache.link[index] = href;
		}*/
		if (undefined==jQuery.datacache.data[key] && 'javascript:;'!=href) {
			return $.ajax({
				type: 'get',
				url: $(self).attr('href'),
				dataType: 'json',
				async: false,
				success: function(json){
					if(''==json || !json) return ;
					jQuery.datacache.data[key] = json;
					init.call(self, index, config, ac);
				}
			});
		}
		if ('load' == ac) {
			var txt = [],
			value = $(self).prev('input:hidden').val();
			if (!value) return;
			value = value.split(',');
			$.each(value,
			function(i, val) {
				if(!jQuery.datacache.data[key] || !jQuery.datacache.data[key][val]) return true;
				txt.push(jQuery.datacache.data[key][val][config['field']]);
			});
			if(txt.length==0) return ;
			return $(self).html(txt.join(' &raquo; ') + '<span><em></em></span>')
			.trigger('load-value', [config,value]);
		}
		var oid = 'mxmenu-' + index + '-container',
		ob = $('#' + oid),
		mpos = $(self).parent().offset();
		$('.mxmenu-container').hide();
		$(self).parent().addClass('mxmenu_active');
		$(document).bind('click.hidemxmenu',
		function() {
			mouseleave();
			$('.mxmenu-container').hide();
			$(document).unbind('click.hidemxmenu');
		});
		if (!ob.length) {
			ob = $('<div>', {
				id: oid,
				'class': 'mxmenu-container'
			});
			if ($(self).next('ul.ful').length > 0) {
				$(self).next('ul.ful').appendTo(ob);
			} else {
				html(0).appendTo(ob);
			}
			ob.appendTo('body');
			position();
		}
		ob.css({
			left: mpos.left,
			top: parseFloat(mpos.top) + $(self).outerHeight(true)
		}).show();
		loadval();

		function position() {
			ob.find('ul').each(function() {
				var len = $(this).find('>li').length,
				li = $(this).find('>li:first'),
				col = Math.ceil(len / 12);
				li.find('>a').addClass('first');
				if (len > 12) {
					$(this).addClass('datacol').width(col * parseInt(li.outerWidth(true), 10))
					.find('>li:gt(0):lt(' + (col - 1) + ')>a').addClass('first');

				}
			}).end().find('li.child').each(function() {
				var ul = $('>ul', this),
				fpos = $(this).parent().find('>li:first').offset(),
				lpos = $(this).offset(),
				upos = ul.position(),
				lh = $(this).outerHeight(true),
				lw = $(this).outerWidth(true),
				uh = ul.outerHeight(true),
				uw = ul.outerWidth(true),
				top = 0,
				left = lw;
				if (parseFloat(lpos.top) - parseFloat(fpos.top) - uh < -2)
				top = parseFloat(fpos.top) - parseFloat(lpos.top);
				if (mpos.left + lpos.left + lw + uw > $(window).width()) {
					left = 0 - uw;
					$(this).addClass('atleft');
				}
				ul.css({
					'top': top,
					'left': left,
					'visibility': 'hidden'
				});

			});
			$('li.child', ob[0]).live('mouseenter',
			function() {
				mouseenter(this);

			}).live('mouseleave',
			function() {
				mouseleave(this);

			});
			$('a', ob[0]).live('click',
			function() {
				if ('javascript:;' != $(this).attr('href')) return true;
				setval(this);
				return false;
			});
		};
		function mouseenter(t, a) {
			$(t).siblings('.child:has(.active)').removeClass('active')
			.find('a').removeClass('active_link')
			.end().find('ul').css('visibility', 'hidden');
			$(t).addClass('active')
			.find('>a').addClass('active_link')
			.end().find('>ul').css('visibility', 'visible');
		};
		function mouseleave(t) {
			ob.find('li.active').removeClass('active')
			.find('>a').removeClass('active_link')
			.end().find('>ul').css('visibility', 'hidden');
		};
		function setval(t) {
			var ids = [],
			txt = [],
			elem = $(self).prev('input:hidden');
			if ($(t).attr('rel') == '0') {
				txt = [$(t).text()];
				ob.find('li.active').removeClass('active')
				.find('>a').removeClass('active_link')
				.end().find('>ul').css('visibility', 'hidden');
			} else {
				$(t).parents('li[id^=mxid]').each(function() {
					txt.unshift($('>a', this).text());
					ids.unshift(this.id.replace('mxid', ''));

				});
			}
			if (!elem.length) elem = $('<input>', {
				type: 'hidden',
				name: config['name']
			}).insertBefore(self);
			elem.val(ids.join(','));
			$(self).html(txt.join(' &raquo; ') + '<span><em></em></span>')
			.trigger('setcallback', [elem.val()]);
			$(document).trigger('click.hidemxmenu');
		};
		function loadval() {
			if (!$(self).prev('input:hidden').length) return;
			var txt = [],
			value = $(self).prev('input:hidden').val();
			if (!value) return;
			value = value.split(',');
			$.each(value,
			function(i, val) {
				mouseenter('li#mxid' + val, 1);
			});
			$(self).trigger('loadcallback',[config,value]);
		};
		function html(id) {
			var data = jQuery.datacache.data[key],
			ul = jQuery('<ul>'),
			li;
			if (0 == id) {
				ul.addClass('ful');
				$('<li>', {
					id: 'mxid0'
				}).append('<a href="javascript:;" rel="0">' + $(self).attr('title') + '</a>').appendTo(ul);
			}
			$.each(data,
			function(k, row) {
				if (row['pid'] != id) return true;
				li = $('<li>', {
					id: 'mxid' + row['id']
				})
				.append('<a href="javascript:;" rel="' + row['id'] + '" title="' + row[config['field']] + '">' + row[config['field']] + '</a>').appendTo(ul);
				if (row['childs'] > 0) {
					$('>a', li).addClass('child_link');
					html(row['id']).appendTo(li.addClass('child'));
				}
			});
			return ul;
		}
	}
};
jQuery.fn.textsplit = function(){
	return this.each(function(){
		init(this);
	});
	function init(self){
		var elem=$('>:input:first',self),ul=$('ul',self),div=$('div',self),input=$(':input', div).css('width','100%'),
		maxlen=$(self).attr('class').match(/maxsplit(\d+)/i),iw, mi;
		maxlen = maxlen ? parseInt(maxlen[1],10) : 5;
		if(!ul.length) ul=jQuery('<ul>',{'class':'textsplit-ulwrap'}).appendTo(self);
		if(!div.length){
			div=jQuery('<div>',{'class':'textsplit-div'}).appendTo(self);
			input = elem.clone(true).removeAttr('name')/*.prop({type:'text'})*/
				.addClass('textsplit-input').val('').appendTo(div)
				.focus(function(){
					$(this).closest('li').addClass('focus');
				}).blur(function(){
					$(this).closest('li').removeClass('focus');
					if($(this).ckField())addtext(this.value);
				}).keydown(function(event){
					if (8==event.which){
						if ($(this).val()==''){
							return removetext($('li:last',ul));
						}
					}
					if (188==event.which){
						if($(this).ckField())addtext(this.value);
						return false;
					}
				});
			input.removeAttr('name');//.attr('type','text');
			mi=input.attr('class');
			if(mi) mi = mi.match(/minlength(\d+)/ig);
			if(mi) input.removeClass(mi[0]);
			elem.hide().removeAttr('id').removeAttr('maxlength');
		};
		$('em',ul[0]).live('click', function(){
			return removetext($(this).parent());
		});
		iw = input.outerWidth(true);
		$('li', ul).remove();
		addtext(elem.val(), 'load');

		function addtext(val, ac){
			if(0==val.length) return ;
			val = val.split(',');
			$.each(val, function(i, value){
				value = $.trim(value);
				if(''==value || ('load'!=ac && (','+elem.val()+',').indexOf(','+value+',')!=-1)) return true;
				$('<li>').append('<span>'+value+'</span><em>x</em>').appendTo(ul);
			});
			val = parseInt(iw-ul.outerWidth(true)-4, 10);
			input.width((ul.height()>25 || val<30)? iw : val).val('');
			if($('li',ul).length>=maxlen) $(input).hide();
			setvalue(ul);
		};
		function removetext(el){
			if(!el.length) return ;
			el.remove();
			if(ul.height()<25){
				input.width(iw-ul.outerWidth(true)-4);
			}
			if($('li',ul).length<maxlen) $(input).show();
			setvalue(ul);
			return false;
		}
		function setvalue(ul){
			var rs = [];
			$('li>span', ul).each(function(){
				rs.push($(this).text());
			});
			elem.val(rs.join(','));
		}
	}
};
$.fn.iscroll = function(k, w, fn){
	var cache=[],iscroll;k=k||'gt',data={};
	if ($.isFunction(w)){
		fn = w;w=null;
	}else if('array'==$.type(w)){
		fn = w[1];
		data = w[0];
		w = null;
	}
	if ('number'==$.type(k)){
		w=k;k='gt';
	}
	this.each(function(){
		cache.push({obj:this, offset:$(this).offset(), position:$(this).css('position'), data:data});
	});
	iscroll = function(){
		var dt=$(window).scrollTop(),dh=$(window).height(),dth=dt+dh,ot;
		$.each(cache, function(i, me){
			if (!me) return true;
			var o=$(me.obj),url=$(o).attr('href');
			ot=me.offset.top;
			if (!url&&'gt'==k) dth-=dh;
			if(('gt'==k && dth>ot) || ('lt'==k && dth<ot)){
				if (url){
					cache[i]=null;
					if (url.search(/(jpg|jpeg|gif|png)$/gi)!=-1) {
						$('<img>').loadimg(url,w).appendTo(o);
						if ($.isFunction(fn)) fn.call(o[0]);
					}else{
						o.parent().loadhtml(url,fn,me.data);
					}
				}else{
					o.css({position:'fixed'});
				}
			}else{
				if (!url) o.css('position',me.position);
			}
		});
	};
	iscroll();
	$(window).bind("scroll", iscroll);
};
$.fn.imgpreview = function(){
	var c='.imgpreview';
	return $(this).each(function(){
		var d,pos,css,src=$(this).attr('rel'),w=600,h=600;
		if(src=='') return true;
		$(this).hover(function(){
			pos=$(this).offset();
			if(!$(c).length){
				css={right:parseInt($(window).width()-pos.left),top:pos.top};
				$('<div>',{'class':c.substr(1)})
					.css(css).prependTo($('body'));
			}
			$('<img>').loadimg(src,w,h,function(t){
				$(c).css('top', Math.max(0,parseInt(pos.top-t.height/2)));
			}).appendTo($(c).empty());
		}, function(){
			//d.dialog('destroy');
			$(c).remove();
		});
	});
};

$.ajaxSetup({
	dataType: 'json',
	timeout: 20000,
	beforeSend: function(xhr) {
		if ('undefined' == typeof this.element) return;
		if (this.elem && $(this.elem).hasClass('show-loading') && 'undefined' != typeof dialog) {
			this.obload = $.dialog({
				type: 'load'
			});

		}
	},
	error: function(xhr, text, err) {
		if ('timeout' == text) {
			var tips = $.lang['ajax-timeout-tips'] || 'Time out, please try again.';
			if ('undefined' == typeof dialog) return alert(tips);
			$.dialog('<p>' + tips + '</p>', {
				type: 'error',
				buttons: {
					'submit.submit': function() {
						return true;
					}

				}
			});
		}
	},
	complete: function(xhr, ts) {
		if (this.obload) this.obload.dialog('destroy');
	}
	/*,
	success: function(data){
		if ('undefined'!=typeof common && 'undefined'!=typeof common.ajax_success) common.ajax_success.apply(this, [data]);
	}*/

});
//$.include([$.G.pubdir+'scripts/jquery.dialog.min.js',$.G.pubdir+'scripts/jquery.form.min.js']);
