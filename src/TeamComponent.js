import React from 'react'
import { Redirect } from 'react-router-dom'
import { GetDatesByTeam } from './Api.js'
import { MakeTableRow } from './util.js'
const config = require('./config.json')
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
require('./util.js')

export class TeamFormComponent extends React.Component {
    constructor(props) {
        super(props)
        this.submit = this.s1ubmit.bind(this)
        this.state = {
            redirect: false,
            teamToSubmit: "A: asparagus",
            dayToSubmit: "Monday"
        }
        this.teams = config.teams
        this.handleTeamChange = this.handleTeamChange.bind(this)
        this.handleDayChange = this.handleDayChange.bind(this)
    }

    handleTeamChange(event) {
        this.setState({
            teamToSubmit: event.target.value
        })
    }

    handleDayChange(event) {
        this.setState({
            dayToSubmit: event.target.value
        })
    }

    submit() {
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
                <select value={this.state.dayToSubmit}
                    onChange={this.handleDayChange}>
                    {weekdays.map((name) => <option>{name}</option>)}
                </select><br/>
                <select value={this.state.teamToSubmit}
                    onChange={this.handleTeamChange}>
                    {this.teams.map((name) => <option>{name}</option>)}
                </select><br/><br/>
                <button onClick={this.submit}>Submit</button>
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
        this.makeTableRow = this.makeTableRow.bind(this)
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
    render() {
        return (
            <div>
                Team: {this.team}<br/>
                Day: {this.day}<br/>
                {this.state.response 
                    ?   <ul>
                           {this.state.response.days.map(MakeTableRow)}
                        </ul>
                    : "Loading..."}
            </div>
        )
    }
}