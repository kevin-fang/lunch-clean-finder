import React from 'react';
import { GetToday, GetTeamsByDate } from './Api.js'

// material-ui imports
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
    var formattedDate = 
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
            weekend: false
        }
    }

    // call the API for today's date
    componentDidMount = () => {
        GetToday((response, err) => {
            if (err) {
                alert(err)
            } else if (response) {
                if (response.weekend === false) {
                    this.setState({ today: response, weekend: false })
                } else {
                    this.setState({ weekend: true, today: { date: new Date() } })
                }
            }
        })
    }

    // call the api on the Monday if today is Saturday/Sunday
    fixWeekendDate = (date) => {
        GetTeamsByDate(date, (response, err) => {
            if (err) {
                alert(err)
            } else if (response) {
                this.setState({ today: response, weekend: true })
            }
        })
    }

    // returns the teams working on a specific date
    getWorkingTeams = (message) => {
        return (
            <div>
                <span style={{ fontSize: 18 }}><br/>
                    {/* create a list of the teams working today*/}
                    { this.state.today.team !== 'N/A' 
                        ?   <ul style={{ listStyle: 'none', margin: 0, padding: 0}}>
                                {
                                    this.state.today.team.split("")
                                        .filter(letter => letter !== 'N')
                                        .map(letter => (teams[letter]))
                                        .map(name => (
                                            <li style={{fontSize: 48, fontWeight: 400, margin: 0}} key={name}>{name}</li>
                                            )
                                        )
                                }
                            </ul>

                        :   <span style={{fontSize: 48, fontWeight: 400, margin: 0}}>No teams working today</span>
                    }
                    {/* display any notes from the spreadsheet if they exist*/}
                    { 
                        this.state.today.notes !== "" && 
                            <div style={{paddingTop: 24}}>
                                <span style={{fontSize: 24}}>{this.state.today.notes}</span>
                            </div>
                    }
                </span> <br />
            </div>
        )
    }

    getNextMonday = (date) => {
        // add 1 and then add a week, mod 7 to get the next monday
        date.setDate(date.getDate() + (1 + 7 - date.getDay()) % 7)
        return date
    }

    render = () => {
        // if today is the weekend, check next monday and display that
        if (this.state.weekend && this.state.today.team === undefined) {
            this.fixWeekendDate(this.getNextMonday(new Date(this.state.today.date)))
            return <CircularProgress style={{ padding: 12 }} size={80} />
        } else if (this.state.weekend) {
            return (
                <div style={{ padding: 24 }}>
                    {this.state.today &&
                        <div>
                            {formatDate(new Date())}
                            <span>{formatDate(new Date())}</span><br />
                            <span>Teams working next Monday:</span>
                            {this.getWorkingTeams()}
                        </div>
                    }
                </div>
            )
        }
        return (
            <div>
                <div style={{ padding: 12}}>
                    {this.state.today
                        ? <div style={{textAlign: 'center', marginTop: 20}}>
                            {formatDate(new Date())}
                            {this.state.weekend === false && this.getWorkingTeams("Working Today")}
                        </div>
                        : <div>
                            <CircularProgress style={{ padding: 12 }} size={80} /><br />
                        </div>
                    }
                </div>
            </div>
        )
    }
}