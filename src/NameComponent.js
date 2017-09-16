import React from 'react'
import { Redirect } from 'react-router-dom'
import { GetJobByName, GetDatesByTeam } from './Api.js'

// material-ui stuff
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

require('./util.js')

export class NameFormComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			first: "",
			last: "",
			redirect: false,
			canSubmit: false
		}
		this.submit = this.submit.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.updateEnabled = this.updateEnabled.bind(this)
	}

	submit() {
		this.setState({redirect: true})
	}

	updateEnabled() {
		var nameValidation = /^([a-z]|-)+([a-z]+)$/i // regex validation of name, including alphabet and hyphens
		if (nameValidation.test(this.state.first) && nameValidation.test(this.state.last)) {
			this.setState({canSubmit: true})
		} else {
			this.setState({canSubmit: false})
		}
	}

	handleKeyPress(e) {
		if (e.key === 'Enter') {
			if (this.state.canSubmit) {
				this.submit()
			}
		}
	}

	render() {
		if (this.state.redirect === true) {  
			return <Redirect push to={`/name/${this.state.first}/${this.state.last}`} />;
		}
		return (
			<div>
				<TextField hintText='First Name'
					value={this.state.first}
					autoFocus={true}
					onChange={event => {
						this.setState({first: event.target.value}, () => {
							this.updateEnabled()
						})
					}}/>
				<br/>
				<TextField hintText='Last Name' 
					onKeyPress={this.handleKeyPress} 
					onChange={(event) => {
						this.setState({last: event.target.value}, () => {
							this.updateEnabled()
						})
					}}/>
				<br/>
				<RaisedButton 
					onClick={this.submit} 
					disabled={!this.state.canSubmit}
					label="Check Jobs" 
					secondary={true} />
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
			error: "",
			response: null,
			notLunchClean: false
		}
		this.getDayDisplay = this.getDayDisplay.bind(this)
		this.updateDates = this.updateDates.bind(this)
		this.makeTable = this.makeTable.bind(this)
	}

	componentDidMount() {
		GetJobByName(this.state.name, (response, err) => {
			if (err) {
				alert(err)
				this.setState({error: "An error occured."})
			} else if (response === "") {
				alert("Name not found.")
				this.setState({error: "Name not found."})
			} else {
				this.setState({job: response}, this.updateDates)
			}
		}) 
	}

	updateDates() {
		var team = this.state.job.team.slice(0)
		var day = this.state.job.day

		GetDatesByTeam(day, team, (res, err) => {
            if (err) {
                this.setState({notLunchClean: true, response: {error: true}})
            } else {
                this.setState({response: res})
            }
        })
	}

	getDayDisplay() {
		if (this.state.job) {
			return (
				<div>
					{
						this.state.error !== "" ? this.state.error : 
						<div>
							{this.state.job.job !== "N/A"  && <div style={{fontSize: 18}}>Job: {this.state.job.job}<br/></div>}
							{this.state.job.team !== "N/A"  && <div style={{fontSize: 18}}>Team: {this.state.job.team} on {this.state.job.day}<br/></div>}
							{(this.state.job.day !== "N/A" && !(this.state.job.team !== "N/A")) && <div style={{fontSize: 18}}>Day: {this.state.job.day}<br/></div>}
						</div>
					}
				</div>
			)
		} else {
			return (
				<div>
					Loading job...
				</div>
			)
		}
	}

	makeTable(days) {
		return(
			<Table>
				<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
						<TableHeaderColumn>Date</TableHeaderColumn>
						<TableHeaderColumn>Weekday</TableHeaderColumn>
						<TableHeaderColumn>Team</TableHeaderColumn>
						<TableHeaderColumn>Notes</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody displayRowCheckbox={false}>
					{
						days.filter(day => {
							return new Date(day.date) > new Date()
						}).map(day => {
							return (
								<TableRow>
									<TableRowColumn>{day.date}</TableRowColumn>
									<TableRowColumn>{day.weekday}</TableRowColumn>
									<TableRowColumn>{day.team}</TableRowColumn>
									<TableRowColumn>{day.notes}</TableRowColumn>
								</TableRow>
							)
						})
					}
				</TableBody>
			</Table>
		)
	}

	render() {
		return (
			<div> 
				<div style={{fontSize: 36}}>Welcome, {this.state.name.first + " " + this.state.name.last}</div><br/>
				{this.getDayDisplay()}
				{this.state.response 
                    ?   this.state.notLunchClean === false
						? 	this.makeTable(this.state.response.days)
						: null
                    : "Loading job dates..."}
			</div>
		)
	}
}