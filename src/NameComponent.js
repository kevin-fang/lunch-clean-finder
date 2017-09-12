import React from 'react'
import { Redirect } from 'react-router-dom'
import { GetJobByName } from './Api.js'
require('./util.js')

export class NameFormComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            first: "",
            last: "",
            redirect: false
        }
        this.submit = this.submit.bind(this)
    }

    submit() {
        this.setState({redirect: true})
    }

    render() {
        if (this.state.redirect === true) {  
            return <Redirect push to={`/jobbyname/${this.state.first}/${this.state.last}`} />;
        }
        return (
            <div>
                <input placeholder="First Name" onChange={(event) => {this.setState({first: event.target.value})}} /><br/>
                <input placeholder="Last Name" onChange={(event) => {this.setState({last: event.target.value})}} /><br/>
                <button onClick={this.submit}>Submit</button>
            </div>
        )
    }  
}

export class NameDisplayComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: {
                first: props.match.params.first.nameify(),
                last: props.match.params.last.nameify()
            },
            job: null
        }
        this.getDayDisplay = this.getDsayDisplay.bind(this)
    }

    componentDidMount() {
        GetJobByName(this.state.name, (response, err) => {
            if (err) alert(err)
            this.setState({job: response})
        })
    }

    getDayDisplay() {
        if (this.state.job) {
            return (
                <div>
                    {this.state.job.job !== "N/A"  && "Job: "+ this.state.job.job}<br/>
                    {this.state.job.team !== "N/A"  && "Team: " + this.state.job.team}<br/>
                    {this.state.job.day !== "N/A" && "Weekday: " + this.state.job.day}<br/>
                </div>
            )
        } else {
            return null
        }
    }

    render() {
        return (
            <div>
                First name: {this.state.name.first}<br/>
                Last name: {this.state.name.last}<br/><br/>
                {this.getDayDisplay()}
            </div>
        )
    }
}