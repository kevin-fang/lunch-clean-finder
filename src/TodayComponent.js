import React from 'react';
import { GetTeamsByDate, GetWeek } from './Api.js'
import { SmallNotes, DateStyle, DayStyle, TeamStyle } from './Styles.js'
import { Card, CardTitle, CardText } from 'material-ui/Card'

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

// list of the team names
const teams = {
    A: "A: Asparagus",
    B: "B: Brussel Sprouts",
    C: "C: Cauliflower"
}

// list of weekdays and months
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function getSuffix(number) {
    if (number % 100 > 10 && number % 100 < 20) {
        return "th"
    }
    if (number % 10 === 1) {
        return "st"
    } else if (number % 10 === 2) {
        return "nd"
    } else if (number % 10 === 3) {
        return "rd"
    } else {
        return "th"
    }
}

function addSuffix(num) {
    return num + getSuffix(num);
}

// format a date. new Date('9/8/2017') => "It is Friday, September 8"
function formatDate(date) {
    let formattedDate = 
        <div>
            <div>Today is {days[date.getDay()]}, {months[date.getMonth()]} {addSuffix(date.getDate())}</div>
        </div>
    return <span style={{fontFamily: 'Roboto', fontWeight: 200, fontSize: 68}}>{formattedDate}</span>
}

export default class TodayComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            today: null,
            weekend: false,
            week: null
        }
        this.today = new Date()
    }

    // call the API for today's date
    componentDidMount = () => {
        if (this.today.getDay() !== 0 && this.today.getDay() !== 6) {
            GetTeamsByDate(this.today, (response, err) => {
                if (err) {
                    console.log("Teams by date: " + err)
                } else if (response) {
                    this.setState({ today: response, weekend: false })
                }
            })
        } else {
            this.setState({ weekend: true }, () => {
                this.fixWeekendDate(this.getNextMonday(this.today))
            })
        }

        GetWeek((response, err) => {
            if (err) {
                console.log("Get week: " + err)
            } else if (response) {
                this.setState({ week: response })
            }
        })
    }

    // call the api on the Monday if today is Saturday/Sunday
    fixWeekendDate = (date) => {
        GetTeamsByDate(date, (response, err) => {
            if (err) {
                console.log("Fix weekend date: " + err)
            } else if (response) {
                this.setState({ today: response, weekend: true })
            }
        })
    }

    // returns the teams working on a specific date
    getWorkingTeams = (message) => {
        if (message === null || this.state.today === null) return;

        let teamStyle = {
            fontSize: 16, fontWeight: 400, margin: 0
        }

        // create a list of teams working today
        let workingTeams
        if (this.state.today.team !== 'N/A') {
            workingTeams = this.state.today.team.split("")
                .filter(letter => letter !== 'N')
                .map(letter => (teams[letter]))
                .map(name => (
                        <li style={teamStyle} key={name}>{name}</li>
                    )
                )
            workingTeams = (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0}}>
                    {workingTeams}
                </ul>
            )
        } else {
            workingTeams = <span style={teamStyle}>No teams working</span>
        }

        // display notes if they exist
        let notes
        if (this.state.today.notes !== "") {
            notes = (
                <div style={{ paddingTop: 24 }}>
                    <span style={{ fontSize: 24 }}>{this.state.today.notes}</span>
                </div>
            )
        } else {
            notes = null
        }

        return (
            <div>
                <span>
                    { workingTeams }
                    { notes }
                </span>
            </div>
        )
    }

    getNextMonday = (date) => {
        let monday = new Date(date.valueOf())
        monday.setHours(0)
        monday.setMinutes(0)
        // add 1 and then add a week, mod 7 to get the next monday
        monday.setDate(monday.getDate() + (1 + 7 - monday.getDay()) % 7)
        return monday
    }

    // create a table with the days
    makeTable = (days) => {
        return (
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={DateStyle}>Date</TableHeaderColumn>
                        <TableHeaderColumn style={DayStyle}>Day</TableHeaderColumn>
                        <TableHeaderColumn style={TeamStyle}>Team</TableHeaderColumn>
                        <TableHeaderColumn style={SmallNotes}>Notes</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {
                        days.map(day => {
                            return (
                                <TableRow key={day[0]}>
                                    <TableRowColumn style={DateStyle}>{day[0]}</TableRowColumn>
                                    <TableRowColumn style={DayStyle}>{day[1]}</TableRowColumn>
                                    <TableRowColumn style={TeamStyle}>{day[3]}</TableRowColumn>
                                    <TableRowColumn style={SmallNotes}>{day[2]}</TableRowColumn>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        )
    }

    render = () => {
        //console.log(this.state)
        // if today is the weekend, check next monday and display that
        if (this.state.today === null) {
            return <CircularProgress style={{ padding: 12 }} size={80} />
        } else if (this.state.weekend) { // handle if weekend
            return (
                <div style={{ marginTop: 20 }}>
                    {this.state.today &&
                        <div>
                            <span style={{ padding: 24, textAlign: 'center' }}>{formatDate(this.today)}</span>
                            <Card style={{width: 240, marginTop: 24, marginLeft: '41%'}}>
                                <CardTitle title={<b>Teams working next Monday</b>} />
                                <CardText>
                                    { this.getWorkingTeams() }
                                </CardText>
                            </Card><br/>
                            <span style={{margin: 20, marginTop: 20}}><b>This week:</b></span>
                            <div style={{padding: 24}}>{this.makeTable(this.state.week)}</div>
                        </div>
                    }
                </div>
            )
        }
        return (
            <div>
                {this.state.today // check if today is a date
                    ? <div style={{ marginTop: 20 }}>
                        <span style={{textAlign: 'center'}}>{formatDate(this.today)}</span>
                        <Card style={{width: 240, marginTop: 24, marginLeft: '41%'}}>
                            <CardTitle title={<b>Working Teams:</b>} />
                            <CardText>
                                { this.getWorkingTeams() }
                            </CardText>
                        </Card><br/>
                        <span style={{margin: 20, marginTop: 20}}><b>This week:</b></span>
                        <div style={{padding: 24}}>{this.makeTable(this.state.week)}</div>
                    </div>
                    : <div>
                        <CircularProgress style={{ padding: 12 }} size={80} /><br />
                    </div>
                }
            </div>
        )
    }
}