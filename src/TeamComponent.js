import React from 'react'
import { Redirect } from 'react-router-dom'
import { GetDatesByTeam } from './Api.js'

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

export class TeamFormComponent extends React.Component {
    constructor(props) {
        super(props)
        this.submit = this.submit.bind(this)
        this.state = {
            redirect: false,
            teamToSubmit: "A: Asparagus",
            dayToSubmit: "Monday"
        }
        this.teams = config.teams
        this.handleTeamChange = this.handleTeamChange.bind(this)
        this.handleDayChange = this.handleDayChange.bind(this)
    }

    handleTeamChange(event, index, value) {
        this.setState({
            teamToSubmit: config.teams[index]
        })
    }

    handleDayChange(event, index, value) {
        this.setState({
            dayToSubmit: value
        })
    }

    submit(event) {
        this.setState({
            redirect: true
        })
    }

    render() {
        if (this.state.redirect === true) {
            return <Redirect push to={`/team/${this.state.dayToSubmit}/${this.state.teamToSubmit.slice(0, 1)}`}/>
        }
        return (
            <div>
                <DropDownMenu value={this.state.dayToSubmit}
                    autoWidth={false}
                    style={{minWidth: '200px', maxWidth: '200px'}}
                    onChange={this.handleDayChange}>
                    {weekdays.map((weekday) => <MenuItem primaryText={weekday} key={weekday} value={weekday}/>)}
                </DropDownMenu>
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

export class TeamDisplayComponent extends React.Component {
    constructor(props) {
        super(props)
        this.team = props.match.params.teamname.slice(0, 1).toUpperCase()
        this.day = props.match.params.day.nameify()
        this.state = {
            response: null
        }
        this.makeTable = this.makeTable.bind(this)
    }

    componentDidMount() {
        GetDatesByTeam(this.day, this.team, (res, err) => {
            if (err) {
                alert(err)
            } else {
                this.setState({response: res})
            }
        })
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
					{days.filter(day => {
						return new Date(day.date) > new Date()
					}).map(day => {
						return (
							<TableRow key={day.date}>
								<TableRowColumn>{day.date}</TableRowColumn>
								<TableRowColumn>{day.weekday}</TableRowColumn>
								<TableRowColumn>{day.team}</TableRowColumn>
								<TableRowColumn>{day.notes}</TableRowColumn>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		)
    }
    
    render() {
        return (
            <div>
                <span style={{fontSize: 18}}>Team: {config.teamNames[this.team]}</span><br/>
                <span style={{fontSize: 18}}>Day: {this.day}</span><br/>
                {this.state.response 
                    ?   this.makeTable(this.state.response.days)
                    : <CircularProgress />}
            </div>
        )
    }
}