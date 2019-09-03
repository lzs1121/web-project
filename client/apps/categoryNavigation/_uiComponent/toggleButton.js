import React from 'react';
export default function ToggleButton(props) {
	return(
		<button className={props.btnClassname} onClick={(event)=>{
			event.preventDefault();
			props.onClick();
		}}>
			<div className='toggle-button__line'/>
			<div className='toggle-button__line'/>
			<div className='toggle-button__line'/>
		</button>
	);
}