import React from "react"




export default function Scrollable(props: { 
	children?: any, 
	padding: string 
}): JSX.Element {
	const inner: React.CSSProperties = {
		padding: props.padding
	}

	const outer: React.CSSProperties = {
		overflowY: "auto"
	}

	return (
		<div style={outer}>
			<div style={inner}>
				{props.children}
			</div>
		</div>
	)
}