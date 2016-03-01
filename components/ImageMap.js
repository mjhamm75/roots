import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { highlight, highlightArea, clearCanvas } from './../highlight.react.js';

class ImageMap extends Component {
	constructor(props) {
		super(props);
		this.resize = this.resize.bind(this);
		this.mouseOver = this.mouseOver.bind(this);
		this.mouseOut = this.mouseOut.bind(this);
		
		this.state = {
			mapping: this.props.coords,
			originalMapping: this.props.coords,
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
		var mappingName = `#${this.props.mappingName}`;
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