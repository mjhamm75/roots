export function clear_canvas(canvas) {
	canvas.getContext('2d').clearRect(0, 0, canvas.width,canvas.height);
};

export function create_canvas_for(img) {
	var canvas = document.createElement('canvas');
	canvas.width = img.width + 'px';
	canvas.height = img.height + 'px';
	canvas.getContext("2d").clearRect(0, 0, img.width, img.height);
	return canvas;
}

export function css3color(color, opacity) {
	return 'rgba('+hex_to_decimal(color.substr(0,2))+','+hex_to_decimal(color.substr(2,2))+','+hex_to_decimal(color.substr(4,2))+','+opacity+')';
};

export function draw_shape(context, shape, coords, x_shift, y_shift) {
	x_shift = x_shift || 0;
	y_shift = y_shift || 0;
	
	context.beginPath();
	if(shape == 'rect') {
		// x, y, width, height
		context.rect(coords[0] + x_shift, coords[1] + y_shift, coords[2] - coords[0], coords[3] - coords[1]);
	} else if(shape == 'poly') {
		context.moveTo(coords[0] + x_shift, coords[1] + y_shift);
		for(var i=2; i < coords.length; i+=2) {
			context.lineTo(coords[i] + x_shift, coords[i+1] + y_shift);
		}
	} else if(shape == 'circ') {
		// x, y, radius, startAngle, endAngle, anticlockwise
		context.arc(coords[0] + x_shift, coords[1] + y_shift, coords[2], 0, Math.PI * 2, false);
	}
	context.closePath();
};

export function hex_to_decimal(hex) {
	return Math.max(0, Math.min(parseInt(hex, 16), 255));
};

export function is_image_loaded(img) {
	if(!img.complete) { return false; } // IE
	if(typeof img.naturalWidth != "undefined" && img.naturalWidth === 0) { return false; } // Others
	return true;
};

export function options_from_area(area, options) {
	var $area = $(area);
	return $.extend({}, options, $.metadata ? $area.metadata() : false, $area.data('maphilight'));
};

export function shape_from_area(area) {
	var i, coords = area.getAttribute('coords').split(',');
	for (i=0; i < coords.length; i++) { coords[i] = parseFloat(coords[i]); }
	return [area.getAttribute('shape').toLowerCase().substr(0,4), coords];
};
