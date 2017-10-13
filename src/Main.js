import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { NameDisplayComponent, NameFormComponent } from './components/NameComponent.js'
import { TeamFormComponent, TeamDisplayComponent } from './components/TeamComponent.js'
import TodayComponent from './components/TodayComponent.js'


export class Main extends React.Component {

	render() {
		return (
			<main style={{margin: 0}}>
				{/* set up routing */}
				<Switch>
					<Route exact path='/' component={TodayComponent}/>
					<Route path='/name/:first/:last' component={NameDisplayComponent}/>
					<Route path='/team/:day/:teamname' component={TeamDisplayComponent}/>
					<Route exact path='/name' component={NameFormComponent}/>
					<Route exact path='/team' component={TeamFormComponent}/>
				</Switch>
			</main>
		)
	}
}

export default Main