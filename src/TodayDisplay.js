import React from 'react';
import axios from 'axios';

var config = require('./config.json')

export class TodayDisplayComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            today: null
        }
    }

    componentDidMount() {
        axios.get(config.serverip + '/today')
            .then((response) => {
                this.setState({today: response.data})
            })
    }

    render() {
        return (
            <div style={{margin: 24}}>
                { this.state.today 
                    ? <div>
                    Today's date: {this.state.today.date} <br/>
                    Weekday: {this.state.today.weekday} <br/>
                    {this.state.today.notes === ""
                        ? null
                        : <div>{this.state.today.notes}<br/></div>}
                    Team working today: {this.state.today.team} <br/>
                    </div>
                    : "Loading..."
                }
            </div>
        )
    }
}