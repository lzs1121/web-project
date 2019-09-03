import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Collapse,
	Input,
	Button,
	Select,
} from 'antd';
import { applicationActions, serivceActions } from '../_actions';
import { servicesConstants } from '../_constants';

const prevStepStyle = {
	"marginRight": "15px"
}

class CareerSelectionPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submitted: false,
		};

		//Below 2 lines code renders all the service lists in the front end page

		this.props.dispatch(serivceActions.getServicesByType(servicesConstants.CAREER_SERVICE));
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCourseChange = this.handleCourseChange.bind(this);
		this.handleServiceChange = this.handleServiceChange.bind(this);
	}
	componentDidMount(){
		const { store } = this.context;
	}

	handleCourseChange (value) {
		this.setState( {course: value} );
	}
	handleServiceChange(value) {
		this.setState( {service: value} );
	}

	
	// Deal with the state and put serivce with orderID in to Backend
	handleSubmit(e) {
		this.setState({ submitted: true });
		const { service } = this.state;
		const { orderId } = this.props;

		const updateServiceInformation = {
			service,
			orderId
		};
		
		const { dispatch } = this.props;
		if (service) {
			dispatch(applicationActions.updateService(updateServiceInformation));
		}
	}

	buildCourseList(data) {
		if(data) {
			return data.map((item) => {
				return (
					<Select.Option key={item._id} value={item._id} >{item.name}</Select.Option>
				);
			});
		}
		
	}
	buildServiceList(data) {
		if(data) {
			return data.map((item) => {
				
				return (
					<Select.Option key={item._id} value={item._id} >{item.chName}</Select.Option>
				);
			});
		}
		
	}
	render() {
		const { courses, services, orderId} = this.props;

		let courseList = '';
		let serviceList = '';

		if(courses['data']) {
			courseList = this.buildCourseList(courses['data']);
		}
		if(services['data']) {
			serviceList = this.buildServiceList(services['data']);
		}
		
		
		return (
			<div className="smartbook-application-container">

				<p>我感兴趣的类别（单选）*</p>

				{/* <p>{orderId}</p> */}

				<div className="input-group ppd-input-field" >
					<Select defaultValue="请选择职业辅导课程" onChange={this.handleServiceChange}>
						{serviceList}
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
	const { courses, services } = state;
	return {
		courses,
		services,
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

const connectedCareerSelectionPage = connect(mapStateToProps)(CareerSelectionPage);
export { connectedCareerSelectionPage as CareerSelectionPage }; 