import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Button,
} from 'antd';
import { history } from '../_helpers';

const prevStepStyle = {
	"marginRight": "15px", 
	"marginTop": "15px", 
	"padding":"0 auto"
}

class ServiceTypeSelectionPage extends React.Component {
	constructor(props) {
		super(props);

		this.selectTutoring = this.selectTutoring.bind(this);
		this.selectTraining = this.selectTraining.bind(this);
		this.selectCareer = this.selectCareer.bind(this);
		
	}

	componentDidMount(){
		const { store } = this.context;
	}


	
	// TODO:
	selectTutoring(e) {
		history.push('/application/tutoring-selection');
	}

	selectTraining(e) {
		history.push('/application/training-selection');
	}

	selectCareer(e) {
		history.push('/application/career-selection');
	}


	render() {	
		return (
			<div className="smartbook-application-container">

				<p>请选择一个您的目标课程</p>

				<Button type="ghost" style={buttonStyle} onClick={this.selectTutoring}>大学辅导</Button>

				<Button type="ghost" style={buttonStyle} onClick={this.selectTraining}>培训课程</Button>

				<Button type="ghost" style={buttonStyle} onClick={this.selectCareer}>职业辅导</Button>
				
				<div className="text-center">
					<Link to='/application'><Button type="primary" className="button--primary__theme lg center inline" style={prevStepStyle}>上一步</Button></Link>
				</div>
			</div>
			
		);
	}
}

const buttonStyle = {
	display: "block",
	margin: "13px auto",
	padding: "0 6rem",
	borderRadius: "1rem"
}

const connectServiceTypeSelectionPage = connect()(ServiceTypeSelectionPage);
export { connectServiceTypeSelectionPage as ServiceTypeSelectionPage };