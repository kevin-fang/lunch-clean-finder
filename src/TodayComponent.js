import React from 'react';
import { getToday } from './Api.js'

export default class TodayComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            today: null
        }
    }

    componentDidMount() {
        getToday((response, err) => {
            if (err) {
                console.log(err)
                alert(err)
            }
            if (response) {
                this.setState({today: response.data})
            }
        })
    }

    render() {
        return (
            <div>
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