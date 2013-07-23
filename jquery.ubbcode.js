jQuery.extend({
	ubb2html: function(str){
		str = UBB.ubb2html(str);
		return str;
	},
	html2ubb: function(str){
		return UBB.html2ubb(str);
	},
	htmlencode: function(text){
		return $.preg_replace(['&','\"','<','>','\'',' ',"\n","\t"], ['&amp;','&quote;','&lt;','&gt;','\'','&nbsp;','<br />','&nbsp;&nbsp;&nbsp;&nbsp;'], text);
	},
	htmldecode: function(text){
		return $.preg_replace(['\t','&lt;','&gt;','&quote;','&nbsp;&nbsp;&nbsp;&nbsp;','&nbsp;','&amp;'], ['','<','>','"','\t',' ','&'], text);
	},
	preg_replace: function(search, replace, str, regswitch) {
		var regswitch = !regswitch ? 'ig' : regswitch;
		var len = search.length;
		for(var i = 0; i < len; i++) {
			re = new RegExp(search[i], regswitch);
			str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
		}
		return str;
	}
});
var UBB = {
	def: function() {
		if (arguments.length == 0) return true;
		if (arguments.length == 1) return (typeof (arguments[0]) != 'undefined');
		for (var i = 0; i < arguments.length; ++i) if (!this.def(arguments[i])) return false;
		return true;
	},
	html2ubb: function(str){
		var tmp = $('<div></div>').html(str),i=0;
		while (tmp.children().length>0){
			if (i>200) break;
			i++;
			tmp.children().each(function(){
				$(this).replaceWith(UBB.parse_htmltag(this));
			});
		}
		//str = this.replace(tmp.html(), this.replacetag['html']);
		str = tmp.html().replace(/<[^>]+>/ig, '');
		str = str.replace(/(\[\/?u\]){2,}/ig, '$1');
		return $.htmldecode(str);
	},
	ubb2html: function(str){
		str = $.htmlencode(str);
		return this.replace(str, this.replacetag['ubb']);
	},
	replace: function(str, ex, ign){
		str = str + '';
		for (var i = 0; i < ex.length; ++i) {
			if ('undefined'==typeof ex[i]) continue;
			if ('undefined'!=typeof ex[i][2]){
				while (str.search(ex[i][0]) != -1) str = str.replace(ex[i][0], (ign ? '' : ex[i][1]));
			}else{
				str = str.replace(ex[i][0], (ign ? '' : ex[i][1]));
			}
		}
		return str;
	},
	parse_htmltag: function(obj){
		var tag = obj.tagName.toLowerCase(),obj=$(obj),style=obj.attr('style'),str=obj.html();
		if (obj.attr('align') && ''!=obj.attr('align')) str='[align='+obj.attr('align')+']'+str+'[/align]';
		if (obj.hasClass('editor-quote')) return '[quote]' + str + '[/quote]';
		if ('img'==tag) return this.resolveimg(obj);
		if ('table'==tag) return this.replacetbl(obj);
		if ('a'==tag){
			var href=obj.attr('href').replace(/\=/g,'&amp;#061;');
			if (href.substr(0,7)=='mailto:'){
				href = href.substr(7);
				str = (href==str) ? '[email]'+str+'[/email]':'[email='+href+']'+str+'[/email]';
			}else{
				str = (href==str) ? '[url]'+str+'[/url]' : '[url='+href+']'+str+'[/url]';
			}
			if ('undefined'==typeof style) return str;
		}else{
			if ('undefined'==typeof style) return this.replace('<'+tag+'>'+str+'</'+tag+'>', this.replacetag['html']);
			if ('underline' == obj.css('text-decoration').toLowerCase()) str = '[u]' + str + '[/u]';
		}
		if (style.search(/page\-break\-after/ig)!=-1) return '[pagebreak][/pagebreak]';
		if (obj.css('font-style').toLowerCase()=='italic') str = '[i]' + str + '[/i]';
		if ('line-through' == obj.css('text-decoration').toLowerCase()) str = '[s]' + str + '[/s]';
		if (style.search(/font\-weight:\s*bold/ig)!=-1) str='[b]'+str+'[/b]';
		if (style.search(/font\-size/ig)!=-1) str = '[size='+obj.css('font-size')+']'+str+'[/size]';
		if (style.search(/background\-color|bgcolor/ig) != -1){
			str = obj.css('background-color') ?
				'[bgcolor=' + this.parse_rgb(obj.css('background-color')) + ']' + str + '[/bgcolor]' :
				((obj.attr('bgcolor') != undefined && obj.attr('color')!='transparent')
					? '[bgcolor=' + this.parse_rgb(obj.attr('bgcolor')) + ']' + str + '[/bgcolor]' : str);
			style = style.replace(/background\-color|bgcolor/ig,'');
		}
		if (style.search(/color/ig) != -1){
			str = (style && false!==$.stripos(style,'color')) ?
				'[color=' + this.parse_rgb(obj.css('color')) + ']' + str + '[/color]' :
				((obj.attr('color') != undefined && obj.attr('color')!='transparent')
					? '[color=' + this.parse_rgb(obj.attr('color')) + ']' + str + '[/color]' : str);
		}
		if (style.search(/align/ig) != -1){
			str = (style && false!==$.stripos(style,'text-align') && 'left'!=obj.css('text-align')) ?
				'[align=' + obj.css('text-align') + ']' + str + '[/align]' :
				((obj.attr('align')!=undefined && obj.attr('align')!='left') ? '[align=' + obj.attr('align') + ']' + str + '[/align]' : str);
		}
		if ('span'==tag || 'a'==tag) return str;
		return this.replace('<'+tag+'>'+str+'</'+tag+'>', this.replacetag['html']);
	},
	replacetbl: function(ob){
		while (ob.children().length>0){
			ob.children().each(function(){
				var me=$(this),style=me.attr('style'),tag=this.tagName.toLowerCase(),str=$.trim(me.html());
				if('table'==tag){
					str = '';
				}else if('td'==tag){
					var cs=me.attr('colspan'),rs=me.attr('rowspan'),s='auto';
					if ((style && style.indexOf('width'))||me.attr('width')) s=me.css('width');
					str = '[td='+(s)+(cs||rs ? (','+cs+','+rs):'')+']'+str+'[/td]';
				}else if('tr'==tag){return true;
					str = '<tr>'+str+'</tr>';
				}
				me.replaceWith(str);//$.log(tag+': '+str+"\r\n"+ob.html());
			});
		}
		var str=ob.html().replace(/<tr[^>]*?>([\s\S]*?)<\/tr>/igm,'[tr]$1[/tr]');
		return '[table='+ob.css('width')+','+ob.css('border-width')+']'+ob.html()+'[/table]';
	},
	replacetag: {
		'ubb' : [
			[/\r\n/ig, '<br />', false],
			[/[\r\n]/ig, '<br />', false],
			//[/\[p\]([\s\S]*?)\[\/p\]/igm, '<p>$1</p>', true],
			[/\[u\]([\s\S]*?)\[\/u\]/igm, '<u>$1</u>', true],
			[/\[b\]([\s\S]*?)\[\/b\]/igm, '<strong>$1</strong>', true],
			[/\[s\]([\s\S]*?)\[\/s\]/igm, '<strike>$1</strike>', true],
			[/\[i\]([\s\S]*?)\[\/i\]/igm, '<em>$1</em>', true],
			[/\[sup\]([\s\S]*?)\[\/sup\]/igm, '<sup>$1</sup>', true],
			[/\[sub\]([\s\S]*?)\[\/sub\]/igm, '<sub>$1</sub>', true],
			[/\[align=(left|center|right)[^\]]*\]([\s\S]*?)\[\/align[^\]]*\]/igm, '<div style="text-align:$1">$2</div>', true],
			//[/\[align=(left|center|right)[^\]]*\]([\s\S]*?)\[\/align[^\]]*\]/igm, function($1){ return UBB.parsealign($1); }, true],
			[/\[ol\]([\s\S]*?)\[\/ol\]/igm, '<ol>$1</ol>', true],
			[/\[ul\]([\s\S]*?)\[\/ul\]/igm, '<ul>$1</ul>', true],
			[/\[li\]([\s\S]*?)\[\/li\]/igm, '<li>$1</li>', true],
			[/\[size=([1-6])\](.[^\[]*)\[\/size\]/gi, '<h$1>$2</h$1>', true], //字体大小
			[/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<div class="editor-quote">$1</div>'], //引用
			[/\[(bgcolor|color)=([^\]]*)\]([\s\S]*?)\[\/\1\]/igm, function($0,$1,$2,$3){ return UBB.parsecolor($1,$2,$3); }, true],
			[/\[url\]\s*(www.|https?:\/\/|ftp:\/\/){1}([^\[\"']+?)\s*\[\/url\]/ig, function($0,$1,$2){ return $.ubbcode.parselink($1 + $2); }, true],
			[/\[url=www.([^\[\"']+?)\](.+?)\[\/url\]/ig, '<a href="http://www.$1" target="_blank">$2</a>', true],
			[/\[url=(https?|ftp):\/\/([^\[\"']+?)\](.*?)\[\/url\]/ig, '<a href="$1://$2" target="_blank">$3</a>', true],
			[/\[img=(\S*?)\]/ig, function($0,$1){ return UBB.parseimg($1); }, true],
			[/\[img[^\]=]*\]([\s\S]*?)\[\/img[^\]]*\]/ig, function($0,$1){ return UBB.parseimg($1); }, true],
			[/\[localimg\]([\s\S]*?)\[\/localimg\]/ig, function($0,$1){ return UBB.parseimg($0,$1,'local'); }, true],
			[/\[emot=(\w+):(\d+)\]/ig, function($0,$1,$2){ return UBB.parseimg($1,$2,'smiley'); }, true]
		],
		'html' : [
			[/(\n|\r)+/ig, '', false],
			[/<(style|head|script|noscript|select|object|embed|marquee)[^>]*>[\s\S]*?<\/\1[^>]*>/igm, '', true],
			[/<!--[\s\S]*?-->/igm, '', true],
			[/on[a-zA-Z]{3,16}\s*?=\s*?(["'])[\s\S]*?\1/igm, '', true],
			[/<hr[^>]*>/ig, '[hr]', true],
			[/<br[^>]*>/ig, '[br]', true],
			[/<br\s+?style=(["']?)clear: both;?(\1)[^\>]*>/ig, '[br]', true],
			//[/<span>([\s\S]*?)<\/span>/igm,"$1",true],
			[/<p>([\s\S]*?)<\/p>/igm, "[p]$1[/p]", true],
			//[/<p>([\s\S]*?)<\/p>/igm, "$1\r\n\r\n", true],
			[/<(strong)[^>]*?>([\s\S]*?)<\/\1[^>]*>/igm, '[b]$2[/b]', true],
			[/<h([0-9]+)[^>]*?>([\s\S]*?)<\/h\1[^>]*>/igm, "[header=$1]$2[/header]\r\n", true],
			[/<em[^>]*?>([\s\S]*?)<\/em[^>]*>/igm, '[i]$1[/i]', true],
			[/<sub[^>]*?>([\s\S]*?)<\/sub[^>]*>/igm, '[sub]$1[/sub]', true],
			[/<sup[^>]*?>([\s\S]*?)<\/sup[^>]*>/igm, '[sup]$1[/sup]', true],
			[/<strike[^>]*?>([\s\S]*?)<\/strike[^>]*>/igm, '[s]$1[/s]', true],
			[/<ol>([\s\S]*?)<\/ol>/igm, '[ol]$1[/ol]', true],
			[/<ul>([\s\S]*?)<\/ul>/igm, '[ul]$1[/ul]', true],
			[/<li>([\s\S]*?)<\/li>/igm, '[li]$1[/li]', true],
			[/<tr[^>]*?>([\s\S]*?)<\/tr>/igm, '[tr]$1[/tr]', true],
			//[/<img[^>]*?.*?\/?>/ig, function($0) {return UBB.resolveimg($0); }, true],
			[/<u[^>]*?>([\s\S]*?)<\/u[^>]*?>/igm, '[u]$1[/u]', true]
		]
	},
	parsecolor: function($1,$2,$3){
		var o = $($3);
		if ($.browser.mozilla){
			return ($2.substr(0,5).toLowerCase()=='<span') ?
				'<span style="'+$1+':' + $2 + ';'+o.attr('style')+'">' + o.html() + '</span>' :
				'<span style="'+$1+':' + $2 + '">' + $3 + '</span>';
		}else{
			return ($2.substr(0,5).toLowerCase()=='<font') ?
				'<font color="' + $2 + '" size="'+parseInt(o.attr('size'))+'">' + o.html() + '</font>' :
				'<font color="' + $2 + '">' + $3 + '</font>';
		}
	},
	parse_rgb: function(rgb){
		if ('transparent'==rgb || ''==rgb || 'undefined'==typeof rgb) return rgb;
		if (false !== $.stripos(rgb, '#')) return rgb;
		/rgb\s*\((\d{1,3})\,\s*(\d{1,3})\,\s*(\d{1,3})\s*\)/.exec(rgb);
		var r = (RegExp.$1 && RegExp.$1>=0 && RegExp.$1<=255) ? parseInt(RegExp.$1).toString(16).toUpperCase() : '00';
		var g = (RegExp.$2 && RegExp.$2>=0 && RegExp.$2<=255) ? parseInt(RegExp.$2).toString(16).toUpperCase() : '00';
		var b = (RegExp.$3 && RegExp.$3>=0 && RegExp.$3<=255) ? parseInt(RegExp.$3).toString(16).toUpperCase() : '00';
		if (r.length==1) r='0'+r;
		if (g.length==1) g='0'+g;
		if (b.length==1) b='0'+b;
		return '#'+r+''+g+''+b;
	},
	parseimg: function(img, src, type){
		type = type || false;
		if ('local' == type){
			src = imgdomain + src;
			return '<img src="'+src+'" border="0" alt="" class="localimg" />';
		}else if ('smiley' == type){
			src = '<img src="'+img+'/' +src+'.gif" rel="'+img+':'+src+'" class="smileycode" />';
			return src;
		}
		return '<img src="'+img+'" />';
	},
	resolveimg: function(obj){
		var src=obj.attr('src'),
			attr=[src],
			width,
			height,
			zoom,
			handle=new Image(),
			float,
			alt = obj.attr('alt') || '';
		if (obj.hasClass('smileycode')) return '[emot='+obj.attr('rel')+']';
		handle.src=src;
		width=parseInt(obj.css('width'));
		if (!width) width = obj.attr('width')>0?obj.attr('width'):handle.width;
		height=parseInt(obj.css('height'));
		if (!height) height = obj.attr('height')>0?obj.attr('height'):handle.height;
		zoom = width/handle.width;
		attr.push(width);
		attr.push(parseInt(handle.height*zoom));
		float=obj.attr('align')?obj.attr('align'):(obj.css('float')?obj.css('float'):null);
		if (float && 'none'!=float) attr.push(float);
		if (obj.hasClass('localimg') || src.substr(0,4)!='http'){
			if ('undefined'!=typeof $.G.domain) attr[0]=attr[0].replace($.G.domain, '');
			if ('undefined'!=typeof $.G.updir) attr[0]=attr[0].replace($.G.updir,'');
			return '[localimg='+(attr.join('|'))+']'+alt+'[/localimg]';
		}
		return '[img='+(attr.join('|'))+']'+alt+'[/img]';
	}
};
jQuery.fn.ubbparse = function(tag, url, post){
	var self=this,d={},fn={};
	fn.venue = function(html){
		var data=this.data || this;
		$.each(data, function(k, d){
			$('#venue-'+d.id).replaceWith($.replace_tmpl(html, [d]));
		});
	}
	fn.media = function(html){
	}
	fn.download = function(html){
	}
	$(self).each(function(){
		var id=$(this).attr('id'),re=new RegExp('('+tag+')','ig'),a;
		if (!id || id.search(re)==-1) return $(this).replaceWith('');
		a=id.match(re)[0];id=id.replace(a+'-','');
		if ('undefined'==typeof d[a]) d[a]=[];
		d[a].push(id);
		$(this).removeClass('ubbparse');
	});
	$.each(d, function(a,c){
		$.getJSON(url, jQuery.extend(post||{}, {mid:a, ids: c}), function(json){
			if(!$.isFunction(fn[a])) return true;
			return fn[a].call(json, $('#'+a+'-tmpl').html());
		});
	});
};
jQuery.fn.ubbpreload = function(op){
	op = op || {};
	if(!op.width) op.width = $(this).eq(0).width();
	var cache=[];
	$(this).each(function(){
		cache.push($(this));
	});
	var loading = function(){
		var st = $(window).scrollTop(), sth = st + $(window).height();
		$.each(cache, function(i, me){
			if(!me) return true;
			var o=$('a',me), url=o.attr('href');
			me.removeClass('dynamicload');
			if (url) {
				post = o.offset().top; posb = post + o.height();
				if ((post > st && post < sth) || (posb > st && posb < sth)) {
					if (url.search(/(jpg|jpeg|gif|png)$/gi)!=-1) {
						$('<img>').loadimg(url,op.width).appendTo(o);
					}else{
						o.load(url);
					}
					cache[i]=null;
				}
			}
		});
		return false;	
	};
	loading();
	$(window).bind("scroll", loading);
};
