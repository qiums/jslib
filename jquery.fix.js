String.prototype.csubstr=function(len,pix){if(!this||!len)return'';var a=0,i,temp='';pix=pix||'';for(i=0;i<this.length;i++){if(this.charCodeAt(i)>255){a+=2}else{a++}if(a>len)return temp+pix;temp+=this.charAt(i)}return this};String.prototype.str_length=function(){return this.replace(/[^\x00-\xff]/g,'##').length};if('undefined'==typeof Number.prototype.toFixed){Number.prototype.toFixed=function(dot){with(Math){var m=pow(10,Number(dot));var s=(round(this*m)/m).toString()}if(s.indexOf('.')<0)s+=".";s+="00000000000000000000000000";return s.substr(0,s.indexOf('.')+dot+1)}};
(function($){jQuery.imgReady=(function(){var list=[],intervalId=null,tick=function(){var i=0;for(;i<list.length;i++){list[i].end?list.splice(i--,1):list[i]()};!list.length&&stop()},stop=function(){clearInterval(intervalId);intervalId=null};return function(url,ready,load,error){var onready,width,height,newWidth,newHeight,img=new Image();img.src=url;if(img.complete){ready.call(img);load&&load.call(img);return};width=img.width;height=img.height;img.onerror=function(){error&&error.call(img);onready.end=true;img=img.onload=img.onerror=null};onready=function(){newWidth=img.width;newHeight=img.height;if(newWidth!==width||newHeight!==height||newWidth*newHeight>1024){ready.call(img);onready.end=true}};onready();img.onload=function(){!onready.end&&onready();load&&load.call(img);img=img.onload=img.onerror=null};if(!onready.end){list.push(onready);if(intervalId===null)intervalId=setInterval(tick,40)}}})();
jQuery.extend(jQuery.fn, {
	swapClass: function(c1, c2) {
		return this.each(function() {
			var me = $(this);
			if (!c1 && !me.hasClass(c2) || !c2 && !me.hasClass(c1)) return me.addClass(c1 || c2);
			if (c1 && me.hasClass(c1)){
				me.removeClass(c1);
				if (c2) me.addClass(c2);
			}else if (c2 && me.hasClass(c2)){
				me.removeClass(c2);
				if (c1) me.addClass(c1);
			}
		})

	},
	replaceClass: function(c1, c2) {
		return this.each(function() {
			var $this = $(this);
			if ($this.hasClass(c1)) $this.removeClass(c1).addClass(c2);
		})

	},
	check: function(selector, fn){
		$(this).bind('click.trigger-check',
		function(){
			check($(this).is(':checked')?'on':'off');
			//trigger(this);
		});
		$(document).on('click.trigger-check', selector,
		function(){
			trigger(this);
		});

		function trigger(ele){
			if (!$.isFunction(fn)) return ;
			fn.call(ele, $(selector).filter(':checked').length);
		};
		function check(mode){
			$(selector).each(function(){
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
				};trigger(this);
			});
		}
	},
	/*check: function(mode, fn) {
		var mode = mode || 'on', len=$($(this).selector).length;
		
		this.each(function() {
			if ('function' == typeof fn) fn(this, mode);
		})

	},*/
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
	}
});
jQuery.extend({
	lang: function(key, d){
		if ('object' === $.type(key)) return jQuery.extend(this.lang.data, key);
		if (!this.lang.data) return key;
		if ('undefined'!==typeof this.lang.data[key]) return this.lang.data[key];
		if ('undefined'!==typeof this.lang.data[key.toLowerCase()]) return this.lang.data[key.toLowerCase()];
		if (d) return d;
		return key;
	},
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
			//obload: $.dialog({type:'load'}),
			type: 'post',
			success: function(res){
				if(!res) return ;
				if (this.dataType=='json'&&res.code===0) return $.dialog(callback.error,{timeout:3,buttons:{'Close':'close'}});
				if ($.isFunction(suc)) suc.apply(this, [res]);
			}
		});
		return false;
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
jQuery.extend(jQuery.lang, {data: {}});
jQuery.datacache = jQuery.extend({data:{}, link:[]}, jQuery.datacache || {});

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
		if (this.type === 'POST'){
			if ($.G && $.G.token) this.data += '&token=' + $.G.token;
		}
	},
	error: function(xhr, text, err) {
		if ('timeout' === text) {
			err = '<div><b>' + ($.lang('ajax-timeout-tips') || 'Time out, please try again.') + '</b></div><p> - '+ this.url + '</p>';
			if ('undefined' === typeof $.dialog) return alert(err);
			$.dialog(err, {id: 'plupload-error', title: $.lang('Ajax load timeout')});
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
})(jQuery);
/* 
 *    jquery.rate 1.0 - 2009-09-29 
 * 
 *    All the stuff written by pwwang (pwwang.com)     
 *    Feel free to do whatever you want with this file 
 * 
 */ 
(function($) { 
    $.rate = function(wraper, options) { 
        var $wraper = $(wraper); 
        var $rateUnits = []; 
        for(var i=0; i<options.rateMax; i++){     
            $rateUnits[i] =  $(document.createElement("a")).attr("href","javascript:;").addClass(options.rateClass);                         
            if( i<options.rated ) $rateUnits[i].addClass(options.ratedClass); 
            $wraper.append($rateUnits[i]); 
        } 
        $.each($rateUnits, function(){                          
            $(this).hover(                           
                function(){ $(this).prevAll().add($(this)).addClass(options.rateOverClass) },                 
                function(){ $(this).prevAll().add($(this)).removeClass(options.rateOverClass) }     
			);             
			$(this).on('click', {ob:$wraper}, function(e){
				var index = e.data.ob.children().index($(this));
				$(this).prevAll().add($(this)).addClass(options.ratedClass); 
				$(this).nextAll().removeClass(options.ratedClass);
				if (options.callback) options.callback.call(this, index, options, $wraper);
			});
		});
    }     
    $.fn.rate = function(options) {
		options = jQuery.extend({}, {
			rated:3, rateMax:5, rateClass:'star', rateOverClass:'star_on', ratedClass:'star_yes',
			rateAfterEvent: function(){}, ratePage: null
			}, options || {});
		if (!options.callback){
			options.callback = function(i, op, el){
				if (!op.ratePage) return false;
                $.get(op.ratePage, { rate:i+1 }, function(data){ (op.rateAfterEvent)(data);    });     
				return false; 
			}
		}
		return this.each(function(){
			$.rate(this, options); 
		});
    };     
})(jQuery);
$(function(){
	$(document).delegate('.pagenum:input', 'keyup.change-page',
	function(e){
		if (e && e.keyCode===13){
			var val=$(this).val(), url=$(this).data('pageuri').replace(/page(\=|\/)\d+/ig, 'page$1'+ val);
			if (val.search(/^\d+$/ig)===-1) return false;
			if (parseInt($(this).closest('li').siblings('.end').find('a[rel]').attr('rel'),10)<parseInt(val,10)) return false;
			return $('<form method="get" />').attr('action', url).appendTo('body').trigger('submit');
		}
	});
});
//$.include([$.G.pubdir+'scripts/jquery.dialog.min.js',$.G.pubdir+'scripts/jquery.form.min.js']);
