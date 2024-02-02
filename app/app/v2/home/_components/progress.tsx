import React from "react"

export default function Progress(props: { progress: number }): JSX.Element {
	const progressStr = props.progress > 0 ? `${props.progress}%` : ""
	return (
		<div className="progress-container" style={containerStyles}>
			<div className="progress-value" style={{...valueStyles,width: `${props.progress}%`}} />
		</div>
	)
}

const containerStyles: React.CSSProperties = {
	width: "100%",
	// backgroundColor: "darkgray",
	border: "2px solid #333333",
	borderRadius: "12px",
	height: "1rem"
}

const valueStyles: React.CSSProperties = {
	// backgroundColor: "orange",
	backgroundImage: "linear-gradient(90deg, #81fbb8, #28c76f)",
	borderRadius: "9px",
	textAlign: "center",
	color: "white",
	transition: "width 0.1s",
	height: "100%"
}