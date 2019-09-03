import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

class HomePage extends React.Component {
	componentDidMount() {
		this.props.dispatch(userActions.getUser());
	}

	handleDeleteUser(id) {
		return (e) => this.props.dispatch(userActions.delete(id));
	}

	render() {
		const { user, users } = this.props;
		return (
			<div className="col-md-6 col-md-offset-3">
				<h1>{user.email}!</h1>
				{users.loading && <em>Loading users...</em>}
				{users.error && <span className="text-danger">ERROR: {users.error}</span>}
				<p>
					<Link to="/login">Logout</Link>
				</p>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { users, authentication } = state;
	const { user } = authentication;
	return {
		user,
		users
	};
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };