import React from 'react';
import { GetTeamsByDate, GetThisAndNextWeek } from '../Api.js'
import { SmallNotes, DateStyle, DayStyle, TeamStyle, CenterDiv } from '../Styles.js'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import Paper from 'material-ui/Paper'

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
var config = require('../config.json')

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
            week: null,
            nextWeek: null
        }
        this.today = new Date()
    }   

    // call the API for today's date
    componentWillMount = () => {
        if (this.today.getDay() !== 0 && this.today.getDay() !== 6) {
            GetTeamsByDate(this.today, (response, err) => {
                if (response === null) {
                    //this.setState({ today: "failed" })
                } else if (response) {
                    this.setState({ today: response.data, weekend: false })
                }
            })


        } else {
            this.setState({ weekend: true }, () => {
                this.fixWeekendDate(this.getNextMonday(this.today))
            })
        }

        GetThisAndNextWeek((response, err) => {
            if (err) {
                console.log("Website encountered a bug: " + err)
                //this.setState({ today: 'failed' })
            } else if (response) {
                // find next friday to be used for comparison
                let friday = new Date()
                friday.setDate(friday.getDate() + (12 - friday.getDay()) % 7)

                let thisWeek = response.filter(arr => (
                    new Date(arr[0]).valueOf() < friday.valueOf()
                ))

                let nextWeek = response.filter(arr => (
                    new Date(arr[0]).valueOf() > friday.valueOf()
                ))

                this.setState({ week: thisWeek, nextWeek: nextWeek})
            }
        })
    
    }

    // call the api on the Monday if today is Saturday/Sunday
    fixWeekendDate = (date) => {
        GetTeamsByDate(date, (response, err) => {
            if (err) {
                //alert("Messed up!")
                //this.setState({ today: "failed" })
                
            } else if (response) {
                this.setState({ today: response.data, weekend: true })
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
                .map(letter => (config.teamNames[letter]))
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
        if (days === null) return
        return (
            <Table
                bodyStyle={{overflow: 'auto'}}>
                <TableHeader 
                    displaySelectAll={false}
                    adjustForCheckbox={false}>
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
        } else if (this.state.today === "failed") {
            return (
                <div style={{ display: 'flex' }}>
                    <Card style={{width: 240,margin: 'auto', marginTop: 24, }}>
                        <CardTitle title={<b>Website failed.</b>} />
                        <CardText>
                            Please contact Kevin at kfang@commschool.org
                        </CardText>
                    </Card><br/>
                </div>
            )
        } else {
            return (
                <div>
                    {this.state.today || this.state.weekend // check if today is a date
                        ? <div style={{ marginTop: 20 }}>
                            <span style={{ textAlign: 'center' }}>{formatDate(this.today)}</span>

                            <div style={{ display: 'flex' }}>
                                <Card style={{width: 240,margin: 'auto', marginTop: 24, }}>
                                    <CardTitle title={<b>{this.state.weekend ? "Next Monday:" : "Working Teams:"}</b>} />
                                    <CardText>
                                        { this.getWorkingTeams() }
                                    </CardText>
                                </Card><br/>
                            </div><br/>
                            <Paper style={{margin: 20, paddingTop: 20}}>
                                <span style={{margin: 20, marginTop: 20}}><b>This week:</b></span>
                                <div style={{paddingLeft: 12, paddingRight: 12}}>{this.makeTable(this.state.week)}</div>
                            </Paper>
                                { this.state.nextWeek &&
                                    <Paper style={{margin: 20, paddingTop: 20}}>
                                        <div>
                                            <span style={{margin: 20, marginTop: 20}}><b>Next week:</b></span>
                                            <div style={{paddingLeft: 12, paddingRight: 12}}>{this.makeTable(this.state.nextWeek)}</div>
                                        </div>
                                    </Paper>
                                }
                        </div>
                        : <div>
                            <CircularProgress style={{ padding: 12 }} size={80} /><br />
                        </div>
                    }
                </div>
            )
        }
    }
}