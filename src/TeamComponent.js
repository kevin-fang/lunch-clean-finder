import React from 'react'

export class TeamFormComponent extends React.Component() {
    render() {
        return (
            <div>
                Team Form Component
            </div>
        )
    }
}

export const TeamDisplayComponent = (props) => {
    var team = props.match.params.teamname.slice(0, 1).toUpperCase()
    return (
        <div>
            Team Display Component<br/>
            Team: {team}
        </div>
    )
}