import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Navbar from './navbar'
import Home from './home'
import Account from './account/account'
import Transactions from './transactions'

const App = () => {
  return (
    <div>
      <header>CORS Bank</header>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/transactions" component={Transactions} />
      </Switch>
    </div>
  )
}

export default App
