import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
require('./../jquery.rwdImageMaps.min.js');
require('./../maphilight.js');
import { Observable } from 'rx';

class ImageMap extends Component {
	constructor(props) {
		super(props);
		this.resize = this.resize.bind(this);

		var coords1 = '47,332,43,424,126,390,48,335,48,335';
		var coords2 = '51,132,41,256,70,300,94,323,111,339,165,374,170,382,181,380,184,362,183,309,171,269,149,236,53,132,50,132';
		var coords3 = '1280,216,1304,209,1323,202,1348,181,1373,159,1397,129,1441,62,1559,62,1568,66,1587,68,1588,322,1582,327,1488,281,1419,256,1334,232,1281,220,1283,215';
		var coords4 = '1282,169,1336,137,1383,71,1366,61,1344,64,1321,75,1293,103,1281,130,1279,154,1280,167,1287,168';
		var coords5 = '1274,63,1220,61,649,64,624,67,663,340,680,595,685,603,697,587,706,547,708,479,714,427,722,398,733,369,768,333,808,304,898,276,996,234,1049,220,1152,209,1239,186,1242,183,1242,176,1247,132,1254,106,1274,76,1275,63';
		var coords6 = '428,65,578,67,584,79,598,188,573,199,558,201,458,241,448,233,424,69,430,64';
		var coords7 = '67,75,351,67,368,73,390,175,408,291,419,505,410,509,375,466,332,427,281,401,225,385,217,292,206,259,175,219,67,89,69,74';
		
		this.state = {
			mapping: [coords1, coords2, coords3, coords4, coords5, coords6, coords7]
		}

	} 

	componentDidMount() {
		var image = this.refs.image;

		var timer;
		window.addEventListener('resize', () => {
			clearTimeout(timer);
			timer = setTimeout(this.resize, 100);
		});


		// $('img[usemap]').rwdImageMaps();
		// $('img').maphilight()
		// $(window).on('resize', function(){
		// 	$('img').maphilight()
		// });
	}

	render() {
		var style = {
			width: "100%",
			height: "auto"
		};
		var mappingName = `#${this.props.mapping}`;
		var areas = this.renderArea();

		return (
			<div>
				<img onLoad={this.resize} ref="image" style={style} src={this.props.source} alt="Missing" useMap={this.props.mapping}/>
				<map ref="map" name="woody">
					{areas}
				</map>
			</div>
		)
	}

	renderArea() {
		return this.state.mapping.map((area, i) => {
			var id = `test${i}`
			return <area key={i} id={id} shape="poly" coords={area} href=""  alt="" title="" />
		});
	}

	resize() {
		var image =  new Image();
		image.src = this.refs.image.src;
		let { height, width } = image;

		let currentHeight = this.refs.image.height;
		let currentWidth = this.refs.image.width;
		
		let wPercent = width/100,
			hPercent = height/100;

		var orgCoords = [...this.refs.map.childNodes];
		let coordsPercentArr = this.calculateCoords(orgCoords, currentWidth, currentHeight, wPercent, hPercent);

		this.setState({
			mapping: coordsPercentArr
		});

		this.forceUpdate()

	}

	calculateCoords(areas, currentWidth, currentHeight, wPercent, hPercent) {
		return areas.map(area => {
			return area.coords.split(',').map((coord, i) => {
				if(i % 2 === 0) {
					return parseInt(((coord/currentWidth)*100)*wPercent);
				} else {
					return parseInt(((coord/currentHeight)*100)*hPercent);
				}
			})
		})
	}
}

export default ImageMap;