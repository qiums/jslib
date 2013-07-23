/* jQuery editable Copyright Dylan Verheul <dylan@dyve.net>
* Licensed like jQuery, see http://docs.jquery.com/License
*/

$.fn.editable = function(url, options) {
	if('reload'==url) return this.each(function(){
		reload(this);
	});
    // Options
	if('object'==$.type(url)){
		options = url;
		url = null;
	}
    options = jQuery.extend({}, {
        "url": url,
        "elename": "q",
        "callback": null,
        "saving": "Saving ...",
        "type": "text",
        "submitButton": 0,
        "delayOnBlur": 0,
        "extraParams": {},
        "editClass": null,
		'autosubmit': true
    }, options);
	/*if($.isFunction(options.elename)){
		options.elename = options.elename.call(this, options);
	}*/
    // Set up
    this.each(function(){
		$(this).click(function(e) {
            if (this.editing) return;
            if (!this.editable) this.editable = function() {
                var me = this;
                me.editing = true;
                me.orgHTML = $(me).html();
                me.innerHTML = "";
                if (options.editClass) $(me).addClass(options.editClass);
                var i = createInputElement.call(me, me.orgHTML);
				if(!$(me).closest('form').length){
					var f = document.createElement("form");
					f.appendChild(i);
					if (options.submitButton) {
						var b = document.createElement("input");
						b.type = "submit";
						b.value = "OK";
						f.appendChild(b);
					}
					me.appendChild(f);
					$(f).submit(function(e) {
						if (t) clearTimeout(t);
						e.preventDefault();
						var p = {};
						p[i.name] = $(i).val();
						$(me).html(options.saving).load(options.url, jQuery.extend({}, options.extraParams, p), function() {
							// Remove script tags
							me.innerHTML = me.innerHTML.replace(/<\s*script\s*.*>.*<\/\s*script\s*.*>/gi, "");
							// Callback if necessary
							if (options.success) options.success(me); 
							// Release
							me.editing = false;                        
						});
					});
				}else{
					me.appendChild(i);
				}
				if(options.callback)options.callback.call(i, options);
                var t = 0;
                i.select();
                $(i).blur(function(){
					if(!options.autosubmit) return ;
					if ($.isFunction(options.autosubmit)) options.autosubmit.call(me);
				}).keyup(function(e){
					if (e.which == 27) { // ESC
						e.preventDefault = null;
						window.returnValue = null;
						reset();
					}
                });
                function reset() {
                    me.innerHTML = me.orgHTML;
                    me.editing = false;    
                    if (options.editClass) $(me).removeClass(options.editClass);
					if(options.cancel) options.cancel.call(me);
                }
            };
            this.editable();
        });
	});
    // Don't break the chain
    return this;
    // Helper functions
    /*function arrayMerge(a, b) {
        if (a) {
            if (b) for(var i in b) a[i] = b[i];
            return a;
        } else {
            return b;        
        }
    };*/
    function createInputElement(v) {
        if (options.type == "textarea") {
            var i = document.createElement("textarea");
            options.submitButton = true;
            options.delayOnBlur = 100; // delay onBlur so we can click the button
        } else {
            var i = document.createElement("input");
            i.type = "text";
        }
        $(i).val(v);
        i.name = $.isFunction(options.elename)?options.elename.call(this):options.elename;
		if(options.style) $(i).css(style);
        return i;
    };
	function reload(me){
		$(me).html($(':input',me).val());
		me.editing = false;
		/*if (options.editClass) $(me).removeClass(options.editClass);
		if(options.cancel) options.cancel.call(me);*/
	}
};