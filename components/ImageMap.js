import React, { Component, PropTypes } from 'react';

class ImageMap extends Component {
	render() {
		return (
			<div>
				<img src={this.props.source} alt="Missing" useMap={this.props.mapping}/>
			</div>
		)
	}
}

export default ImageMap;