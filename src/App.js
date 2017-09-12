import React, { Component } from 'react';
import { FormComponent } from './FormComponent.js'
import { TodayDisplayComponent } from './TodayDisplay.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <TodayDisplayComponent />
      </div>
    );
  }
}

export default App;
