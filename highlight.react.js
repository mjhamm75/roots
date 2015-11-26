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

var globalCanvas;
var options;

export function highlight(image, map, canvas, opts) {

	var canvas_style = {
		position: 'absolute',
		left: 0,
		top: 0,
		padding: 0,
		border: 0
	};

	options = Object.assign({}, defaults, opts);

	canvas.getContext("2d").clearRect(0, 0, image.width, image.height);
	globalCanvas = canvas;
};

export function highlightArea(e) {
	var area = e.target;
	var area_options = options_from_area(area, options);
	if(!area_options.neverOn && !area_options.alwaysOn) {
		var shape = shape_from_area(area);
		add_shape_to(globalCanvas, shape[0], shape[1], area_options, "highlighted");		
	}
}

export function clearCanvas() {
	clear_canvas(globalCanvas);
}