import React from 'react';
import { GetToday } from './Api.js'

export default class TodayComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            today: null
        }
    }

    componentDidMount() {
        GetToday((response, err) => {
            if (err) {
                //alert(err)
            }
            if (response) {
                this.setState({today: response})
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