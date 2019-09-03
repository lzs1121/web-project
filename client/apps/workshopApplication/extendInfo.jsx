import React from 'react';
import { Radio, Input } from 'antd';
import { userMajor, userDegree, bachelor, master } from '../../utils/application/formLabel';
import {
	channelQuestion,
	wechatOfficialAccounts,
	wechatGroup,
	studentUnion,
	google,
	zhihu,
	weblog,
	friends,
	poster,
	bee,
	forum,
	others
} from '../../utils/application/channel';
import { singleChoice } from '../../utils/application/formExtend';

const RadioGroup = Radio.Group;

export default class ExtendInfo extends React.Component {
	render() {
		const {
			major,
			degree,
			channel,
			handleChange,
			onChangeDegree,
			onChangeChannel
		} = this.props;
		return (
			<form className="jr-form">
				<p>{userMajor}</p>
				<div className="input-group ppd-input-field">
					<input
						type="text"
						placeholder={userMajor}
						name="major"
						value={major}
						onChange={handleChange}
						maxLength="25"
					/>
				</div>
				<p>
					{userDegree}
					{singleChoice}
				</p>
				<div className="jr-degree-options">
					<RadioGroup onChange={onChangeDegree} value={degree}>
						<Radio value={bachelor} name={bachelor}>
							{bachelor}
						</Radio>
						<Radio value={master} name={master}>
							{master}
						</Radio>
					</RadioGroup>
				</div>
				<p className="jr-channel-options">
					{channelQuestion}
					{singleChoice}
				</p>
				<div>
					<RadioGroup onChange={onChangeChannel} value={channel}>
						<Radio
							value={wechatOfficialAccounts}
							className="jr-channel-option"
						>
							{wechatOfficialAccounts}
						</Radio>
						<Radio
							value={wechatGroup}
							className="jr-channel-option"
						>
							{wechatGroup}
						</Radio>
						<Radio
							value={studentUnion}
							className="jr-channel-option"
						>
							{studentUnion}
						</Radio>
						<Radio value={google} className="jr-channel-option">
							{google}
						</Radio>
						<Radio value={zhihu} className="jr-channel-option">
							{zhihu}
						</Radio>
						<Radio value={weblog} className="jr-channel-option">
							{weblog}
						</Radio>
						<Radio value={friends} className="jr-channel-option">
							{friends}
						</Radio>
						<Radio value={poster} className="jr-channel-option">
							{poster}
						</Radio>
						<Radio value={bee} className="jr-channel-option">
							{bee}
						</Radio>
						<Radio value={forum} className="jr-channel-option">
							{forum}
						</Radio>
						<Radio value={''} className="jr-channel-option">
							{others}
							<Input value={channel} onChange={onChangeChannel} />
						</Radio>
					</RadioGroup>
				</div>
			</form>
		);
	}
}
