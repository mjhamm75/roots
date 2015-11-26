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

var canvas;
var options;

export function highlight(image, map, opts) {

	var canvas_style = {
		position: 'absolute',
		left: 0,
		top: 0,
		padding: 0,
		border: 0
	};

	options = Object.assign({}, defaults, opts);
	
	var canvas_always, highlighted_shape;
	var img = $(image);

	var usemap = image.getAttribute('usemap');

	if (!usemap) {
		return;
	}

	var wrap = $('<div></div>').css({
		display:'block',
		backgroundImage:'url("'+image.src+'")',
		backgroundSize:'contain',
		position:'relative',
		padding:0,
		width:image.width,
		height:image.height
		});

	img.before(wrap).css('opacity', 0).css(canvas_style).remove();
	wrap.append(img);
	
	canvas = create_canvas_for(image);
	$(canvas).css(canvas_style);
	canvas.height = image.height;
	canvas.width = image.width;
	
	img.before(canvas); // if we put this after, the mouseover events wouldn't fire.
	
	img.addClass('maphilighted');
};

export function highlightArea(e) {
	var area = e.target;
	var area_options = options_from_area(area, options);
	if(!area_options.neverOn && !area_options.alwaysOn) {
		var shape = shape_from_area(area);
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
}

export function clearCanvas() {
	clear_canvas(canvas);
}