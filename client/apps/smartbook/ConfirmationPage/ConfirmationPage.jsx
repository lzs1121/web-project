import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	Collapse,
	Input,
	Icon
} from 'antd';

class ConfirmationPage extends React.Component {
	constructor(props) {
		super(props);
		console.log('confirmed')
		// reset login status
	}

	render() {
		const compleStyle ={
			color: '#fb325c',
			fontSize: '35px'
		}
		return (
			<div className="text-center">
				<Icon type="check-circle" style={compleStyle}/>
				<p></p>
				<p></p>
				<h3>感谢你对我们的信任</h3>
				<p> 报名确认信已发送至邮箱，你也可以扫码添加匠人小花的微信咨询哦</p>
				<img className="shadow jr-confirmationPage__img" src="/images/xiaohua.jpeg" alt="匠人小花"/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { loggingIn } = state.authentication;
	return {
		loggingIn
	};
}

const connectedConfirmationPage = connect(mapStateToProps)(ConfirmationPage);
export { connectedConfirmationPage as ConfirmationPage }; 
