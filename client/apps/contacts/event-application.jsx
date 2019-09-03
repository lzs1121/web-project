import React from 'react';
import {eventApplication} from '../../api';
import {Steps,Button, message,Icon,Radio,Input,Checkbox} from 'antd';


const Step = Steps.Step;
const RadioGroup = Radio.Group;
const radioStyle = {
	display: 'block',
	height: '30px',
	lineHeight: '30px',
};

export default class EventApplication extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			phone: '',
			wechat:'',
			university:'',
			major:'',
			degree:'',
			channel:'',
			payMethod:'',
			nameErr:'',
			emailErr:'',
			wechatErr:'',
			phoneErr:'',
			current:0,
			loading:false,
			checked: false,
			disabled:true,
		};
		this.steps = this.buildSteps();
		this.application ={};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChange=this.onChange.bind(this);
		this.onChangeChannel=this.onChangeChannel.bind(this);
		this.onPayMethodChannel=this.onPayMethodChannel.bind(this);
		this.handleInitialSubmit=this.handleInitialSubmit.bind(this);
		this.confirmPrivacy=this.confirmPrivacy.bind(this);
		this.prev=this.prev.bind(this);
		this.next=this.next.bind(this);
	}
handleChange(e) {
	this.setState({[e.target.name]: e.target.value});
}
onChange(e){
	this.setState({
		degree: e.target.value,
	});
}
onChangeChannel(e){
	this.setState({
		channel: e.target.value,
	}
	);
}
onPayMethodChannel(e){
	this.setState({
		payMethod: e.target.value,
	}
	);
}
confirmPrivacy(e){
	this.setState({
		checked: e.target.checked,
	}
	);
	if (this.state.checked==false){
		this.setState({
			disabled: false,
		}
		);
	};
	if (this.state.checked==true){
		this.setState({
			disabled: true,
		}
		);
	};
}
validate() {
	let isError = false;
	const regxPhone = /^(0\d)[\d]{8}$/;
	const regxEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (this.state.name ===""||this.state.name===null) {
		isError = true;
		this.setState({nameErr: "用户名不能为空"});
	} else {
		this.setState({nameErr:""});
	}
	if (regxEmail.test(this.state.email) == false) {
		isError = true;
		this.setState({emailErr: "请您填写正确的邮箱地址, 例如 example@abc.com"});
	} else {
		this.setState({emailErr:""});
	}
	if (this.state.wechat ===""||this.state.wechat===null) {
		isError = true;
		this.setState({wechatErr: "请填写您的微信号"});
	} else{
		this.setState({wechatErr:""});
	}
	if (this.state.phone ===""||regxPhone.test(this.state.phone) === false) {
		isError = true;
		this.setState({phoneErr: "请留下您的正确的联系方式, 例如：0412345678"});
	} else {
		this.setState({phoneErr: ""});
	}
	console.log(isError);
	return isError;
}
handleSubmit(e){
	e.preventDefault();
	const data = {
		name: this.state.name,
		email: this.state.email,
		phone: this.state.phone,
		wechat: this.state.wechat,
		university: this.state.university,
		degree:this.state.degree,
		major:this.state.major,
		channel:this.state.channel,
		payMethod:this.state.payMethod,
		};
	const err = this.validate();
	if (!err) {
		eventApplication.submit(data).then(item => {
			 if(item.status === 200) {
				 Object.assign(this.application, item.data);
				 }
		});
		this.next();
	}
}
prev(){
	const current = this.state.current - 1;
	this.setState({ current });
}
next(){
	const current = this.state.current + 1;
	this.setState({ current });
}
handleInitialSubmit(e){
	e.preventDefault();
	const err = this.validate();
	if (!err) {
		this.next();
	}
}
buildSteps(){
	return [{
		title:'第一步',
		content: ()=>{
			return(
				<form  className="contactForm jr-form">
					<p>姓名*</p>
					<div className="input-group ppd-input-field" >
						<input type="text"   placeholder="姓名" name="name" value={this.state.name} onChange={this.handleChange} maxLength="25" />
						<span className="form-validation">{this.state.nameErr}</span>
					</div>
					<p>微信号*</p>
					<div className="input-group ppd-input-field">
						<input type="text"   placeholder="微信号" name="wechat" value={this.state.wechat} onChange={this.handleChange} maxLength="25" />
						<span className='form-validation'>{this.state.wechatErr}</span>
					</div>
					<p>Email*</p>
					<div className="input-group ppd-input-field">
						<input type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" maxLength="25" />
						<span className="form-validation">{this.state.emailErr}</span>
					</div>
					<p>电话*</p>
					<div className="input-group ppd-input-field">
						<input type="text"   placeholder="电话" name="phone" value={this.state.phone} onChange={this.handleChange} maxLength="13" />
						<span className='form-validation'>{this.state.phoneErr}</span>
					</div>
				</form>
			);
		}
},{
		title:'第二步',
		content: ()=>{
			return(
				<form  className="contactForm jr-form">
					<p>填写学校</p>
					<div className="input-group ppd-input-field" >
						<input type="text"   placeholder="学校" name="university" value={this.state.university} onChange={this.handleChange} maxLength="25" />
					</div>
					<p>填写专业</p>
					<div className="input-group ppd-input-field">
						<input type="text"   placeholder="专业" name="major" value={this.state.major} onChange={this.handleChange} maxLength="25" />
					</div>
					<p>选择学位(单选)</p>
					<div className="jr-degree-options">
						<RadioGroup onChange={this.onChange} value={this.state.degree} >
							<Radio value={"本科"} name="本科">本科</Radio>
							<Radio value={"研究生"} name="研究生">研究生</Radio>
						</RadioGroup>
					</div>
					<p  className="jr-channel-options">你是通过什么渠道知道我们IT匠人的(单选)</p>
					<div>
						<RadioGroup onChange={this.onChangeChannel} value={this.state.channel} >
							<Radio style={radioStyle} value={"微信公众号"} className="jr-channel-option" >微信公众号</Radio>
							<Radio style={radioStyle} value={"微信群"} className="jr-channel-option" >微信群</Radio>
							<Radio style={radioStyle} value={"学生会"} className="jr-channel-option" >学生会</Radio>
							<Radio style={radioStyle} value={"Google"} className="jr-channel-option" >Google</Radio>
							<Radio style={radioStyle} value={"知乎"} className="jr-channel-option" >知乎</Radio>
							<Radio style={radioStyle} value={"微博"} className="jr-channel-option" >微博</Radio>
							<Radio style={radioStyle} value={"朋友"} className="jr-channel-option" >朋友</Radio>
							<Radio style={radioStyle} value={"海报"} className="jr-channel-option" >海报</Radio>
							<Radio style={radioStyle} value={"小蜜蜂"} className="jr-channel-option" >小蜜蜂</Radio>
							<Radio style={radioStyle} value={"贴吧"} className="jr-channel-option" >贴吧</Radio>
							<Radio style={radioStyle} value={""} className="jr-channel-option" >
								其他...
								<Input style={{ width: 100, marginLeft: 10, height:30 }} value={this.state.channel} onChange={this.onChangeChannel}/> 
							</Radio>
						</RadioGroup>
					</div>
				</form>);
		}	
},{
		title:'付款',
		content: ()=>{
			return(
				<div className="jr-pay-code">
					<p>请选择付款方式以完成付款</p>
					<p className="jr-pay-notice">付款成功后请截图发给匠人客服</p>
					<div className="row">
						<RadioGroup onChange={this.onPayMethodChannel} value={this.state.payMethod} >
							<Radio className="jr-scan-code" value="Royalpay" >
								<div className="jr-scan-code-content">
									<p>扫描RoyalPay二维码</p>
									<img src="../images/royalpay.png"></img>	
								</div>
							</Radio>
							<Radio className="jr-Paypal-option" value="paypal">
								<Button className="pay-btn" type="primary" href="https://www.paypal.me/jracademy" target="_blank" htmlType="submit" >Paypal</Button>
							</Radio>
							<Radio className="jr-faceToFace-pay" value="面付" >
								<p>当面付款</p>
							</Radio>
						</RadioGroup>
					</div>
					<Checkbox onChange={this.confirmPrivacy} checked={this.state.checked}>我已经阅读并同意服务与隐私条款.</Checkbox>
				</div>
				
				
			);
		}	
},{
		title:'完成',
		content: ()=>{
			const compleStyle ={
				color: '#fb325c',
				fontSize: '35px'
			}
			return(
				<div className="text-center eventApplication-complete">
						<Icon type="check-circle" style={compleStyle}/>
						<h3>感谢你对我们的信任</h3>
						<p> 报名确认信已发送至邮箱，你也可以扫码添加匠人小花的微信咨询哦</p>
						<img className="eventApplication-contact" src="/images/xiaohua.jpeg" alt="匠人小花"/>
				</div>
			);
		}	
}]
}
	render(){
		const { current } = this.state;
		return (
			<div>
				<Steps current={current} className="jr-step-title">
					{this.steps.map(item => <Step key={item.title} title={item.title} />)}
				</Steps>
				<div className="steps-content jr-step-content">{this.steps[current].content()}</div>
				<div className="steps-action jr-step-buttons">
					{
						current > 0 && current < this.steps.length - 1
						&& (
						<Button onClick={() => this.prev()}>
							上一步
						</Button>
						)
					}
					{
						current < this.steps.length - 2
						&& <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleInitialSubmit}>下一步</Button>
					}
					{
						current === this.steps.length - 2
						&& <Button type="primary" style={{ marginLeft: 8}} htmlType="submit"  disabled={this.state.disabled} onClick={this.handleSubmit} >完成</Button>
					}  
				</div>
			</div>
			); 
		}
	}
