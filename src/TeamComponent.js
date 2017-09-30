import React from 'react'
import { Redirect } from 'react-router-dom'
import { GetDatesByTeam } from './Api.js'
import { SmallNotes, DateStyle, TeamStyle } from './Styles.js'

// material-ui imports
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'
import CircularProgress from 'material-ui/CircularProgress'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

const config = require('./config.json')
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
require('./util.js')

// choose a team that is working and then redirect to TeamDisplayComponent
export class TeamFormComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
            teamToSubmit: "A: Asparagus",
            dayToSubmit: "Monday"
        }
        this.teams = config.teams
    }

    // handle a team change from the dropdown menu
    handleTeamChange = (event, index, value) => {
        this.setState({
            teamToSubmit: config.teams[index]
        })
    }

    // handle a day change from the dropdown menu
    handleDayChange = (event, index, value) => {
        this.setState({
            dayToSubmit: value
        })
    }

    // tell the page to redirect 
    submit = (event) => {
        this.setState({
            redirect: true
        })
    }

    render = () => {
        // redirect if needed
        if (this.state.redirect === true) {
            return <Redirect push to={`/team/${this.state.dayToSubmit}/${this.state.teamToSubmit.slice(0, 1)}`}/>
        }
        // create dropdown menus and submit button
        return (
            <div style={{margin: 20}}>
                <DropDownMenu value={this.state.dayToSubmit}
                    autoWidth={false}
                    style={{minWidth: '200px', maxWidth: '200px'}}
                    onChange={this.handleDayChange}>
                    {weekdays.map((weekday) => <MenuItem primaryText={weekday} key={weekday} value={weekday}/>)}
                </DropDownMenu><br/>
                <DropDownMenu value={this.state.teamToSubmit}
                    autoWidth={false}
                    style={{minWidth: '200px', maxWidth: '200px'}}
                    onChange={this.handleTeamChange}>
                    {this.teams.map((name) => <MenuItem primaryText={name} key={name} value={name}/>)}
                </DropDownMenu><br/>
                <RaisedButton onClick={this.submit} label="Check" primary={true} style={{marginLeft: 24}} />
            </div>
        )
    }
}

// display the dates that a team works
export class TeamDisplayComponent extends React.Component {
    constructor(props) {
        super(props)
        this.team = props.match.params.teamname.slice(0, 1).toUpperCase()
        this.day = props.match.params.day.nameify()
        this.state = {
            response: null,
            workingToday: null
        }
    }

    // once the page loads, get all the dates 
    componentDidMount() {
        GetDatesByTeam(this.day, this.team, (res, err) => {
            if (err) {
                alert(err)
            } else {
                this.setState({response: res})
                res.days.forEach((workingDay) => {
					var testDate = new Date(workingDay.date)
					if (testDate.isToday()) {
						this.setState({workingToday: true}, () => {return})
					} else if (this.state.workingToday === null) {
                        this.setState({workingToday: false})
                    }
				})
            }
        })
    }

    // create a table with the days
    makeTable = (days) => {
		var today = new Date()
		return(
			<Table>
				<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
						<TableHeaderColumn style={DateStyle}>Date</TableHeaderColumn>
						<TableHeaderColumn style={TeamStyle}>Team</TableHeaderColumn>
						<TableHeaderColumn style={SmallNotes}>Notes</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody displayRowCheckbox={false}>
					{
						days.filter(day => {
							return new Date(day.date) > today // only print dates after today
						}).map(day => {
							return (
								<TableRow key={day.date}>
									<TableRowColumn style={DateStyle}>{day.date}</TableRowColumn>
									<TableRowColumn style={TeamStyle}>{day.team}</TableRowColumn>
									<TableRowColumn style={SmallNotes}>{day.notes}</TableRowColumn>
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
            <div style={{padding: 20}}>
                {
                    this.state.workingToday 
                        ? <span style={{fontSize: 24}}>Team {config.teamNames[this.team]}, {this.day} is working today</span> 
                        : this.state.workingToday === false ? <span style={{fontSize: 24}}>Team {config.teamNames[this.team]}, {this.day} is not working today</span> : null
                }<br/><br/>
                <span style={{fontSize: 18}}>Team: {config.teamNames[this.team]}</span><br/>
                <span style={{fontSize: 18}}>Day: {this.day}</span><br/><br/>
                {this.state.response 
                    ?   <div>
                            Next job dates:
                            {this.makeTable(this.state.response.days)}
                        </div>
                    : <CircularProgress style={{padding: 36}} size={80}/>}
            </div>
        )
    }
}