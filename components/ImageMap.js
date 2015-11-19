import React, { Component, PropTypes } from 'react';

class ImageMap extends Component {
	render() {
		var style = {
			width: "100%",
			height: "auto"
		};
		return (
			<div>
				<img style={style} src={this.props.source} alt="Missing" useMap={this.props.mapping}/>
			</div>
		)
	}
}

export default ImageMap;