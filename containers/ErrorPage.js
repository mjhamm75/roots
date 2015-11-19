import React, { Component, PropTypes } from 'react';
import Login from './../components/Login';
import { login } from './../actions/killem.actions.js';
import { connect } from 'react-redux';

class ErrorPage extends Component {
	render() {
		return (
			<div>
				<h1>Error</h1>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		router: state.router
	}
}

export default connect(mapStateToProps)(ErrorPage);