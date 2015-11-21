var chai = require('chai');
var expect = chai.expect;

var coords = "47, 332, 43, 423, 126, 390, 48, 335, 48, 335";
var result = [25, 178, 23, 226, 67, 209, 25, 179, 25, 179];
var w = 1663;
var h = 2812;
var wPercent = 8.92;
var hPercent = 15.08;

var coords2 = "51, 132, 41, 256, 70, 300, 94, 323, 110, 339, 164, 374, 170, 382, 181, 380, 184, 362, 182, 309, 170, 269, 148, 236, 53, 132, 50, 132";
var result2 = [27, 70, 21, 137, 37, 160, 50, 173, 59, 181, 87, 200, 91, 204, 97, 203, 98, 194, 97, 165, 91, 144, 79, 126, 28, 70, 26, 70];

function calculateCoords(areas, width, height, wPercent, hPercent) {
	return areas.split(',').map((coord, i) => {
		if(i % 2 === 0) {
			return parseInt(((coord/width)*100)*wPercent);
		} else {
			return parseInt(((coord/height)*100)*hPercent);
		}
	})
}

describe('Image Map', function() {
	it('first test', function() {
		var arr = calculateCoords(coords, w, h, wPercent, hPercent);
		expect(arr.toString()).to.equal(result.toString());
	})

	it('second test', function() {
		var arr2 = calculateCoords(coords2, w, h, wPercent, hPercent);
		expect(arr2.toString()).to.equal(result2.toString());
	})
})