import React from 'react'

export class FormComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: ""
        }
        
        this.submit = this.submit.bind(this)
    }

    submit = () => {
        alert('submitted')
        this.props.submit(this.state)
    }

    render = () => {
        return (
            <div>
                <input /> 
                <button onClick={this.submit}>test</button>
            </div>
        )
    }

}