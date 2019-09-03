import React from 'react';
import { resourceRequest } from '../../api';
import { Card, Form, Collapse, Button, message, Icon, Input, Row, Col } from 'antd';
import { regxEmail } from '../../utils/regex';
const urlConfig = require('../../../config/url-config.json');

export default class ResourceCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curResource: props.data,
			email: '',
			emailErr: '',
			isLoading: false,
			checked: false,
			disabled: false,
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	validate() {
		let isError = false;

		if (regxEmail.test(this.state.email) == false) {
			isError = true;
			this.setState({ emailErr: '请您填写正确的邮箱地址, 例如 example@abc.com' });
		} else {
			this.setState({ emailErr: '' });
		}
		return isError;
	}

	handleSubmit(e) {
		this.setState({ isLoading: true });
		e.preventDefault();
		const data = {
			targetResource: this.state.curResource._id,
			resourceName: this.state.curResource.name,
			resourceLink: urlConfig.s3Url + this.state.curResource.uploadResource.filename,
			email: this.state.email,
		};
		const err = this.validate();
		if (!err) {
			resourceRequest.submit(data).then(item => {
				if (item.status === 200) {
					return true;
				}
			});
			message.success('资料发送成功');
		}
		this.setState({ isLoading: false });
	}

	render() {
		const Panel = Collapse.Panel;
		const FormItem = Form.Item;
		const cardHeadInline = {
			fontSize: 18,
			borderBottomWidth: 0,
			color: '#4e007a',
			marginTop: 0,
			paddingBottom: 0,
		};
		const cardStyle = {
			marginTop: 16
		};
		const inputWrapperStyle = {
			margin: 'auto',
			marginBottom: 5,
			width: '100%',
		};
		const inputStyle = {
			backgroundColor: '#ebeef0',
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: '#cfd8dc',
			verticalAlign: 'middle',
			margin: 'auto',
			width: '100%',
		};
		const buttonWrapperStyle = {
			margin: 'auto',
			horizontalAlign: 'right',
			width: '100%',
			textAlign: 'right'
		};
		const buttonStyle = {
			backgroundColor: '#4e007a',
			borderColor: '#4e007a',
			borderRadius: 5,
			margin: 'auto',
			width: '100%',
			horizontalAlign: 'right',
		};
		const inputWrapperControlStyle = {
			style: { width: '100%' }
		};
		const buttonWrapperControlStyle = {
		};

		return (
			<div className="col-12 col-sm-6 col-md-6">
				<Card className="resource-card"
					style={cardStyle} headStyle={cardHeadInline}>
					<Collapse bordered={false} defaultActiveKey={['1']} className="resource-card" >
						<Panel showArrow={false}
							header={<h5><Icon type="file-text" />{this.state.curResource.name}<Icon type="download" /></h5>}>
							<p>{this.state.curResource.description}</p>
							<Form layout="inline" onSubmit={this.handleSubmit}>
								<Row gutter={8}>
									<Col sm={{ span: 24 }} span={16}  >
										<FormItem style={inputWrapperStyle} wrapperCol={inputWrapperControlStyle}>
											<input type="text" name="email" value={this.state.email} onChange={this.handleChange}
												placeholder="输入你的email，下载资料" maxLength="30" style={inputStyle} />
										</FormItem>
									</Col>
									<Col sm={{ span: 24 }} span={8} >
										<FormItem style={buttonWrapperStyle} wrapperCol={buttonWrapperControlStyle}>
											<Button type="primary" size="large" loading={this.state.isLoading}
												onClick={this.handleSubmit} style={buttonStyle} >获取资源</Button>
										</FormItem>
									</Col>
								</Row>
							</Form>
							<span className="form-validation">{this.state.emailErr}</span>
						</Panel>
					</Collapse>
				</Card>
			</div>
		);
	}
}