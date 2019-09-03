import React from 'react';
import {
	userName,
	userWechat,
	userEmail,
	userPhone
} from '../../utils/application/formLabel';
import { required } from '../../utils/application/formExtend';

export default class ApplicantInfo extends React.Component {
	render() {
		const {
			name,
			wechat,
			email,
			phone,
			nameErr,
			wechatErr,
			emailErr,
			phoneErr,
			handleChange
		} = this.props;
		return (
			<form className="jr-form">
				<p>{userName}{required}</p>
				<div className="input-group ppd-input-field">
					<input
						type="text"
						placeholder={userName}
						name="name"
						value={name}
						onChange={handleChange}
						maxLength="25"
					/>
					<span className="form-validation">{nameErr}</span>
				</div>
				<p>{userWechat}{required}</p>
				<div className="input-group ppd-input-field">
					<input
						type="text"
						placeholder={userWechat}
						name="wechat"
						value={wechat}
						onChange={handleChange}
						maxLength="25"
					/>
					<span className="form-validation">{wechatErr}</span>
				</div>
				<p>{userEmail}{required}</p>
				<div className="input-group ppd-input-field">
					<input
						type="text"
						name="email"
						value={email}
						onChange={handleChange}
						placeholder={userEmail}
						maxLength="25"
					/>
					<span className="form-validation">{emailErr}</span>
				</div>
				<p>{userPhone}{required}</p>
				<div className="input-group ppd-input-field">
					<input
						type="text"
						placeholder={userPhone}
						name="phone"
						value={phone}
						onChange={handleChange}
						maxLength="13"
					/>
					<span className="form-validation">{phoneErr}</span>
				</div>
			</form>
		);
	}
}
