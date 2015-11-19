import React, { Component, PropTypes } from 'react';
import ImageMap from './../components/ImageMap';

class Donations extends Component {
	render() {
		var woody = "#woody";
		var src = require("./../imgs/woody.jpg");
		return (
			<div>
				<h1>Donations</h1>
				<ImageMap source={src} mapping={woody}/>
			</div>
		)
	}
}

export default Donations;