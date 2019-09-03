import React from 'react';
import { workshopApplication } from '../../api';
import { Steps, Button, Icon } from 'antd';
import ApplicantInfo from './applicantInfo';
import ExtendInfo from './extendInfo';
import PaymentPage from './paymentPage';
import { regxEmail, regxOzPhone } from '../../utils/regex';
import { faceToFace, royalpayValue } from '../../utils/application/payMethod';
import {
	firstStep,
	secondStep,
	paymentStep,
	complete,
	prevStep,
	nextStep,
	thankLetterTitle,
	thankLetterContent,
	xiaohua
} from '../../utils/application/formLabel';
import {
	nameNullError,
	emailInvalidError,
	wechatNullError,
	phoneInvalidError
} from '../../utils/application/error';
const Step = Steps.Step;
let stripePublicAPIKEY = '';
export default class WorkshopApplication extends React.Component {
	constructor(props) {
		super(props);
		this.jrAgreementBox = React.createRef();
		this.state = {
			applicant: {
				degree: '',
				email: '',
				name: '',
				phone: '',
				wechat: '',
				major: '',
				channel: ''
			},
			workshopInfo: {
				workshop: {},
				university: '',
				city: {},
				tutor: {},
				course: {},
				unitPrice: '',
				unit: '',
				tutoringLength: '',
				packagePrice: '',
				totalPrice: '',
				address: '',
				startDate: ''
			},
			payment: {
				payMethod: '',
				paymentTransactionId: ''
			},
			error: {
				nameErr: '',
				emailErr: '',
				wechatErr: '',
				phoneErr: ''
			},
			paymentOptionDisplay: {
				royalpay: 'none',
				paypal: 'none',
				stripe: 'none'
			},
			current: 0,
			loading: false,
			checked: false,
			disabled: true,
			radioDisabled: false,
			agreementDisabled: true,
			paymentDisplay: 'none',
			jrAgreementDisplay: 'block',
			isFaceToFace: false
		};
		this.steps = this.buildSteps();
		this.application = {};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChangeDegree = this.onChangeDegree.bind(this);
		this.onChangeChannel = this.onChangeChannel.bind(this);
		this.onPayMethodChannel = this.onPayMethodChannel.bind(this);
		this.onChangeTransactionId = this.onChangeTransactionId.bind(this);
		this.handleInitialSubmit = this.handleInitialSubmit.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.confirmPrivacy = this.confirmPrivacy.bind(this);
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
	}

	componentDidMount() {
		workshopApplication.getWorkshop().then(item => {
			if (item.workshop) {
				stripePublicAPIKEY = item.stripePublicAPIKEY;
				const workshop = this.state.workshopInfo;
				workshop['workshop'] = item.workshop._id;
				workshop['city'] = item.workshop.city;
				workshop['tutor'] = item.workshop.tutor;
				workshop['course'] = item.workshop.course;
				workshop['unitPrice'] = item.workshop.unitPrice;
				workshop['unit'] = item.workshop.unit;
				workshop['tutoringLength'] = item.workshop.tutoringLength;
				workshop['totalPrice'] = item.workshop.totalPrice;
				workshop['packagePrice'] = item.workshop.packagePrice;
				workshop['startDate'] = item.workshop.startDate;
				workshop['address'] = item.workshop.place;
				workshop['university'] = item.workshop.university;
				this.setState({
					workshopInfo: workshop
				});
			}
		});
	}
	handleChange(e) {
		const applicant = this.state.applicant;
		const targetName = e.target.name;
		applicant[targetName] = e.target.value;
		this.setState({
			applicant: applicant
		});
	}
	handleScroll() {
		const jrAgreementBox = this.jrAgreementBox.current;
		this.setState({
			agreementDisabled: !(
				jrAgreementBox.scrollTop + jrAgreementBox.clientHeight >=
				jrAgreementBox.scrollHeight
			)
		});
	}
	onChangeDegree(e) {
		const applicant = this.state.applicant;
		applicant['degree'] = e.target.value;
		this.setState({
			applicant: applicant
		});
	}
	onChangeChannel(e) {
		const applicant = this.state.applicant;
		applicant['channel'] = e.target.value;
		this.setState({
			applicant: applicant
		});
	}
	onChangeTransactionId(val) {
		const payment = this.state.payment;
		payment['paymentTransactionId'] = val;
		this.setState({
			payment: payment
		});
	}
	onPayMethodChannel(e) {
		const paymentOptionDisplay = this.state.paymentOptionDisplay;
		const payment = this.state.payment;
		payment['payMethod'] = e.target.value;
		paymentOptionDisplay['royalpay'] = 'none';
		paymentOptionDisplay['paypal'] = 'none';
		paymentOptionDisplay['stripe'] = 'none';
		paymentOptionDisplay[e.target.value] = 'block';
		this.setState({ payment: payment });
		this.setState({
			disabled: !(
				e.target.value === faceToFace ||
				e.target.value === royalpayValue
			)
		});
		this.setState({ isFaceToFace: e.target.value === faceToFace });
		this.setState({ paymentOptionDisplay: paymentOptionDisplay });
	}
	confirmPrivacy(e) {
		const paymentOptionDisplay = this.state.paymentOptionDisplay;
		this.setState({
			checked: e.target.checked
		});
		if (this.state.checked == false) {
			this.setState({
				agreementDisabled: true,
				paymentDisplay: 'block',
				jrAgreementDisplay: 'none'
			});
			const price = this.state.workshopInfo.totalPrice;
			if (!price) {
				this.setState({
					radioDisabled: true
				});
			}
			const handleSubmit = () => this.handleSubmit();
			const onChangeTransactionId = val =>
				this.onChangeTransactionId(val);
			paypal
				.Buttons({
					createOrder: (data, actions) => {
						return actions.order.create({
							purchase_units: [
								{
									amount: {
										value: price
									}
								}
							]
						});
					},
					onApprove: (data, actions) => {
						return actions.order.capture().then(function(details) {
							onChangeTransactionId(
								details.purchase_units[0].payments.captures[0]
									.id
							);
							handleSubmit();
						});
					}
				})
				.render('#paypal-button');
			paymentOptionDisplay['paypal'] = 'none';
			this.setState({
				paymentOptionDisplay: paymentOptionDisplay
			});
		}
		if (this.state.checked == true) {
			this.setState({
				disabled: true
			});
		}
	}
	validate() {
		let isError = false;
		const applicant = this.state.applicant;
		const error = this.state.error;
		if (applicant.name === '' || applicant.name === null) {
			isError = true;
			error['nameErr'] = nameNullError;
		} else {
			error['nameErr'] = '';
		}
		if (regxEmail.test(applicant.email) == false) {
			isError = true;
			error['emailErr'] = emailInvalidError;
		} else {
			error['emailErr'] = '';
		}
		if (applicant.wechat === '' || applicant.wechat === null) {
			isError = true;
			error['wechatErr'] = wechatNullError;
		} else {
			error['wechatErr'] = '';
		}
		if (
			applicant.phone === '' ||
			regxOzPhone.test(applicant.phone) === false
		) {
			isError = true;
			error['phoneErr'] = phoneInvalidError;
		} else {
			error['phoneErr'] = '';
		}
		this.setState({
			error: error
		});
		return isError;
	}
	handleSubmit() {
		const applicant = this.state.applicant;
		const workshopInfo = this.state.workshopInfo;
		const payment = this.state.payment;
		const data = {
			name: applicant.name,
			email: applicant.email,
			phone: applicant.phone,
			wechat: applicant.wechat,
			degree: applicant.degree,
			major: applicant.major,
			wayKnowUs: applicant.channel,
			workshop: workshopInfo.workshop,
			university: workshopInfo.university,
			city: workshopInfo.city,
			tutor: workshopInfo.tutor,
			course: workshopInfo.course,
			address: workshopInfo.address,
			startedDate: workshopInfo.startDate,
			totalPrice: workshopInfo.totalPrice,
			unitPrice: workshopInfo.unitPrice,
			tutoringLength: workshopInfo.tutoringLength,
			unit: workshopInfo.unit,
			packagePrice: workshopInfo.packagePrice,
			payMethod: payment.payMethod,
			paymentTransactionId: payment.paymentTransactionId,
			isFaceToFace: this.state.isFaceToFace
		};
		const err = this.validate();
		if (!err) {
			workshopApplication.submit(data).then(item => {
				if (item.status === 200) {
					Object.assign(this.application, item.data);
				}
			});
			this.next();
		}
	}
	prev() {
		const current = this.state.current - 1;
		this.setState({ current });
	}
	next() {
		const current = this.state.current + 1;
		this.setState({ current });
	}
	handleInitialSubmit(e) {
		e.preventDefault();
		const err = this.validate();
		if (!err) {
			this.next();
		}
	}

	buildSteps() {
		return [
			{
				title: firstStep,
				content: () => {
					return (
						<ApplicantInfo
							name={this.state.applicant.name}
							wechat={this.state.applicant.wechat}
							email={this.state.applicant.email}
							phone={this.state.applicant.phone}
							nameErr={this.state.error.nameErr}
							wechatErr={this.state.error.wechatErr}
							emailErr={this.state.error.emailErr}
							phoneErr={this.state.error.phoneErr}
							handleChange={this.handleChange}
						/>
					);
				}
			},
			{
				title: secondStep,
				content: () => {
					return (
						<ExtendInfo
							major={this.state.applicant.major}
							degree={this.state.applicant.degree}
							channel={this.state.applicant.channel}
							handleChange={this.handleChange}
							onChangeDegree={this.onChangeDegree}
							onChangeChannel={this.onChangeChannel}
						/>
					);
				}
			},
			{
				title: paymentStep,
				content: () => {
					return (
						<PaymentPage
							jrAgreementBox={this.jrAgreementBox}
							handleScroll={this.handleScroll}
							jrAgreementDisplay={this.state.jrAgreementDisplay}
							confirmPrivacy={this.confirmPrivacy}
							checked={this.state.checked}
							agreementDisabled={this.state.agreementDisabled}
							paymentDisplay={this.state.paymentDisplay}
							onPayMethodChannel={this.onPayMethodChannel}
							payMethod={this.state.payment.payMethod}
							royalpay={this.state.paymentOptionDisplay.royalpay}
							paypal={this.state.paymentOptionDisplay.paypal}
							stripe={this.state.paymentOptionDisplay.stripe}
							stripePublicAPIKEY={stripePublicAPIKEY}
							totalPrice={this.state.workshopInfo.totalPrice}
							radioDisabled={this.state.radioDisabled}
							onChangeTransactionId={this.onChangeTransactionId}
							handleSubmit={this.handleSubmit}
						/>
					);
				}
			},
			{
				title: complete,
				content: () => {
					const compleStyle = {
						color: '#fb325c',
						fontSize: '35px'
					};
					return (
						<div className="text-center eventApplication-complete">
							<Icon type="check-circle" style={compleStyle} />
							<h3>{thankLetterTitle}</h3>
							<p>{thankLetterContent}</p>
							<img
								className="eventApplication-contact"
								src="/images/xiaohua.jpeg"
								alt={xiaohua}
							/>
						</div>
					);
				}
			}
		];
	}
	render() {
		const { current } = this.state;
		return (
			<div>
				<Steps current={current} className="jr-step-title">
					{this.steps.map(item => (
						<Step key={item.title} title={item.title} />
					))}
				</Steps>
				<div className="steps-content jr-step-content">
					{this.steps[current].content()}
				</div>
				<div className="steps-action jr-step-buttons">
					{current > 0 && current < this.steps.length - 1 && (
						<Button onClick={() => this.prev()}>{prevStep}</Button>
					)}
					{current < this.steps.length - 2 && (
						<Button
							type="primary"
							style={{ marginLeft: 8 }}
							onClick={this.handleInitialSubmit}
						>
							{nextStep}
						</Button>
					)}
					{current === this.steps.length - 2 && (
						<Button
							type="primary"
							ßhtmltype="submit"
							className="complete-button"
							disabled={this.state.disabled}
							onClick={this.handleSubmit}
						>
							{complete}
						</Button>
					)}
				</div>
			</div>
		);
	}
}
