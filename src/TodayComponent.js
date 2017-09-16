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
    return "Today is " + days[date.getDay()] + ", " + months[date.getMonth()] + " " + addSuffix(date.getDate());
}

export default class TodayComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            today: null,
            weekend: false
        }
        this.getWorkingTeams = this.getWorkingTeams.bind(this)
        this.getNextMonday = this.getNextMonday.bind(this)
        this.fixWeekendDate = this.fixWeekendDate.bind(this)
    }

    componentDidMount() {
        GetToday((response, err) => {
            if (err) {
                alert(err)
            } else if (response) {
                if (response.weekend === false) {
                    this.setState({today: response, weekend: false})
                } else {
                    this.setState({weekend: true, today: {date: new Date()}})
                }
            }
        })
    }

    fixWeekendDate(date) {
        GetTeamsByDate(date, (response, err) => {
            if (err) {
                alert(err)
            } else if (response) {
                this.setState({today: response, weekend: true})
            }
        })
    }

    getWorkingTeams(message) {
        return (
            <div>
                <span style={{fontSize: 18, marginTop: 16}}><br/>
                {message}
                <ul style={{listStyle: 'none'}}>
                    {this.state.today.team.split("")
                        .map(letter => (teams[letter]))
                        .map(name => (<li key={name}>{name}</li>))}
                </ul>
                </span> <br/>
            </div>
        )
    }

    getNextMonday(date) {
        // add 1 and then add a week, mod 7.
        date.setDate(date.getDate() + (1 + 7 - date.getDay()) % 7)
        return date
    }

    render() {
        if (this.state.weekend && this.state.today.team === undefined) {
            this.fixWeekendDate(this.getNextMonday(new Date(this.state.today.date)))
            return <CircularProgress />
        } else if (this.state.weekend) {
            return (
                <div>
                {this.state.today &&
                    <div>
                        <span style={{fontSize: 36}}>{formatDate(new Date())}</span><br/>
                        {this.getWorkingTeams("Teams working next Monday:")}
                    </div>
                }
            </div>
            )
        }
        return (
            <div>
                {this.state.today 
                    ? <div>
                        <span style={{fontSize: 36}}>{formatDate(new Date())}</span><br/>
                        {this.state.weekend === false && this.getWorkingTeams("Teams working today:")}
                    </div>
                    :   <div>
                            <CircularProgress /><br/>
                        </div>
                }
            </div>
        )
    }
}