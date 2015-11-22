export function add_shape_to(canvas, shape, coords, options, name) {
	var i, context = canvas.getContext('2d');
	
	// Because I don't want to worry about setting things back to a base state
	
	// Shadow has to happen first, since it's on the bottom, and it does some clip /
	// fill operations which would interfere with what comes next.
	if(options.shadow) {
		context.save();
		if(options.shadowPosition == "inside") {
			// Cause the following stroke to only apply to the inside of the path
			draw_shape(context, shape, coords);
			context.clip();
		}
		
		// Redraw the shape shifted off the canvas massively so we can cast a shadow
		// onto the canvas without having to worry about the stroke or fill (which
		// cannot have 0 opacity or width, since they're what cast the shadow).
		var x_shift = canvas.width * 100;
		var y_shift = canvas.height * 100;
		draw_shape(context, shape, coords, x_shift, y_shift);
		
		context.shadowOffsetX = options.shadowX - x_shift;
		context.shadowOffsetY = options.shadowY - y_shift;
		context.shadowBlur = options.shadowRadius;
		context.shadowColor = css3color(options.shadowColor, options.shadowOpacity);
		
		// Now, work out where to cast the shadow from! It looks better if it's cast
		// from a fill when it's an outside shadow or a stroke when it's an interior
		// shadow. Allow the user to override this if they need to.
		var shadowFrom = options.shadowFrom;
		if (!shadowFrom) {
			if (options.shadowPosition == 'outside') {
				shadowFrom = 'fill';
			} else {
				shadowFrom = 'stroke';
			}
		}
		if (shadowFrom == 'stroke') {
			context.strokeStyle = "rgba(0,0,0,1)";
			context.stroke();
		} else if (shadowFrom == 'fill') {
			context.fillStyle = "rgba(0,0,0,1)";
			context.fill();
		}
		context.restore();
		
		// and now we clean up
		if(options.shadowPosition == "outside") {
			context.save();
			// Clear out the center
			draw_shape(context, shape, coords);
			context.globalCompositeOperation = "destination-out";
			context.fillStyle = "rgba(0,0,0,1);";
			context.fill();
			context.restore();
		}
	}
	
	context.save();
	
	draw_shape(context, shape, coords);
	
	// fill has to come after shadow, otherwise the shadow will be drawn over the fill,
	// which mostly looks weird when the shadow has a high opacity
	if(options.fill) {
		context.fillStyle = css3color(options.fillColor, options.fillOpacity);
		context.fill();
	}
	// Likewise, stroke has to come at the very end, or it'll wind up under bits of the
	// shadow or the shadow-background if it's present.
	if(options.stroke) {
		context.strokeStyle = css3color(options.strokeColor, options.strokeOpacity);
		context.lineWidth = options.strokeWidth;
		context.stroke();
	}
	
	context.restore();
	
	if(options.fade) {
		canvas.style.opacity = 0;
		fadeIn(canvas);
	}
};

function fadeIn(element) {
    var opacity = 0;
    function increase () {
        opacity += 0.2;
        if (opacity >= 1){
            // complete
            element.style.opacity = 1;
            return true;
        }
        element.style.opacity = opacity;
        requestAnimationFrame(increase);
    }
    increase();
}

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
