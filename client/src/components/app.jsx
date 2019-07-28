import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Navbar from './navbar'
import Home from './home'
import Account from './account'

const App = () => {
  return (
    <div>
      <header>CORS Bank</header>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/account" component={Account} />
      </Switch>
    </div>
  )
}

export default App
