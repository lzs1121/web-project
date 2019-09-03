import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

class AccountPage extends React.Component{
	render() {
		return (
			<div>
				<h3>Acc</h3>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		state
	};
}

const connectedAccountPage = connect(mapStateToProps)(AccountPage);

export { connectedAccountPage as AccountPage};