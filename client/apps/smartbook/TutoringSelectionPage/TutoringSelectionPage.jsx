import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Collapse,
	Input,
	Button,
	Select,
} from 'antd';
import { universityActions, courseActions, serivceActions, applicationActions } from '../_actions';
import { servicesConstants } from '../_constants';

const prevStepStyle = {
	"marginRight": "15px"
}

class TutoringSelectionPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			submitted: false,
			university: "5b63d36c874b010f20d42187",
		};

		this.props.dispatch(serivceActions.getServicesByType(servicesConstants.TUTORING_SERVICE));
		this.props.dispatch(universityActions.getAllUniversities());

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCourseChange = this.handleCourseChange.bind(this);
		this.handleServiceChange = this.handleServiceChange.bind(this);
		this.handleUniversityChange = this.handleUniversityChange.bind(this);
	}

	componentDidMount(){
		const { store } = this.context;
	}

    handleUniversityChange (value) {
		this.setState( {university: value} );
		this.props.dispatch(courseActions.getCourseByUni(value));
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
		const { service, university, course } = this.state;
		const { orderId } = this.props;

		const updateTutoringInformation = {
            service,
			university,
			course,
			orderId
		};
		
        const { dispatch } = this.props;
        
		if (service) {
			dispatch(applicationActions.updateService(updateTutoringInformation));
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
					<Select.Option key={item._id} value={item._id} >{item.name}</Select.Option>
				);
			});
		}
		
    }
    buildUniversityList(data) {
		if(data) {
			return data.map((item) => {	
				return (
					<Select.Option key={item._id} value={item._id} >{item.name}</Select.Option>
				);
			});
		}	
    }

    
	render() {
        const { services, university, courses } = this.props;
		
        let serviceList = '';
        let universityList = '';
        let courseList = '';

		if(services['data']) {
			serviceList = this.buildServiceList(services['data']);
		}
		
		if(courses['data']) {
			courseList = this.buildCourseList(courses['data']);
        }
        
        if(university['data']) {
            universityList = this.buildUniversityList(university['data']);
        }
		
		return (
			<div className="smartbook-application-container">

				<p>我感兴趣的类别（单选）*</p>
				{/* <p>{orderId}</p> */}

				<div className="input-group ppd-input-field" >
					<Select defaultValue="请选择学校" onChange={this.handleUniversityChange}>
						{universityList}
					</Select>
				</div>
                <div className="input-group ppd-input-field" >
					<Select defaultValue="请选择课程" onChange={this.handleCourseChange}>
						{courseList}
					</Select>
				</div>
				<div className="input-group ppd-input-field" >
					<Select defaultValue="请选择服务" onChange={this.handleServiceChange}>
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
	const { services, university, courses } = state;
	return {
        services,
		university,
		courses,
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

const connectedTutoringSelectionPage = connect(mapStateToProps)(TutoringSelectionPage);
export { connectedTutoringSelectionPage as TutoringSelectionPage }; 