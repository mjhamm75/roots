import { 
	add_shape_to,
	clear_canvas,
	create_canvas_for,
	css3color,
	defaults,
	draw_shape,
	hex_to_decimal, 
	is_image_loaded, 
	options_from_area, 
	shape_from_area 
} from './highlight.utils.js';

(function($) {
	var has_VML, has_canvas, canvas_style;

	has_canvas = !!document.createElement('canvas').getContext;

	// VML: more complex
	// has_VML = (function() {
	// 	var a = document.createElement('div');
	// 	a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
	// 	var b = a.firstChild;
	// 	b.style.behavior = "url(#default#VML)";
	// 	return b ? typeof b.adj == "object": true;
	// })();

	// if(!(has_canvas || has_VML)) {
	// 	$.fn.maphilight = function() { return this; };
	// 	return;
	// }

	if(!has_canvas) {
		$.fn.maphilight = function() { return this; };
		return;
	}
	
	if(has_canvas) {						

		// Moved all code to utils file

	} else {   // ie executes this code
		// create_canvas_for = function(img) {
		// 	return $('<var style="zoom:1;overflow:hidden;display:block;width:'+img.width+'px;height:'+img.height+'px;"></var>').get(0);
		// };
		// add_shape_to = function(canvas, shape, coords, options, name) {
		// 	var fill, stroke, opacity, e;
		// 	for (var i in coords) { coords[i] = parseInt(coords[i], 10); }
		// 	fill = '<v:fill color="#'+options.fillColor+'" opacity="'+(options.fill ? options.fillOpacity : 0)+'" />';
		// 	stroke = (options.stroke ? 'strokeweight="'+options.strokeWidth+'" stroked="t" strokecolor="#'+options.strokeColor+'"' : 'stroked="f"');
		// 	opacity = '<v:stroke opacity="'+options.strokeOpacity+'"/>';
		// 	if(shape == 'rect') {
		// 		e = $('<v:rect name="'+name+'" filled="t" '+stroke+' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:'+coords[0]+'px;top:'+coords[1]+'px;width:'+(coords[2] - coords[0])+'px;height:'+(coords[3] - coords[1])+'px;"></v:rect>');
		// 	} else if(shape == 'poly') {
		// 		e = $('<v:shape name="'+name+'" filled="t" '+stroke+' coordorigin="0,0" coordsize="'+canvas.width+','+canvas.height+'" path="m '+coords[0]+','+coords[1]+' l '+coords.join(',')+' x e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+canvas.width+'px;height:'+canvas.height+'px;"></v:shape>');
		// 	} else if(shape == 'circ') {
		// 		e = $('<v:oval name="'+name+'" filled="t" '+stroke+' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:'+(coords[0] - coords[2])+'px;top:'+(coords[1] - coords[2])+'px;width:'+(coords[2]*2)+'px;height:'+(coords[2]*2)+'px;"></v:oval>');
		// 	}
		// 	e.get(0).innerHTML = fill+opacity;
		// 	$(canvas).append(e);
		// };
		// clear_canvas = function(canvas) {
		// 	// jquery1.8 + ie7 
		// 	var $html = $("<div>" + canvas.innerHTML + "</div>");
		// 	$html.children('[name=highlighted]').remove();
		// 	canvas.innerHTML = $html.html();
		// };
	}

	canvas_style = {
		position: 'absolute',
		left: 0,
		top: 0,
		padding: 0,
		border: 0
	};
	
	var ie_hax_done = false;
	$.fn.maphilight = function(opts) {

		opts = Object.assign({}, defaults, opts);
		
		// if(!has_canvas && !ie_hax_done) {
		// 	document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
		// 	var style = document.createStyleSheet();
		// 	var shapes = ['shape','rect', 'oval', 'circ', 'fill', 'stroke', 'imagedata', 'group','textbox'];
		// 	shapes.forEach((shape) => {
		// 		style.addRule('v\\:' + this, "behavior: url(#default#VML); antialias:true");
		// 	});
		// 	ie_hax_done = true;
		// }
		
		return this.each(function() {
			var img, wrap, options, map, canvas, canvas_always, highlighted_shape, usemap;
			img = $(this);

			if(!is_image_loaded(this)) {
				// If the image isn't fully loaded, this won't work right.  Try again later.
				return window.setTimeout(function() {
					img.maphilight(opts);
				}, 200);
			}

			options = Object.assign({}, opts, $.metadata ? img.metadata() : false, img.data('maphilight'));

			// jQuery bug with Opera, results in full-url#usemap being returned from jQuery's attr.
			// So use raw getAttribute instead.
			usemap = img.get(0).getAttribute('usemap');

			if (!usemap) {
				return;
			}

			map = document.getElementsByTagName('map')

			if(!(img.is('img,input[type="image"]') && usemap && map.length > 0)) {
				return;
			}

			if(img.hasClass('maphilighted')) {
				// We're redrawing an old map, probably to pick up changes to the options.
				// Just clear out all the old stuff.
				var wrapper = img.parent();
				img.insertBefore(wrapper);
				wrapper.remove();
				$(map).unbind('.maphilight');
			}

			wrap = $('<div></div>').css({
				display:'block',
				backgroundImage:'url("'+this.src+'")',
				backgroundSize:'contain',
				position:'relative',
				padding:0,
				width:this.width,
				height:this.height
				});
			if(options.wrapClass) {
				if(options.wrapClass === true) {
					wrap.addClass($(this).attr('class'));
				} else {
					wrap.addClass(options.wrapClass);
				}
			}
			img.before(wrap).css('opacity', 0).css(canvas_style).remove();
			if(has_VML) { img.css('filter', 'Alpha(opacity=0)'); }
			wrap.append(img);
			
			canvas = create_canvas_for(this);
			$(canvas).css(canvas_style);
			canvas.height = this.height;
			canvas.width = this.width;
			
			$(map).bind('alwaysOn.maphilight', function() {
				// Check for areas with alwaysOn set. These are added to a *second* canvas,
				// which will get around flickering during fading.
				if(canvas_always) {
					clear_canvas(canvas_always);
				}
				if(!has_canvas) {
					$(canvas).empty();
				}
				$(map).find('area[coords]').each(function() {
					var shape, area_options;
					area_options = options_from_area(this, options);
					if(area_options.alwaysOn) {
						if(!canvas_always && has_canvas) {
							canvas_always = create_canvas_for(img[0]);
							$(canvas_always).css(canvas_style);
							canvas_always.width = img[0].width;
							canvas_always.height = img[0].height;
							img.before(canvas_always);
						}
						area_options.fade = area_options.alwaysOnFade; // alwaysOn shouldn't fade in initially
						shape = shape_from_area(this);
						if (has_canvas) {
							add_shape_to(canvas_always, shape[0], shape[1], area_options, "");
						} else {
							add_shape_to(canvas, shape[0], shape[1], area_options, "");
						}
					}
				});
			})
			.trigger('alwaysOn.maphilight')
			.bind('mouseover.maphilight, focus.maphilight', function(e) {
				var shape, area_options, area = e.target;
				area_options = options_from_area(area, options);
				if(!area_options.neverOn && !area_options.alwaysOn) {
					shape = shape_from_area(area);
					add_shape_to(canvas, shape[0], shape[1], area_options, "highlighted");
					if(area_options.groupBy) {
						var areas;
						// two ways groupBy might work; attribute and selector
						if(/^[a-zA-Z][\-a-zA-Z]+$/.test(area_options.groupBy)) {
							areas = map.find('area['+area_options.groupBy+'="'+$(area).attr(area_options.groupBy)+'"]');
						} else {
							areas = map.find(area_options.groupBy);
						}
						var first = area;
						areas.each(function() {
							if(this != first) {
								var subarea_options = options_from_area(this, options);
								if(!subarea_options.neverOn && !subarea_options.alwaysOn) {
									var shape = shape_from_area(this);
									add_shape_to(canvas, shape[0], shape[1], subarea_options, "highlighted");
								}
							}
						});
					}
					// workaround for IE7, IE8 not rendering the final rectangle in a group
					if(!has_canvas) {
						$(canvas).append('<v:rect></v:rect>');
					}
				}
			})
			.bind('mouseout.maphilight, blur.maphilight', function(e) { clear_canvas(canvas); });
			
			img.before(canvas); // if we put this after, the mouseover events wouldn't fire.
			
			img.addClass('maphilighted');
		});
	};
})(jQuery);