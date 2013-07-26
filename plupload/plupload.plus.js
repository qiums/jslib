(function($){
var plupload_plus = function(el, op){
	//if (!el.id) $(el).attr('id', 'file-' + Math.random());
	$(el).attr('readonly', true);
	this.ele = el;
	this.button = $(this.ele).next('button');
	this.op = jQuery.extend({}, $(el).data() || {}, op || {});
	this.init();
}
plupload_plus.prototype = {
	init: function(){
		if (!this.button.length){
			this.button = $((this.op.browse ? '<a href="' + this.op.browse + '" title="' + $.lang('Choose file') + '" />' : '<button type="button" />')).html('<i class="icon-upload"></i>')
				.addClass('btn').insertAfter(this.ele);
			this.op.browse ? this.button.on('click.begin-upload', $.proxy(this.open, this)) : this.open();
		}
	},
	open: function(e){
		if (this.button.is(':button')){
			this.op.plqueue = false;
			this.op.single = true;
			return this.upload(window.event, this.button);
		}
		jQuery.doane(e);
		this.button.dialog({
			width:800, id: 'plupload-'+ (this.op.panelname || $(this.ele).attr('id')),
			tip: $('<button type="button" class="btn" />').html('<i class="icon-upload"></i>' + $.lang('Upload')).bind('tip-callback', {op: this.op}, this.upload),
			buttons: {
				'Submit.btn-primary': function(){},
				'Cancel': 'close'
			},
			onRender: $.isFunction(this.op.onRender) ? this.op.onRender : function(){}
		});
	},
	upload: function(e, b){
		var op = (e && e.data && e.data.op) ? e.data.op : this.op;
		b = b || $(this);
		return b.pluploader(jQuery.extend({multipart_params: op.onQuery || {}}, op || {}));
	}
};
var pluploader = function(el, options){
	if (!el.id) $(el).attr('id', 'file-' + new Date().getTime());
	if (!options) return $.pluploader.selector[el.id];
	if ((options.plqueue) && undefined === jQuery.fn.pluploadQueue){
		$.include($.pluploader.jspath() + '/plupload/jquery.plupload.queue/css/jquery.plupload.queue.css');
		return $.getScript($.pluploader.jspath() + '/plupload/jquery.plupload.queue/jquery.plupload.queue.js',
		function(){$(el).pluploader(options);});
	}
	if ('undefined' === typeof options.url) return false;
	options.multipart_params.ajax = 'json';
	if (options.single) {
		delete options.single;
		$(el).bind('plupload-FilesAdded', function(e, up, files){
			$.each(up.files, function(i, file){
				if (i+1 === up.files.length) return true;
				up.removeFile(file);
			});
			if (up.settings.autoupload){
				up.start();
			}else{
				if ($(el).prev().is(':text')){
					if (!up.settings.multipart_params.oldfile) up.settings.multipart_params.oldfile = $(el).prev(':text').val();
					$(el).prev(':text').val(up.files[0].name);
				}
			}
			return false;
		});
	}
	$.each(['FilesAdded', 'QueueChanged', 'UploadProgress', 'FileUploaded', 'UploadComplete'],
	function(i, fn){
		if (options[fn]){
			$(el).bind('plupload-' + fn, options[fn]);
			delete options[fn];
		}
	});
	options = jQuery.extend({
		flash_swf_url : $.pluploader.jspath()+'/plupload/plupload.flash.swf',
		resize : {width : 1200, height : 1200, quality : 90},
		filters: [
			{title : "图片文件", extensions : "jpg,gif,png"}
		],
		chunk_size: '1mb', use_size: 0, results: [], max_file_size: '20mb',
		init: {
			BeforeUpload: function(up, files){
				if (false === $(el).triggerHandler('plupload-BeforeUpload', [up, files])) return ;
				$('.ajax-tips').each(function(){
					$(this).data('default-html', $(this).html()).html($.pluploader.lang('Start upload..')).show();
				});
			},
			Error: function(up, err){
				var message = '<div>- '+$.pluploader.lang(err.message)+' <em style="color:#999">('+err.file.name+')</em></div>'
					, options = {
						id: 'plupload-error', title: $.pluploader.lang('Tips'),
						appdata: $('#ui-dialog-plupload-error').length>0,
						buttons: {
							'Close': function(){
								this.hide();
								this.boxes.remove();
							}
						}
					};
				if (!options.appdata) message = '<strong>' + $.pluploader.lang(err.ac==='fileadded' ? 'Files queue error' : 'Some documents found an error') + ':</strong><br /><br />'+ message;
				$.dialog(message, options);
				return false;
			},
			FilesAdded: function(up, files){
				if (false === $(el).triggerHandler('plupload-FilesAdded', [up, files])) return ;
				$.each(files, function(index, file){
					up.settings.use_size += file.size;
					if(-1 === up.settings.over_size) return true;
					up.settings.over_size -= file.size;
					if(up.settings.over_size<0){
						up.settings.init.Error(up, {message: $.pluploader.lang('No enough free space.'), file: file, ac: 'fileadded'});
						up.removeFile(file);
					}
				});
			},
			FilesRemoved: function(up, files){
				$(el).triggerHandler('plupload-FilesRemoved', [up, files]);
				$.each(files, function(index, file){
					up.settings.use_size -= file.size;
					if(-1 === up.settings.over_size) return true;
					up.settings.over_size += file.size;
				});
			},
			QueueChanged: function(up){
				$(el).triggerHandler('plupload-QueueChanged', [up]);
			},
			UploadProgress: function(up, file){
				$(el).triggerHandler('plupload-UploadProgress', [up, file]);
			},
			FileUploaded: function(up, file, info){
				if(info.response){
					info.response = eval('('+info.response+')');
					if(104 === parseInt(info.response.body.code,10)) up.stop();
				}
				up.settings.results.push([file, info]);
				$(el).triggerHandler('plupload-FileUploaded', [up, file, info.response]);
			},
			UploadComplete: function(up, files){
				$('.ajax-tips').each(function(){
					$(this).html($(this).data('default-html'));
				});
				$.pluploader.reset(up);
				$(el).triggerHandler('plupload-UploadComplete', [up, files]);
			}
		}
		}, options || {});
	if ($.G && $.G.token) options.multipart_params.token = $.G.token;
	if (options.plqueue) return $(el).plqueue(options);
	options.browse_button = el.id;
	var uploader = new plupload.Uploader(options);
	uploader.init();
	$.pluploader.selector[el.id] = uploader;
	return uploader;
}
if (jQuery.lang){
	jQuery.lang({
		'Select files': '选择文件',
		'Add files': "添加文件",
		'Drag files here.': "拖动文件到此窗口",
		'File extension error.': "文件类型错误",
		'File size error.': '文件大小超过限制',
		'Files queue error': "添加以下文件到队列时发生错误",
		'Some documents found an error': '以下文件发生错误',
		'No enough free space.': "剩余的空间不足，已停止上传",
		'Start upload': "开始上传",
		'Start uploading queue': "上传队列",
		'Stop current upload': "停止队列",
		'Filename': '文件名',
		'Size': '大小',
		'Status': '状态',
		'Tips': '操作信息'
	});
}
$.pluploader = {
	loaded: false,
	selector: {},
	autoup: {},
	reset: function(selector){
		$.each((selector ? {'a':selector} : this.selector), function(i, up){
			$.each(up.files, function(k, file){
				up.removeFile(file);
			});
			up.refresh();
		});
	},
	setsize: function(){
		setTimeout(function(){
			$('.plupload_usesize').text(plupload.formatSize(pluploader.usesize));
		}, 500);
	},
	lang: function(key, d){
		if (!$.lang) return key;
		return $.lang(key, d);
	},
	runtimes: function(){
		var reader, runtimes='html5';
		try{
			reader = new FileReader();
			reader = null;
		}catch(e){
			runtimes = 'flash';
		};
		return runtimes;
	},
	jspath: function(){
		var src = $('script:first').attr('src');
		return src.substr(0, src.lastIndexOf('/'));
	},
	callback: function(callback){
		if (this.loaded) return callback();
		$.getScript(this.jspath() +'/plupload/plupload.'+$.pluploader.runtimes()+'.js',
		function(){
			$.pluploader.loaded = true;
			callback();
		});
	}
};
$.fn.pluploader = function(options, fn){
	if (!options) return new pluploader(this[0]);
	if ($.isFunction(options.multipart_params)){
		fn = options.multipart_params;
		options.multipart_params = {};
	}
	return this.each(function(){
		if (fn) options.multipart_params = fn.call(this);
		return new pluploader(this, options);
	});
};
$.fn.plupload_plus = function(options){
	if ($.isFunction(options)){
		options = {onRender: options};
	}else if ('object' !== $.type(options)){
		options = {};
	}
	return this.each(function(){
		return new plupload_plus(this, options);
	})
}
/*$.getScript($.jspath() +'/plupload/plupload.'+$.pluploader.runtimes()+'.js',
	function() {
		$('.form-file').plupload_plus();
	});*/
})(jQuery);
