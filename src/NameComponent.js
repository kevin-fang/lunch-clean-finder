import React from 'react'
import { Redirect } from 'react-router-dom'
import { GetJobByName, GetDatesByName } from './Api.js'
require('./util.js')

export class NameFormComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			first: "",
			last: "",
			redirect: false
		}
		this.submit = this.submit.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
	}

	submit() {
		this.setState({redirect: true})
	}

	handleKeyPress(e) {
		if (e.key === 'Enter') {
			if (this.state.first !== "" && this.state.last !== "") {
				this.submit()
			} else {
				alert("Please fill in the first & last name before entering")
			}
		}
	}

	render() {
		if (this.state.redirect === true) {  
			return <Redirect push to={`/name/${this.state.first}/${this.state.last}`} />;
		}
		return (
			<div>
				<input placeholder="First Name" onChange={(event) => {this.setState({first: event.target.value})}} /><br/>
				<input placeholder="Last Name" onKeyPress={this.handleKeyPress} onChange={(event) => {this.setState({last: event.target.value})}} /><br/>
				<button onClick={this.submit}>Submit</button>
			</div>
		)
	}  
}

export class NameDisplayComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: {
				first: props.match.params.first.nameify(),
				last: props.match.params.last.nameify()
			},
			job: null,
			days: null,
			error: ""
		}
		this.getDayDisplay = this.getDayDisplay.bind(this)
	}

	componentDidMount() {
		GetJobByName(this.state.name, (response, err) => {
			if (err) {
				alert("An error occured")
				this.setState({error: "An error occured."})
			} else if (response === "") {
				alert("Name not found.")
				this.setState({error: "Name not found."})
			} else {
				this.setState({job: response})
			}
		}) 
		/*
		GetDatesByName(this.state.name, (res, err) => {
			if (err) alert(err)
			this.setState({job: res.team, days: res.days})
		})*/
	}

	getDayDisplay() {
		if (this.state.job) {
			return (
				<div>
					{
						this.state.error !== "" ? this.state.error : 
						<div>
							{this.state.job.job !== "N/A"  && <div>Job: {this.state.job.job}<br/></div>}
							{this.state.job.team !== "N/A"  && <div>Team: {this.state.job.team}<br/></div>}
							{this.state.job.day !== "N/A" && <div>Weekday: {this.state.job.day}<br/></div>}
						</div>
					}
				</div>
			)
		} else {
			return null
		}
	}

	render() {
		return (
			<div>
				First name: {this.state.name.first}<br/>
				Last name: {this.state.name.last}<br/><br/>
				{this.getDayDisplay()}
			</div>
		)
	}
}