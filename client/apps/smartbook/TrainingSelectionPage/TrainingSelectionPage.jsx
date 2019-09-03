import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Button,
	Select,
} from 'antd';
import { applicationActions, trainingActions } from '../_actions';

const prevStepStyle = {
	"marginRight": "15px"
}

class TrainingSelectionPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submitted: false,
		};

		this.props.dispatch(trainingActions.getAllTrainings());

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTrainingsChange = this.handleTrainingsChange.bind(this);
	}
	componentDidMount(){
		const { store } = this.context;
	}

	handleTrainingsChange(value) {
		this.setState( {training: value} );
	}

	
	// Deal with the state and put serivce with orderID in to Backend
	handleSubmit(e) {
		this.setState({ submitted: true });
		const { training } = this.state;
		const { orderId } = this.props;

		const updateTrainingInformation = {
			training,
			orderId
		};
		
		const { dispatch } = this.props;
		if (training) {
			dispatch(applicationActions.updateService(updateTrainingInformation));
		}
	}

	buildTrainingsList(data) {
		if(data) {
			return data.map((item) => {
				
				return (
					<Select.Option key={item._id} value={item._id} >{item.title}</Select.Option>
				);
			});
		}
		
	}
	render() {
		const { trainings } = this.props;

		let trainingsList = '';

		if(trainings['data']) {
			trainingsList = this.buildTrainingsList(trainings['data']);
		}
		
		
		return (
			<div className="smartbook-application-container">

				<p>我感兴趣的类别（单选）*</p>

				<div className="input-group ppd-input-field" >
					<Select defaultValue="请选择培训课程" onChange={this.handleTrainingsChange}>
						{trainingsList}
					</Select>
				</div>
				<div className="text-center">
					<Link to='/application/service-type-selection'><Button type="primary" className="button--primary__theme lg center inline" style={prevStepStyle}>上一步</Button></Link>
					<Button type="primary" className="button--primary__theme lg center inline" onClick={this.handleSubmit}>下一步</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { trainings } = state;
	return {
		trainings,
		orderId: state.application.id
	};
}

const styles = {
	errorStyle:{
		borderWidth: '2px',
		borderColor: '#F00'
	},
	errorTextStyle:{
		color:'#fff',
		marginBottom: 0,
		margin: '5px'
	}
};

const connectedTrainingSelectionPage = connect(mapStateToProps)(TrainingSelectionPage);
export { connectedTrainingSelectionPage as TrainingSelectionPage }; 