import React from 'react'
import { Redirect } from 'react-router-dom'
import { GetJobByName, GetDatesByTeam } from './Api.js'

// material-ui imports
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'

require('./util.js')
var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Satruday"]

// Form that takes name as input and submits it, redirecting to the NameDisplayComponent
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

	// submit by telling the page to redirect with the state
	submit() {this.setState({redirect: true})}

	// update whether the submit button is enabled
	updateEnabled() {
		var nameValidation = /^([a-z]|-)+([a-z]+)$/i // regex validation of name, including alphabet and hyphens
		if (nameValidation.test(this.state.first) && nameValidation.test(this.state.last)) {
			this.setState({canSubmit: true})
		} else {
			this.setState({canSubmit: false})
		}
	}

	// handle enter key submit
	handleKeyPress(e) {
		if (e.key === 'Enter') {
			if (this.state.canSubmit) {
				this.submit()
			}
		}
	}

	render() {
		// redirect to the state that was created by the text fields
		if (this.state.redirect === true) {  
			return <Redirect push to={`/name/${this.state.first}/${this.state.last}`} />;
		}
		return (
			<div style={{padding: 20}}>
				<div>
					{/* First name */}
					<TextField hintText='First Name'
						value={this.state.first}
						autoFocus={true}
						style={{marginRight: 8}}
						onChange={event => {
							this.setState({first: event.target.value}, () => {
								this.updateEnabled()
							})
						}}/>
					{/* Last name */}
					<TextField hintText='Last Name' 
						onKeyPress={this.handleKeyPress} 
						onChange={(event) => {
							this.setState({last: event.target.value}, () => {
								this.updateEnabled()
							})
						}}/>
				</div>
				<br/>
				{/* Submit button */}
				<RaisedButton 
					onClick={this.submit} 
					disabled={!this.state.canSubmit}
					label="Check Jobs" 
					secondary={true} />
			</div>
		)
	}  
}

// Name display component that reads params and calls the API
export class NameDisplayComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: {
				first: props.match.params.first.nameify(),
				last: props.match.params.last.nameify()
			},
			job: null,
			error: "",
			response: null,
			workingToday: false,
			notLunchClean: false
		}
		this.getDayDisplay = this.getDayDisplay.bind(this)
		this.updateDates = this.updateDates.bind(this)
		this.makeTable = this.makeTable.bind(this)
		this.getJobDates = this.getJobDates.bind(this)
		this.getWorkingTodayDisplay = this.getWorkingTodayDisplay.bind(this)
	}

	componentDidMount() {
		// search for the job by a person upon opening
		GetJobByName(this.state.name, (response, err) => {
			if (err) {
				//alert(err)
				this.setState({error: "An error occured."})
			} else if (response === "") {
				//alert("Name not found.")
				this.setState({error: "Name not found."})
			} else {
				this.setState({job: response}, this.updateDates)
			}
		}) 
	}

	// get the dates that a person works given the job
	updateDates() {
		var team = this.state.job.team.slice(0)
		var day = this.state.job.day

		// get the dates of a specific team that was found in the componentDidMount() function
		GetDatesByTeam(day, team, (res, err) => {
            if (err) {
                this.setState({notLunchClean: true, response: {error: true}})
            } else {
				this.setState({response: res})
				var today = new Date()
				today.setHours(0, 0, 0, 0)
				res.days.forEach((workingDay) => {
					var testDate = new Date(workingDay.date)
					testDate.setHours(0, 0, 0, 0)
					if (testDate.valueOf() === today.valueOf()) {
						this.setState({workingToday: true})
					}
				})
            }
        })
	}

	getWorkingTodayDisplay() {
		if (this.state.workingToday) { // if simply working today, display so
			return <div style={{fontSize: 24}}>You <b>are</b> working today</div> 
		} else if (this.state.job.job === "Recess Cleanup") { // if recess cleanup, then need to check if today is the specific weekday
			var today = new Date()
			// compare if today is equal to the job provided by API
			if (weekdays[today.getDay()] === this.state.job.day) {
				return <div style={{fontSize: 24}}>You <b>are</b> working today</div> 
			} else {
				return <div style={{fontSize: 24}}>You <b>are not</b> working today</div>
			}
		// if response has been received and the person is on lunch clean but not working today
		} else if (this.state.response !== null && this.state.notLunchClean === false) {
			return <div style={{fontSize: 24}}>You <b>are not</b> working today</div>
		} else { // don't want to display anything when API hasn't responded yet.
			return null
		}
	}

	// format the information to display
	getDayDisplay() {
		if (this.state.job) { // if the job is known, display it
			return (
				<div>
					{
						this.state.error !== "" ? this.state.error : 
						<div>
							{this.getWorkingTodayDisplay()}
							{this.state.job.job !== "N/A"  && <div style={{fontSize: 18}}>Job: {this.state.job.job}<br/></div>}
							{this.state.job.team !== "N/A"  && <div style={{fontSize: 18}}>Team: {this.state.job.team} on {this.state.job.day}<br/></div>}
							
							{(this.state.job.day !== "N/A" && !(this.state.job.team !== "N/A")) && <div style={{fontSize: 18}}>Day: {this.state.job.day}<br/></div>}
						</div>
					}
				</div>
			)
		} else if (this.state.error) { // if there was an error, display it
			return (
				<div>
					{this.state.error}
				</div>
			)
		}
		else { // the API has not responded yet, so display a loading bar
			return (
				<div>
					Loading job...<br/>
					<CircularProgress /> <br/><br/>
				</div>
			)
		}
	}

	// make a formatted table of dates
	makeTable(days) {
		var today = new Date()
		var smallNotes = {
		}
		var dateStyle = {
			width: 70
		}
		var teamStyle = {
			width: 20
		}
		// create a table with mapping dates to rows
		return(
			<Table>
				<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
						<TableHeaderColumn style={dateStyle}>Date</TableHeaderColumn>
						<TableHeaderColumn style={teamStyle}>Team</TableHeaderColumn>
						<TableHeaderColumn style={smallNotes}>Notes</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody displayRowCheckbox={false}>
					{
						days.filter(day => {
							return new Date(day.date) > today // only print dates after today
						}).map(day => {
							return (
								<TableRow>
									<TableRowColumn style={dateStyle}>{day.date}</TableRowColumn>
									<TableRowColumn style={teamStyle}>{day.team}</TableRowColumn>
									<TableRowColumn style={smallNotes}>{day.notes}</TableRowColumn>
								</TableRow>
							)
						})
					}
				</TableBody>
			</Table>
		)
	}

	// get a table containing the job dates
	getJobDates() {
		if (this.state.response !== null) { // if a response has been made
			if (this.state.notLunchClean === false) { // make a table if if the person is on lunch clean
				return this.makeTable(this.state.response.days)
			} else {
				return null
			}
		} else if (this.state.error) { // if an error occured, don't place anything
			return null
		} else { // no response from API yet, make a loading display
			return (
				<div>
					<br/><span>Loading job dates...</span><br/>
					<CircularProgress /> 
				</div>
			)
		}
	}

	render() {
		return (
			<div style={{padding: 24}}> 
				<div style={{fontSize: 36}}>Welcome, {this.state.name.first + " " + this.state.name.last}</div><br/>

				{this.getDayDisplay()}<br/>
				{	// only show next job dates if person is on lunch clean
					this.state.notLunchClean === false && 
						<div style={{fontSize: 16}}>
							Next job dates:
						</div>
				}
				{this.getJobDates()}<br/><br/>
				<div style={{fontSize: 14}}>Tip: bookmark this page for future use!</div><br/>
				
			</div>
		)
	}
}