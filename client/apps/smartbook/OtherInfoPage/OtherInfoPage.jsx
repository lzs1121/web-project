import React from 'react';
import { history } from '../_helpers';
import { connect } from 'react-redux';
import {
	Input,
	Button,
	Tooltip,
	Checkbox
} from 'antd';

import { applicationActions } from '../_actions';

const prevStepStyle = {
	"marginRight": "15px"
}

class OtherInfoPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userComment:'',
			submitted: false,
			checked: false,
			disabled: 'primary disabled'
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlecommentChange = this.handlecommentChange.bind(this);
		this.confirmPrivacy = this.confirmPrivacy.bind(this);
		this.handlePrevStep = this.handlePrevStep.bind(this);

	}

	handlecommentChange(e) {
		this.setState({
			userComment: e.target.value
		})
	}

	confirmPrivacy(e) {
		this.setState({
		  checked: e.target.checked,
		});
	}

	handlePrevStep(e) {

		const { university } = this.props;
		const { trainings } = this.props;
		const { services } = this.props;

		if( Object.keys(university).length ){
			history.push('/application/tutoring-selection');
		}else if( Object.keys(trainings).length ){
			history.push('/application/training-selection');
		}else if( Object.keys(services).length ){
			history.push('/application/career-selection');
		}else{
			history.push('/application');
		}
	}

	handleSubmit(e) {
		if(this.state.checked){
			this.setState({ submitted: true });
			const { userComment } = this.state;
			const { orderId } = this.props;

			const updateOtherInfo = {
				userComment,
				orderId
			}
	
			const { dispatch } = this.props;
			if (userComment) {
				dispatch(applicationActions.updateOtherInfo(updateOtherInfo));
			} else {
				const updateWithOutComment = {
					userComment: "没有留言",
					orderId
				}
				dispatch(applicationActions.updateOtherInfo(updateWithOutComment));
			}
			
		}
	}

	render() {
		const { orderId } = this.props;
		const commentContent = <p style={styles.errorTextStyle}>您还有什么想和小花说的话？</p>;
		const disabledStatus = `${this.state.checked ? 'primary' : 'primary disabled'}`;
		const compleStyle ={
			color: '#fb325c',
			fontSize: '35px'
		}
		
		return (
			<div className="smartbook-application-container">
				<div className="input-group ppd-input-field" >
					<Tooltip title={commentContent} placement="right" >
						<Input 
							type="text" 
							className="form-control" 
							placeholder="留言（选填）" 
							value={this.state.userComment} 
							onChange={this.handlecommentChange}
							maxLength="300"
						/>	
					</Tooltip>
				</div>
				<Checkbox onChange={this.confirmPrivacy} style = {checkboxStyle}>
				我已经阅读并同意<a href="/policy" target="_blank">服务与隐私条款</a>.
				</Checkbox>
				<div className="text-center">
					<Button type="primary" className="button--primary__theme lg center inline" style={prevStepStyle} onClick={this.handlePrevStep}>上一步</Button>
					<Button type={disabledStatus} className="button--primary__theme lg center inline" onClick={this.handleSubmit}>提交</Button>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		orderId: state.application.id,
		university: state.university,
		trainings: state.trainings,
		services: state.services
	}
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

const checkboxStyle = {
	paddingBottom: "1rem"
}

const connectedOtherInfoPage = connect(mapStateToProps)(OtherInfoPage);
export { connectedOtherInfoPage as OtherInfoPage }; 