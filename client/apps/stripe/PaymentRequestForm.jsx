import React from 'react';
import {
	injectStripe,
	PaymentRequestButtonElement
} from 'react-stripe-elements';
import { payment } from '../../api';

class PaymentRequestForm extends React.Component {
	constructor(props) {
		super(props);
		const price = this.props.totalPrice * 100;
		const handleSubmit = () => this.props.handleSubmit();
		const onChangeTransactionId = val =>
			this.props.onChangeTransactionId(val);
		const paymentRequest = props.stripe.paymentRequest({
			country: 'AU',
			currency: 'aud',
			total: {
				label: 'Price total',
				amount: price
			}
		});

		paymentRequest.on('token', ({ complete, token, ...data }) => {
			const chargeInfo = {
				amount: price,
				source: token.id,
				currency: 'aud'
			};
			payment.submit(chargeInfo).then(item => {
				onChangeTransactionId(item.id);
				handleSubmit();
			});
			complete('success');
		});

		paymentRequest.canMakePayment().then(result => {
			this.setState({ canMakePayment: !!result });
		});

		this.state = {
			canMakePayment: false,
			paymentRequest
		};
	}

	render() {
		return this.state.canMakePayment ? (
			<PaymentRequestButtonElement
				paymentRequest={this.state.paymentRequest}
				className="PaymentRequestButton"
				style={{
					// For more details on how to style the Payment Request Button, see:
					// https://stripe.com/docs/elements/payment-request-button#styling-the-element
					paymentRequestButton: {
						theme: 'light',
						height: '64px'
					}
				}}
			/>
		) : null;
	}
}
export default injectStripe(PaymentRequestForm);
