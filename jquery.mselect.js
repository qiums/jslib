(function($){
if ('undefined'==typeof $.datacache) $.datacache = {};
var mselect = function(ele, options){
	this.ele = ele;
	this.options = $.extend({}, $(this.ele).data('options'), options || {});
	$(this.ele).data('options', this.options);
	this.dom = {};
	this.val = [];
	this.init();
	$(this.ele).parent().delegate('.multi-select', 'change.change-mselect', {ob: this}, this.change);
};
mselect.prototype = {
	constructor: $.mselect,
	init: function(){
		var opts= this.options
			, name=$(this.ele).attr('id') || $(this.ele).attr('name');
		if ('undefined'===typeof $.datacache[opts.name]){
			if (opts.url){
				return $.ajax({
					url: opts.url, type:'post',
					data: $.mselect.data[opts.name] || {},
					dataType: 'json',
					ob: this, name: opts.name,
					success: function(res){
						if (0===res.code) return ;
						$.datacache[this.name] = res.body;
						this.ob.init();
					}
				});
			}
			return ;
		}
		this.val = this.options.dvalue.split(',')
		this.make(0);
	},
	make: function(i){
		if ('undefine'!= typeof this.dom){
			for (key in this.dom){
				if (key<i) continue;
				$('#'+this.dom[key]['object']).remove();
				delete this.dom[key];
			}
		}
		var x, opt, id, opts = this.options
			, len = this.val.length
			, data = $.datacache[opts.name]
			, isstr = ('object' !== $.type(data[0]))
			, optext = opts.label || '-----'
			, key, text, tmp, value;
		for (x=0; x<=len; x++){
			if (x > 0) optext = '----';
			if (!isstr){
				tmp = this.msearch(this.val[x], data).child;
				if (x<i){
					data = tmp;
					continue;
				}
				if (!data || !data.length) continue;
			}
			if ('undefined' === typeof this.dom[x]) this.dom[x] = {};
			opt = '';
			for (key in data){
				if (isstr){
					value = text = data[key];
				}else{
					value = data[key]['id'];
					text = data[key][(opts.kname || 'name')];
				}
				opt += '<option value="'+value+'"';
				if (value==this.val[x]) opt += ' selected="selected"';
				opt += '>' +text+'</option>';
			}
			this.dom[x]['object'] = id = opts.name+'_'+x;
			this.dom[x]['select'] = '<select id="'+id+'" class="multi-select" autocomplete="off"><option value="">'+optext+'</option></select>';
			this.dom[x]['option'] = opt;
			if ('undefined' == typeof tmp || tmp.length < 1) break;
			data = tmp;
		}
		return this.draw();
	},
	draw: function(){
		if ('undefined'===$.type(this.dom)) return false;
		var k, select, obj, els;
		for (k in this.dom){
			obj = this.dom[k], els=$('#'+obj['object']);
			if (els.size()>0) continue;
			els = $(obj['select']).attr('index', k).insertAfter(0==k ? this.ele : $('#'+this.dom[(k-1)]['object']));
			$(obj['option']).appendTo(els);
			//els.bind('change.mselect-change', {ob: this}, this.change);
		}
		return els;
	},
	change: function(e, ob){
		this.blur();
		var val=$(this).val(), index= parseInt($(this).attr('index'),10);
		ob = ob || e.data.ob;
		ob.val.splice(index+1, ob.val.length-index-1);
		if (''==val) ob.val.splice(index, 1);
		ob.val[index] = $(this).val();
		$(ob.ele).val(ob.val.join(','));
		ob.make(index+1);
	},
	msearch: function(needle, haystack, key){
		key = key || 'id';
		if ('undefined' != typeof haystack){
			for (var k in haystack){
				if (haystack[k][key] == needle) return haystack[k];
			}
		}
		return {};
	},
	reset: function(){
		$(this.ele).val(this.options.dvalue).nextAll('select').remove();
		this.init();
	}
};
$.mselect = {
	data: {},
	run: function(el, options){
		return new mselect(el, options);
	}
};
jQuery.fn.mselect = function(ac){
	return $(this).each(function(){
		if ('reset'===ac) return new mselect(this).reset();
		if (!$(this).data('dvalue')) $(this).data('dvalue', $(this).val());
		$.mselect.run(this, $.extend({}, {name: $(this).attr('id') || $(this).attr('name')}, $(this).data() || {}));
	});
}
})(jQuery);
$(function(){
	$('.mselect:input').mselect();
	$(document).on('click.mselect-reset', '[type=reset]',
	function(){
		$(this).closest('form').find('.mselect').mselect('reset');
	});
});
/*$(function(){$('.mselect').mselect();});*/