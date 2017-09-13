import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { NameDisplayComponent, NameFormComponent } from './NameComponent.js'
import { TeamFormComponent, TeamDisplayComponent } from './TeamComponent.js'
import TodayComponent from './TodayComponent.js'

const Main = () => (
    <main style={{margin: 24}}>
      <Switch>
        <Route exact path='/' component={TodayComponent}/>
        <Route path='/name/:first/:last' component={NameDisplayComponent}/>
        <Route path='/team/:day/:teamname' component={TeamDisplayComponent}/>
        <Route exact path='/name' component={NameFormComponent}/>
        <Route exact path='/team' component={TeamFormComponent}/>
      </Switch>
    </main>
)

export default Main