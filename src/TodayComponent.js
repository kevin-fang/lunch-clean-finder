import React from 'react';
import { GetToday } from './Api.js'
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
    return "It is " + days[date.getDay()] + ", " + months[date.getMonth()] + " " + addSuffix(date.getDate());
}

export default class TodayComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            today: null,
            weekend: false
        }
        this.getWorkingTeams = this.getWorkingTeams.bind(this)
    }

    componentDidMount() {
        GetToday((response, err) => {
            if (err) {
                alert(err)
            }
            if (response) {
                if (response.weekend === false) {
                    this.setState({today: response, weekend: false})
                } else {
                    this.setState({weekend: true, today: {date: new Date('9/16/2017')}})
                }
            }
        })
    }

    getWorkingTeams() {
        return (
            <div>
                <span style={{fontSize: 16, marginTop: 16}}><br/>
                Teams working today:
                <ul style={{listStyle: 'none'}}>
                    {this.state.today.team.split("")
                        .map(letter => (teams[letter]))
                        .map(name => (<li>{name}</li>))}
                </ul>
                </span> <br/>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.today 
                    ? <div>
                        <span style={{fontSize: 36}}>{formatDate(new Date(this.state.today.date))}</span><br/>
                        {this.state.weekend === false
                            ? this.getWorkingTeams()
                            : <div>
                                {this.state.weekend}
                                The next date for a weekday is: 
                            </div>
                        }
                    </div>
                    :   <div>
                            <CircularProgress /><br/>
                        </div>
                }
            </div>
        )
    }
}