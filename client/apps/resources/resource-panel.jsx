import React from 'react';
import ResourceCard from './resource-card';

export default class ResourcePanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			resources: JSON.parse(props.data),
		};
	}

	render() {
		return (
			<div className="row">
				{this.state.resources.slice(0,this.state.resources.length).map((resource) => (
					<ResourceCard key={resource._id} data={resource}/>
				))}
			</div>
		);
	}
}