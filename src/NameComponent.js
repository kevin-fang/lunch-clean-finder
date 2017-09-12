import React from 'react'
require('./util.js')

export const NameFormComponent = () => {
    return (
        <div>
            Name Form Component
        </div>
    )
}

export const NameDisplayComponent = (props) => {
    const name = {
        first: props.match.params.first.nameify(),
        last: props.match.params.last.nameify()
    }
    return (
        <div>
            Name Display Component <br/>
            First name: {name.first}<br/>
            Last name: {name.last}
        </div>
    )
}