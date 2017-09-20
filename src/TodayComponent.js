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

    fixWeekendDate = (date) => {
        GetTeamsByDate(date, (response, err) => {
            if (err) {
                alert(err)
            } else if (response) {
                this.setState({ today: response, weekend: true })
            }
        })
    }

    getWorkingTeams = (message) => {
        return (
            <div>
                <span style={{ fontSize: 18 }}><br/>
                    {/*<div style={{fontSize: 68, margin: 0, fontFamily: 'Roboto', fontWeight: 300}}>{message}</div>*/}
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0}}>
                        {this.state.today.team.split("")
                            .map(letter => (teams[letter]))
                            .map(name => (<li style={{fontSize: 48, fontWeight: 600, margin: 0}} key={name}>{name}</li>))}
                    </ul>
                </span> <br />
            </div>
        )
    }

    getNextMonday = (date) => {
        // add 1 and then add a week, mod 7.
        date.setDate(date.getDate() + (1 + 7 - date.getDay()) % 7)
        return date
    }

    render = () => {
        // if today is the weekend, check next monday
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
                            {this.getWorkingTeams("Teams working next Monday:")}
                        </div>
                    }
                </div>
            )
        }
        return (
            <div style={{ backgroundImage: `url('table.jpg')`}}>
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