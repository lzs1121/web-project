import React from 'react';
import { Radio, Checkbox } from 'antd';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { recommend, testing } from '../../utils/application/formExtend';
import {
	agreement,
	selectPaymentMethod,
	payNotice,
	royalpayValue,
	paypalValue,
	stripeValue,
	royalpayMethod,
	paypalMethod,
	stripeMethod,
	faceToFace
} from '../../utils/application/payMethod';
import PaymentRequestForm from '../stripe/PaymentRequestForm';
import JrAgreement from './jr-agreement';
const RadioGroup = Radio.Group;

export default class PaymentPage extends React.Component {
	render() {
		const {
			paypal,
			stripe,
			royalpay,
			payMethod,
			totalPrice,
			jrAgreementBox,
			stripePublicAPIKEY,
			checked,
			handleScroll,
			handleSubmit,
			confirmPrivacy,
			paymentDisplay,
			jrAgreementDisplay,
			agreementDisabled,
			radioDisabled,
			onPayMethodChannel,
			onChangeTransactionId
		} = this.props;
		return (
			<form className="jr-form">
				<div className="jr-pay-code">
					<div
						className="jr-agreement"
						ref={jrAgreementBox}
						onScroll={handleScroll}
						style={{
							display: jrAgreementDisplay
						}}
					>
						<JrAgreement />
					</div>
					<Checkbox
						id="agreement-check"
						onChange={confirmPrivacy}
						checked={checked}
						disabled={agreementDisabled}
					>
						{agreement}
					</Checkbox>
					<div
						className="payment-options"
						style={{
							display: paymentDisplay
						}}
					>
						<p>{selectPaymentMethod}</p>
						<p className="jr-pay-notice">{payNotice}</p>
						<div className="payment-option">
							<RadioGroup
								onChange={onPayMethodChannel}
								value={payMethod}
							>
								<Radio
									className="payment-option__content"
									value={faceToFace}
								>
									<div className="jr-radio-label">
										<p>
											{faceToFace}
											{recommend}
										</p>
									</div>
								</Radio>
								<Radio
									className="payment-option__content"
									value={royalpayValue}
									disabled={radioDisabled}
								>
									<div className="jr-radio-label">
										<p>{royalpayMethod}</p>
									</div>
									<div
										className="royalpay jr-pay-content"
										style={{
											display: royalpay
										}}
									>
										<img src="../images/royalpay.png" />
									</div>
								</Radio>
								<Radio
									className="payment-option__content"
									value={paypalValue}
									disabled={radioDisabled}
								>
									<div className="jr-radio-label">
										<p>
											{paypalMethod}
											{testing}
										</p>
									</div>
									<div
										className="paypal jr-pay-content"
										id="paypal-button"
										style={{
											display: paypal
										}}
									/>
								</Radio>
								<Radio
									className="payment-option__content"
									value={stripeValue}
									disabled={radioDisabled}
								>
									<div className="jr-radio-label">
										<p>
											{stripeMethod}
											{testing}
										</p>
									</div>
									<div
										className="stripe jr-pay-content"
										id="stripe-button"
										style={{
											display: stripe
										}}
									>
										<StripeProvider
											apiKey={stripePublicAPIKEY}
										>
											<div className="example">
												<Elements>
													<PaymentRequestForm
														totalPrice={totalPrice}
														handleSubmit={
															handleSubmit
														}
														onChangeTransactionId={
															onChangeTransactionId
														}
													/>
												</Elements>
											</div>
										</StripeProvider>
									</div>
								</Radio>
							</RadioGroup>
						</div>
					</div>
				</div>
			</form>
		);
	}
}
