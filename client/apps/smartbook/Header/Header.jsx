import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.Component {

	render() {
		return (
            <header>
            {/* <nav>
                <ul>
                    <li>
                        <Link to='/test'>Application</Link>
                    </li>
                </ul>
            </nav> */}
        </header>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

const connectedHeader = connect(mapStateToProps)(Header);

export { connectedHeader as Header };