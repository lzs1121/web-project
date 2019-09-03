import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from './_helpers';
import { alertActions } from './_actions';
import { ApplicationPage } from './ApplicationPage';
import { ConfirmationPage } from './ConfirmationPage';
import { OtherInfoPage } from './OtherInfoPage';
import { CareerSelectionPage} from './CareerSelectionPage';
import { TrainingSelectionPage } from './TrainingSelectionPage';
import { TutoringSelectionPage } from './TutoringSelectionPage';
import { ServiceTypeSelectionPage } from './ServiceTypeSelectionPage';
import { Header } from './Header';

class App extends React.Component {
	constructor(props) {
		super(props);

		const { dispatch } = this.props;
		history.listen((location, action) => {
			// clear alert on location change
			dispatch(alertActions.clear());
		});
	}

	render() {
		const { alert } = this.props;
		return (
			<div className="smartbook-container">
				{alert.message &&
					<div className={`alert ${alert.type}`}>{alert.message}</div>
				}
				<Router history={history}>
					<div>
						<main>
							<Switch>
								{/* Smartbook Routing Logic:																						 */}
								{/*                                          /-> if training -> TrainingSelectionPage   -\ 								 */}
								{/* ApplicationPage -> ServiceTypeSelectionPage  --> if tutoring -> TutoringSelectionPage  OtherInfoPage -> ConfirmationPage */}
								{/*                                          \-> if career   ->  CareerSelectionPage    -/ 								 */}
								<Route path="/application" component={ApplicationPage} exact/>
								{/* <Route path="/application/service-selection" component={ServiceSelectionPage} /> */}
								<Route path="/application/service-type-selection" component={ServiceTypeSelectionPage} />
								<Route path="/application/other-info" component={OtherInfoPage} />
								<Route path="/application/confirmation" component={ConfirmationPage} />

								<Route path="/application/training-selection" component={TrainingSelectionPage} />
								<Route path="/application/tutoring-selection" component={TutoringSelectionPage} />
								<Route path="/application/career-selection" component={CareerSelectionPage} />

								<Route path="/application/*" component={ApplicationPage} />
								<Route path="/tutorials" component={ApplicationPage} exact/>
								<Route path="/university/:slug" component={ApplicationPage} exact/>
							</Switch>
						</main>
					</div>
				</Router>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { alert } = state;
	return {
		alert
	};
}

export default connect(mapStateToProps)(App);
