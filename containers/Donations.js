import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Donations extends Component {
	render() {
		var woody = "#woody";
		var src = require("./../imgs/woody.jpg");
		return (
			<div>
				<h1>Donations</h1>
				<img src={src} alt="Missing" useMap={woody}/>
			</div>
		)
	}
}

export default Donations;