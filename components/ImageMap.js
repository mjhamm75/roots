import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { highlight, highlightArea, clearCanvas } from './../highlight.react.js';

class ImageMap extends Component {
	constructor(props) {
		super(props);
		this.resize = this.resize.bind(this);
		this.mouseOver = this.mouseOver.bind(this);
		this.mouseOut = this.mouseOut.bind(this);

		var coords1 = '47,332,43,424,126,390,48,335,48,335';
		var coords2 = '51,132,41,256,70,300,94,323,111,339,165,374,170,382,181,380,184,362,183,309,171,269,149,236,53,132,50,132';
		var coords3 = '1280,216,1304,209,1323,202,1348,181,1373,159,1397,129,1441,62,1559,62,1568,66,1587,68,1588,322,1582,327,1488,281,1419,256,1334,232,1281,220,1283,215';
		var coords4 = '1282,169,1336,137,1383,71,1366,61,1344,64,1321,75,1293,103,1281,130,1279,154,1280,167,1287,168';
		var coords5 = '1274,63,1220,61,649,64,624,67,663,340,680,595,685,603,697,587,706,547,708,479,714,427,722,398,733,369,768,333,808,304,898,276,996,234,1049,220,1152,209,1239,186,1242,183,1242,176,1247,132,1254,106,1274,76,1275,63';
		var coords6 = '428,65,578,67,584,79,598,188,573,199,558,201,458,241,448,233,424,69,430,64';
		var coords7 = '67,75,351,67,368,73,390,175,408,291,419,505,410,509,375,466,332,427,281,401,225,385,217,292,206,259,175,219,67,89,69,74';
		
		this.state = {
			mapping: [coords1, coords2, coords3, coords4, coords5, coords6, coords7],
			originalMapping: [coords1, coords2, coords3, coords4, coords5, coords6, coords7],
			canvasWidth: '100%',
			canvasHeight: 'auto'
		}

	}

	componentDidMount() {		
		var timer;
		var that = this;
		window.onresize = () => {
			clearTimeout(timer);
			timer = setTimeout(that.resize, 100);
		};
	} 

	mouseOver(e) {
		highlightArea(e, this.refs.canvas);
	}

	mouseOut() {
		clearCanvas(this.refs.canvas);
	}

	render() {
		var mappingName = `#${this.props.mapping}`;
		var areas = this.renderArea();
		var wrapperStyle = {
			backgroundImage: `url(${this.props.source})`,
			backgroundSize: "contain",
			display: "block",
			height: this.state.canvasHeight + "px",
			padding: "0px",
			position: "relative",
			width: this.state.canvasWidth + "px"
		}

		var canvasStyle = {
			border: "0px",
			left: "0px",
			opacity: 1,
			top: "0px",
			padding: "0px",
			position: "absolute"
		}

		var imageStyle = {
			border: "0px",
			height: "auto",
			left: "0px",
			opacity: 0,
			padding: "0px",
			position: "absolute",
			top: "0px",
			width: "100%"
		}

		return (
			<div>
				<div style={wrapperStyle}>
					<canvas ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight} style={canvasStyle}></canvas>
					<img ref="image" onLoad={this.resize} style={imageStyle} src={this.props.source} alt="Missing" useMap="woody" />
				</div>
				<map ref="map" name="#woody">
					{areas}
				</map>
			</div>
		)
	}

	renderArea() {
		return this.state.mapping.map((area, i) => {
			var id = `test${i}`
			var refId = `area${i}`
			return <area key={i} id={id} shape="poly" coords={area} href=""  alt="" title="" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}/>
		});
	}

	resize() {
		var image =  new Image();
		image.src = this.refs.image.src;
		let { height: fullHeight, width: fullWidth } = image;

		let { height: currentHeight, width: currentWidth } = this.refs.image;
		
		let wPercent = currentWidth/100,
			hPercent = currentHeight/100;

		let modifiedCoords = this.calculateCoords(this.state.originalMapping, fullWidth, fullHeight, wPercent, hPercent);

		this.setState({
			canvasHeight: currentHeight,
			canvasWidth: currentWidth,
			mapping: modifiedCoords
		});
	}

	calculateCoords(mapping, width, height, wPercent, hPercent) {
		return mapping.map(area => {
			return area.split(',').map((coord, i) => {
				if(i % 2 === 0) {
					return parseInt(((coord/width)*100)*wPercent);
				} else {
					return parseInt(((coord/height)*100)*hPercent);
				}
			})
		})
	}
}

export default ImageMap;