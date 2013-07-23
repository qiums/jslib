/*
* jQuery Form Plugin; v20130523
* http://jquery.malsup.com/form/
* Copyright (c) 2013 M. Alsup; Dual licensed: MIT/GPL
* https://github.com/malsup/form#copyright-and-license
*/
;(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(this).ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=this;if(i.clk=r,"image"==r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n={};n.fileapi=void 0!==e("<input type='file'/>").get(0).files,n.formdata=void 0!==window.FormData;var i=!!e.fn.prop;e.fn.attr2=function(){if(!i)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t){function r(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;o>a;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function o(a){for(var n=new FormData,i=0;a.length>i;i++)n.append(a[i].name,a[i].value);if(t.extraData){var o=r(t.extraData);for(i=0;o.length>i;i++)o[i]&&n.append(o[i][0],o[i][1])}t.data=null;var s=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:u||"POST"});t.uploadProgress&&(s.xhr=function(){var e=jQuery.ajaxSettings.xhr();return e.upload&&e.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(100*(a/n))),t.uploadProgress(e,a,n,r)},!1),e}),s.data=null;var l=s.beforeSend;return s.beforeSend=function(e,t){t.data=n,l&&l.call(this,e,t)},e.ajax(s)}function s(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(r){a("cannot get iframe.contentWindow document: "+r)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function o(){function t(){try{var e=n(g).readyState;a("state = "+e),e&&"uninitialized"==e.toLowerCase()&&setTimeout(t,50)}catch(r){a("Server abort: ",r," (",r.name,")"),s(D),j&&clearTimeout(j),j=void 0}}var r=f.attr2("target"),i=f.attr2("action");w.setAttribute("target",d),u||w.setAttribute("method","POST"),i!=m.url&&w.setAttribute("action",m.url),m.skipEncodingOverride||u&&!/post/i.test(u)||f.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),m.timeout&&(j=setTimeout(function(){T=!0,s(k)},m.timeout));var o=[];try{if(m.extraData)for(var l in m.extraData)m.extraData.hasOwnProperty(l)&&(e.isPlainObject(m.extraData[l])&&m.extraData[l].hasOwnProperty("name")&&m.extraData[l].hasOwnProperty("value")?o.push(e('<input type="hidden" name="'+m.extraData[l].name+'">').val(m.extraData[l].value).appendTo(w)[0]):o.push(e('<input type="hidden" name="'+l+'">').val(m.extraData[l]).appendTo(w)[0]));m.iframeTarget||(v.appendTo("body"),g.attachEvent?g.attachEvent("onload",s):g.addEventListener("load",s,!1)),setTimeout(t,15);try{w.submit()}catch(c){var p=document.createElement("form").submit;p.apply(w)}}finally{w.setAttribute("action",i),r?w.setAttribute("target",r):f.removeAttr("target"),e(o).remove()}}function s(t){if(!x.aborted&&!F){if(M=n(g),M||(a("cannot access response document"),t=D),t===k&&x)return x.abort("timeout"),S.reject(x,"timeout"),void 0;if(t==D&&x)return x.abort("server abort"),S.reject(x,"error","server abort"),void 0;if(M&&M.location.href!=m.iframeSrc||T){g.detachEvent?g.detachEvent("onload",s):g.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"==m.dataType||M.XMLDocument||e.isXMLDoc(M);if(a("isXml="+o),!o&&window.opera&&(null===M.body||!M.body.innerHTML)&&--O)return a("requeing onLoad callback, DOM not available"),setTimeout(s,250),void 0;var u=M.body?M.body:M.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=M.XMLDocument?M.XMLDocument:M,o&&(m.dataType="xml"),x.getResponseHeader=function(e){var t={"content-type":m.dataType};return t[e]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var l=(m.dataType||"").toLowerCase(),c=/(json|script|text)/.test(l);if(c||m.textarea){var f=M.getElementsByTagName("textarea")[0];if(f)x.responseText=f.value,x.status=Number(f.getAttribute("status"))||x.status,x.statusText=f.getAttribute("statusText")||x.statusText;else if(c){var d=M.getElementsByTagName("pre")[0],h=M.getElementsByTagName("body")[0];d?x.responseText=d.textContent?d.textContent:d.innerText:h&&(x.responseText=h.textContent?h.textContent:h.innerText)}}else"xml"==l&&!x.responseXML&&x.responseText&&(x.responseXML=X(x.responseText));try{L=_(x,l,m)}catch(b){i="parsererror",x.error=r=b||i}}catch(b){a("error caught: ",b),i="error",x.error=r=b||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&300>x.status||304===x.status?"success":"error"),"success"===i?(m.success&&m.success.call(m.context,L,"success",x),S.resolve(x.responseText,"success",x),p&&e.event.trigger("ajaxSuccess",[x,m])):i&&(void 0===r&&(r=x.statusText),m.error&&m.error.call(m.context,x,i,r),S.reject(x,"error",r),p&&e.event.trigger("ajaxError",[x,m,r])),p&&e.event.trigger("ajaxComplete",[x,m]),p&&!--e.active&&e.event.trigger("ajaxStop"),m.complete&&m.complete.call(m.context,x,i),F=!0,m.timeout&&clearTimeout(j),setTimeout(function(){m.iframeTarget||v.remove(),x.responseXML=null},100)}}}var l,c,m,p,d,v,g,x,b,y,T,j,w=f[0],S=e.Deferred();if(r)for(c=0;h.length>c;c++)l=e(h[c]),i?l.prop("disabled",!1):l.removeAttr("disabled");if(m=e.extend(!0,{},e.ajaxSettings,t),m.context=m.context||m,d="jqFormIO"+(new Date).getTime(),m.iframeTarget?(v=e(m.iframeTarget),y=v.attr2("name"),y?d=y:v.attr2("name",d)):(v=e('<iframe name="'+d+'" src="'+m.iframeSrc+'" />'),v.css({position:"absolute",top:"-1000px",left:"-1000px"})),g=v[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{g.contentWindow.document.execCommand&&g.contentWindow.document.execCommand("Stop")}catch(n){}v.attr("src",m.iframeSrc),x.error=r,m.error&&m.error.call(m.context,x,r,t),p&&e.event.trigger("ajaxError",[x,m,r]),m.complete&&m.complete.call(m.context,x,r)}},p=m.global,p&&0===e.active++&&e.event.trigger("ajaxStart"),p&&e.event.trigger("ajaxSend",[x,m]),m.beforeSend&&m.beforeSend.call(m.context,x,m)===!1)return m.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;b=w.clk,b&&(y=b.name,y&&!b.disabled&&(m.extraData=m.extraData||{},m.extraData[y]=b.value,"image"==b.type&&(m.extraData[y+".x"]=w.clk_x,m.extraData[y+".y"]=w.clk_y)));var k=1,D=2,A=e("meta[name=csrf-token]").attr("content"),E=e("meta[name=csrf-param]").attr("content");E&&A&&(m.extraData=m.extraData||{},m.extraData[E]=A),m.forceSync?o():setTimeout(o,10);var L,M,F,O=50,X=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},C=e.parseJSON||function(e){return window.eval("("+e+")")},_=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i="xml"===r||!r&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&("json"===r||!r&&n.indexOf("json")>=0?o=C(o):("script"===r||!r&&n.indexOf("javascript")>=0)&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var u,l,c,f=this;"function"==typeof t&&(t={success:t}),u=t.type||this.attr2("method"),l=t.url||this.attr2("action"),c="string"==typeof l?e.trim(l):"",c=c||window.location.href||"",c&&(c=(c.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:c,success:e.ajaxSettings.success,type:u||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var m={};if(this.trigger("form-pre-serialize",[this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var p=t.traditional;void 0===p&&(p=e.ajaxSettings.traditional);var d,h=[],v=this.formToArray(t.semantic,h);if(t.data&&(t.extraData=t.data,d=e.param(t.data,p)),t.beforeSubmit&&t.beforeSubmit(v,this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[v,this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var g=e.param(v,p);d&&(g=g?g+"&"+d:d),"GET"==t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+g,t.data=null):t.data=g;var x=[];if(t.resetForm&&x.push(function(){f.resetForm()}),t.clearForm&&x.push(function(){f.clearForm(t.includeHidden)}),!t.dataType&&t.target){var b=t.success||function(){};x.push(function(r){var a=t.replaceTarget?"replaceWith":"html";e(t.target)[a](r).each(b,arguments)})}else t.success&&x.push(t.success);if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=x.length;o>i;i++)x[i].apply(n,[e,r,a||f,f])},t.error){var y=t.error;t.error=function(e,r,a){var n=t.context||this;y.apply(n,[e,r,a,f])}}if(t.complete){var T=t.complete;t.complete=function(e,r){var a=t.context||this;T.apply(a,[e,r,f])}}var j=e('input[type=file]:enabled[value!=""]',this),w=j.length>0,S="multipart/form-data",k=f.attr("enctype")==S||f.attr("encoding")==S,D=n.fileapi&&n.formdata;a("fileAPI :"+D);var A,E=(w||k)&&!D;t.iframe!==!1&&(t.iframe||E)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){A=s(v)}):A=s(v):A=(w||k)&&D?o(v):e.ajax(t),f.removeData("jqxhr").data("jqxhr",A);for(var L=0;h.length>L;L++)h[L]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n){if(n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var i={s:this.selector,c:this.context};return!e.isReady&&i.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(i.s,i.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().bind("submit.form-plugin",n,t).bind("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r){var a=[];if(0===this.length)return a;var i=this[0],o=t?i.getElementsByTagName("*"):i.elements;if(!o)return a;var s,u,l,c,f,m,p;for(s=0,m=o.length;m>s;s++)if(f=o[s],l=f.name,l&&!f.disabled)if(t&&i.clk&&"image"==f.type)i.clk==f&&(a.push({name:l,value:e(f).val(),type:f.type}),a.push({name:l+".x",value:i.clk_x},{name:l+".y",value:i.clk_y}));else if(c=e.fieldValue(f,!0),c&&c.constructor==Array)for(r&&r.push(f),u=0,p=c.length;p>u;u++)a.push({name:l,value:c[u]});else if(n.fileapi&&"file"==f.type){r&&r.push(f);var d=f.files;if(d.length)for(u=0;d.length>u;u++)a.push({name:l,value:d[u],type:f.type});else a.push({name:l,value:"",type:f.type})}else null!==c&&c!==void 0&&(r&&r.push(f),a.push({name:l,value:c,type:f.type,required:f.required}));if(!t&&i.clk){var h=e(i.clk),v=h[0];l=v.name,l&&!v.disabled&&"image"==v.type&&(a.push({name:l,value:h.val()}),a.push({name:l+".x",value:i.clk_x},{name:l+".y",value:i.clk_y}))}return a},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor==Array)for(var i=0,o=n.length;o>i;i++)r.push({name:a,value:n[i]});else null!==n&&n!==void 0&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;n>a;a++){var i=this[a],o=e.fieldValue(i,t);null===o||void 0===o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,n=t.type,i=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"==n||"button"==n||("checkbox"==n||"radio"==n)&&!t.checked||("submit"==n||"image"==n)&&t.form&&t.form.clk!=t||"select"==i&&-1==t.selectedIndex))return null;if("select"==i){var o=t.selectedIndex;if(0>o)return null;for(var s=[],u=t.options,l="select-one"==n,c=l?o+1:u.length,f=l?o:0;c>f;f++){var m=u[f];if(m.selected){var p=m.value;if(p||(p=m.attributes&&m.attributes.value&&!m.attributes.value.specified?m.text:m.value),l)return p;s.push(p)}}return s}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"==n?this.value="":"checkbox"==a||"radio"==a?this.checked=!1:"select"==n?this.selectedIndex=-1:"file"==a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"==r||"radio"==r)this.checked=t;else if("option"==this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"==a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1})(jQuery);
(function($){
jQuery.fn.placeholder=function(){
	return this.each(function(){
		$('input[placeholder]:visible,textarea[placeholder]:visible',this)
		.each(function(){
			var dvalue = $(this).val(),color=$(this).css('color'),ph=$(this).attr('placeholder');
			if (dvalue==='')
				$(this).val(ph).css('color','#999999');
			$(this).bind('focus.form-alt',
			function(){
				if ($(this).val()===ph&&dvalue==='') $(this).val('');
				$(this).css('color', color);
			}).bind('blur.form-alt',
			function(){
				if ($(this).val()==='') $(this).val(ph).css('color','#999999');
			});
		});
	});
};
jQuery.fn.ckField = function(val){
	var pattern={
		'email':"^[0-9a-zA-Z\\-\\_\\.]+@[0-9a-zA-Z\\-\\_]+[\\.]{1}[0-9a-zA-Z]+[\\.]?[0-9a-zA-Z]+$",
		'url':"^(http|https|ftp):\\/\\/([\\w\-]+\\.)+[\\w\\-]+(\\/([\\w\-\\.\\/\\\\\?%&=])*)?",
		'datetime':"^(19|20)[0-9]{2}[\\-\\/](0?[1-9]|1[0-2])[\\-\\/](0?[1-9]|[1|2][0-9]|3[0|1])\\s([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$",
		'date':"^(19|20)[0-9]{2}[\\-\\/](0?[1-9]|1[0-2])[\\-\\/](0?[1-9]|[1|2][0-9]|3[0|1])$",
		'time':"^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$",
		'money':"^(?!0\\d)(?!\\.)[0-9]+(\\.[0-9]{2})?$",
		'cnidcard':"(^\d{15}|\d{18}|(\d{17}X))$",
		'cnphone':"(^(800|400)[\\-]*[0-9]{7,8}$)|(^0[1-9]{1}[0-9]{1,2}[\\-]*[2-8]{1}[0-9]{6,7}(\\-\\d+)*$)|(^[2-8]{1}[0-9]{6,7}(\\-\\d+)*$)|(^[0]?1[358]{1}[0-9]{9}$)",
		'enword':"^[a-z]+$",
		'string':"^[a-z0-9]*[a-z]+[a-z0-9]*$",
		'num':"^[0-9]+$",
		'any':"^[\\s\\S]+$"
	};
	var ob = {
		dval:$(this).attr('placeholder'), val: val || $(this).val(), 'class': $(this).attr('class'), depr: $(this).attr('depr'), k:0
	}, m = {
		'min': ob['class'].match(/minlength(\d+)/i), 'max': parseInt($(this).attr('maxlength')),
		rule: ob['class'].match(/rule\-([^\s"'>]+)/i), logic: ob['class'].match(/(checked|notnull|lt|gt)\-([^\s"'>]+)/i)
	};
	ob.len = $.trim(ob.val).strlen();
	if ($(this).is(':disabled')) return true;
	if (ob.dval && ob.dval===ob.val) ob.val = '';
	if (ob.depr && ob.val !== ''){
		ob.val = ob.val.split(ob.depr);
		for (ob.k in ob.val){
			if (!$(this).ckField(ob.val[ob.k])) return false;
		}
		return true;
	}
	if (m.logic && m.logic.length>2){
		//check-1,checked-min1,checked-max5,checked-remember,notnull-username,lt-start_time,gt-end_time
		if ('checked' === m.logic[1] && m.logic[2].search(/^(min|max)*\d+$/i) !== -1){
			ob.checked = m.logic[2].match(/^(min|max)*(\d+)$/i);
			ob.checked_len = $('input[name="' +$(this).attr('name') +'"]:checked', $(this).closest('form')).length;
			ob.limit_len = parseInt(ob.checked[2], 10);
			switch (ob.checked[1]){
				case 'min': return ob.limit_len >= ob.checked_len;
				case 'max': return ob.limit_len <= ob.checked_len;
				default: return ob.limit_len === ob.checked_len;
			}
		}
		var el = $('#' + m.logic[2]), val;
		if ('now'!== m.logic[2] && !el.length) return true;
		val = 'now'!== m.logic[2] ? new Date() : $.trim(el.val());
		switch (m.logic[1]){
			case 'checked':
				if (!el.is(':checked')) return false;
				break;
			case 'notnull':
				if (val === '') return false;
				break;
			case 'lt':
				if (ob.val > val) return false;
				break;
			case 'gt':
				if (ob.val < val) return false;
				break;
		}
	}
	if ($(this).hasClass('cannull') && ob.val==='') return true;
	if (!ob.len && !m['min']) return true;
	if (m['min']){
		m['min'] = parseInt(m['min'][1]);
		if (m['min']>ob.len) return false;
	}
	if (m['max'] && ob.len>m['max']) return false;
	if (ob.rule){
		ob.rule = ob.rule[1]; ob.rule_data = $(document).data(ob.rule);
		if (ob.rule_data){
			if (ob.rule_data === ob.val) return true;
			$(document).removeData(ob.rule);
			return false;
		}
		$(document).data(ob.rule, ob.val);
	}
	ob.ex = ob['class'].match(/req\-([^\s"'>]+)/)[1];
	if ('undefined' === typeof pattern[ob.ex]) return true;
	return new RegExp(pattern[ob.ex],'gi').test(ob.val);
};
jQuery.fn.ckSubmit=function(opts){
	return this.each(function(){
		$(this).unbind('submit.form-check-submit').bind('submit.form-check-submit',function(e){
			return $(this).ckForm(opts);
		});
	});
};
jQuery.fn.ckForm = function(opts){
	return this.each(function(){
		return $.ckForm(this, opts);
	});
};
jQuery.fn.ckBlur = function(){
	return this.each(function(){
		return $.ckForm(this, {mode:0, ckblur: 1});
	});
};
jQuery.fn.saveForm = function(opts, suc){
	if ($.isFunction(opts)){
		suc = opts; opts = {};
	}else if('object' !== $.type(opts)){
		opts = {};
	}
	if (opts.success){
		suc = opts.success;
		delete opts.success;
	}
	return this.each(
	function(){
		if (parseInt($(this).data('ckblur'), 10)===1) $(this).ckBlur();
		$(this).removeData('ckblur').bind('form-pre-serialize',
		function(e, form, op, veto){
			veto.veto = !$(this).ckForm();
		}).ajaxForm($.extend({
			dataType: $(this).data('type') || 'json',
			formele: this,
			beforeSend: function(xhr){
				if ($('.ajax-tips:hidden').length> 0) $('.ajax-tips').fadeIn();
				$('button', this.formele).attr('disabled', true);
			},
			success: function(res){
				$('button', this.formele).attr('disabled', false);
				if ('json' != this.dataType){
					if (suc) return suc.call(this. res);
					return ;
				}
				if ('undefined'===typeof $.dialog) return alert(res.message);
				if (0===res.code){
					if ('form-element-error' === res.message && res.body){
						for (var k in res.body){
							$(this.formele).trigger('form-check-error', [res.body[k].id, res.body[k].error]);
						}
						return ;
					}
					return $.dialog(res.message, {
						appendClass:'ui-dialog-error', timeout:3,
						buttons:{'Close':'close'}
						});
				}
				if (suc) return suc.call(this, res);
				$.ckSuccess(res);
			}
		}, opts || {}));
	});
};
$.ckSuccess = function(res){
	if ($('.ajax-tips:hidden').length> 0){
		$('.ajax-tips').html(res.message).fadeIn();
		return setTimeout(function(){
			$('.ajax-tips').fadeOut();
		}, 3000);
	}
	return $.dialog(res.message, {
		appendClass: 'ui-dialog-ok', timeout:3,
		buttons:{
			'Close':'close'
		}
	});
};
$.ckOption = function(ele, opts){
	opts = $.extend({res:[], mode:0, ckblur:0}, $(ele).data(), opts || {});
	if ($.isFunction(opts)){
		opts = {error: opts};
	}
	if (!opts.error){
		opts.error = function(e, el, tip){
			tip = tip || $(el).data('alt') || $(el).attr('placeholder');
			if (!tip) return ;
			if (!$.dialog) return alert(tip);
			$(el).closest('li,div').addClass('ckerror');
			$(el).dialog({type:'popover', message:tip, position:'top'});
			try{el.focus();}catch(e){};
			return false;
		}
	};
	opts.build = function(el){
		var res = $(el).ckField()
			, build = $(el).triggerHandler('element-build', [res]);
		if ('undefined' !== typeof build) res = build;
		if (!res){
			opts.res.push(el);
			if (!opts.mode){
				$(ele).triggerHandler('form-check-error', [el]);
				return false;
			}
		}
		return true;
	};
	$(ele).unbind('form-check-error').bind('form-check-error', opts.error);
	delete opts.error;
	return opts;
};
$.ckForm = function(ele, opts){
	opts = $.ckOption(ele, opts);
	$(ele).find('[class*=req-]:input').each(
	function(){
		if (!opts.ckblur) return opts.build(this);
		$(this).bind('blur.form-check-blur',
		function(){
			opts.build(this);
		});
	});
	return opts.res.length === 0;
};
})(jQuery);
if ('undefined'===typeof String.prototype.strlen){
	String.prototype.strlen = String.prototype.str_length = function(){return this.replace(/[^\x00-\xff]/g,'##').length};
}
