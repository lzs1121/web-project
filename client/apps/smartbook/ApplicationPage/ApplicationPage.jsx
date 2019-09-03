import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	Collapse,
	Input,
	Button,
	Select,
	AutoComplete,
	Tooltip
} from 'antd';
import { applicationActions } from '../_actions';
import { cityActions } from "../_actions";
import { regxTelephoneAndMobile } from '../../../utils/regex';

const { TextArea } = Input;
const Panel = Collapse.Panel;
const Option = Select.Option;

class ApplicationPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			name: '',
			phone: '',
			wechat: '',
			location: '',
			city: '',
			submitted: false,
			dataSource: [],
			nameErr:false,
			wechatErr:false,
			emailErr: false,
			phoneErr:false,
		};
		
		this.props.dispatch(cityActions.getAllCities());

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNextPage = this.handleNextPage.bind(this);
		this.handlePhoneChange = this.handlePhoneChange.bind(this);
		this.handleWeChatChange = this.handleWeChatChange.bind(this);
		this.handleCityChange = this.handleCityChange.bind(this);

	}
	componentDidMount(){
		
	}

	handleCityChange (value) {
		this.setState( {city: value} );
	}

	handleNameChange (e) {
		const value = e.target.value;
		const regName = /^[a-zA-Z\/ ]{2,50}$/;
		if(value.length === 0 || regName.test(value) === false) {
			this.setState({
				nameErr:true
			});
		} else {
			this.setState({
				nameErr:false
			});
		}
		this.setState({
			name: value
		});
	}
	handleWeChatChange (e) {
		const value = e.target.value;
		if(value.trim().length === 0) {
			this.setState({
				wechatErr:true
			});
		} else {
			this.setState({
				wechatErr:false
			});
		}
		this.setState({ wechat: e.target.value });
	}
	handleEmailChange (value) {
		const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(value.trim().length === 0 || regx.test(value) === false) {
			this.setState({
				emailErr:true
			});
		} else {
			this.setState({
				emailErr:false
			});
		}
		this.setState({
			dataSource: !value || value.indexOf('@') >0 ? [] : [
				`${value}@gmail.com`,
				`${value}@163.com`,
				`${value}@live.com`,
				`${value}@qq.com`,
				`${value}@hotmail.com`
			],
			email: value
		});
	}

	handlePhoneChange (e) {
		const value = e.target.value;
		const regxChina = regxTelephoneAndMobile.regxChina;
		const regxAustralia = regxTelephoneAndMobile.regxAustralia;
		if(regxChina.test(value) === true || regxAustralia.test(value) === true) {
			this.setState({
				phoneErr:false
			});
		} else {
			this.setState({
				phoneErr:true
			});
		}
		this.setState({
			phone: value
		});
	}

	handleSelectChange(e) {
		console.log(`${e}`);
	}


	handleNextPage(e) {
		return
	}

	handleSubmit(e) {
		this.setState({ submitted: true });
		const { name, email, phone, wechat, city, nameErr, wechatErr, emailErr, phoneErr } = this.state;
		const _application = {
			name,
			email,
			phone,
			wechat,
			city,
		};
		
		const { dispatch } = this.props;
		const isDispathch =
			name
			&& email
			&& phone
			&& wechat
			&& city
			&& !nameErr
			&& !wechatErr
			&& !emailErr
			&& !phoneErr;
		if (isDispathch) {
			dispatch(applicationActions.submit(_application));
		}else{
			this.setState({
				nameErr: nameErr || !name,
				wechatErr: wechatErr || !wechat,
				emailErr: emailErr || !email,
				phoneErr: phoneErr || !phone,
			});
		}
	}

	buildCityList(data) {
		if(data) {
			return data.map((item) => {
				return (
					<Select.Option key={item._id} value={item._id} >{item.name}</Select.Option>
				);
			});
		}
		
	}
	
	render() {
		// TODO: Royal Pay, Paypal, Debit Card/ Credit Card. Bank Transfer(Upload the screen shot), Bank infomation ask xiaohua
		const emailContent = <p style={styles.errorTextStyle}>请填写有效的邮箱地址<br />例如:<br />john.doe@jiangren.com</p>;
		const nameContent = <p style={styles.errorTextStyle}>请填写有效的姓名<br />例如:<br />John Doe<br />张三</p>;
		const wechatContent = <p style={styles.errorTextStyle}>请填写有效的微信号<br />例如:<br />jiangren_bne</p>;
		const phoneContent = <p style={styles.errorTextStyle}>请填写有效的电话号码<br />例如:<br />0412345678 或者<br />13900000000</p>;
		const{ cities } = this.props;
		let cityList = '';

		if(cities['data']) {
			cityList = this.buildCityList(cities['data']);
		}
		
		return (
			<div className="smartbook-application-container">
				<div className="input-group ppd-input-field" >
					<Tooltip title={nameContent} placement="right" visible={this.state.nameErr}>
						<Input 
							type="text" 
							className="form-control" 
							placeholder="你的名字*" 
							style={this.state.nameErr?styles.errorStyle:null} 
							value={this.state.name} 
							onChange={this.handleNameChange} 
							maxLength="20"
						/>	
					</Tooltip>
				</div>
				<div className="input-group ppd-input-field" >
					<Tooltip title={wechatContent} placement="right" visible={this.state.wechatErr}>
						<Input 
							type="text" 
							className="form-control" 
							placeholder="微信*"
							style={this.state.wechatErr?styles.errorStyle:null} 
							value={this.state.wechat} 
							onChange={this.handleWeChatChange} 
							maxLength="20"
						/>	
					</Tooltip>
				</div>
				<div className="input-group ppd-input-field" >
					<Tooltip title={emailContent} placement="right" visible={this.state.emailErr}>
						<AutoComplete dataSource={this.state.dataSource}  onChange={this.handleEmailChange} placeholder="你的Email*" maxLength="25"/>
					</Tooltip>
				</div>
				<div className="input-group ppd-input-field" >
					<Tooltip title={phoneContent} placement="right" visible={this.state.phoneErr}>
						<Input 
							type="text" 
							className="form-control" 
							placeholder="你的电话*" 
							style={this.state.phoneErr?styles.errorStyle:null} 
							value={this.state.phone} 
							onChange={this.handlePhoneChange} 
							maxLength="20"
						/>
					</Tooltip>
				</div>

				<div className="input-group ppd-input-field" >
					<Select placeholder="请选择所在城市*" onChange={this.handleCityChange}>
						{cityList}
					</Select>
				</div>
				<div className="text-center">
					<Button type="primary" className="button--primary__theme lg center inline" onClick={this.handleSubmit}>下一步</Button>
				</div>
			</div>
		);
	}
}



const mapStateToProps = (state) => {
	const { cities } = state;
	return{
		cities
	};
};

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


const connectedApplicationPage = connect(mapStateToProps)(ApplicationPage);
export { connectedApplicationPage as ApplicationPage }; 