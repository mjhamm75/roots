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

export function highlight(image, opts) {

	var canvas_style = {
		position: 'absolute',
		left: 0,
		top: 0,
		padding: 0,
		border: 0
	};

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
	
	var img, wrap, options, map, canvas, canvas_always, highlighted_shape, usemap;
	img = $(image);

	if(!is_image_loaded(image)) {
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
		backgroundImage:'url("'+image.src+'")',
		backgroundSize:'contain',
		position:'relative',
		padding:0,
		width:image.width,
		height:image.height
		});
	if(options.wrapClass) {
		if(options.wrapClass === true) {
			wrap.addClass($(image).attr('class'));
		} else {
			wrap.addClass(options.wrapClass);
		}
	}
	img.before(wrap).css('opacity', 0).css(canvas_style).remove();
	wrap.append(img);
	
	canvas = create_canvas_for(image);
	$(canvas).css(canvas_style);
	canvas.height = image.height;
	canvas.width = image.width;
	
	$(map).bind('alwaysOn.maphilight', function() {
		// Check for areas with alwaysOn set. These are added to a *second* canvas,
		// which will get around flickering during fading.
		if(canvas_always) {
			clear_canvas(canvas_always);
		}
		$(map).find('area[coords]').each(function() {
			var shape, area_options;
			area_options = options_from_area(image, options);
			if(area_options.alwaysOn) {
				if(!canvas_always && has_canvas) {
					canvas_always = create_canvas_for(img[0]);
					$(canvas_always).css(canvas_style);
					canvas_always.width = img[0].width;
					canvas_always.height = img[0].height;
					img.before(canvas_always);
				}
				area_options.fade = area_options.alwaysOnFade; // alwaysOn shouldn't fade in initially
				shape = shape_from_area(image);
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
					if(image != first) {
						var subarea_options = options_from_area(image, options);
						if(!subarea_options.neverOn && !subarea_options.alwaysOn) {
							var shape = shape_from_area(image);
							add_shape_to(canvas, shape[0], shape[1], subarea_options, "highlighted");
						}
					}
				});
			}
		}
	})
	.bind('mouseout.maphilight, blur.maphilight', function(e) { clear_canvas(canvas); });
	
	img.before(canvas); // if we put this after, the mouseover events wouldn't fire.
	
	img.addClass('maphilighted');
};