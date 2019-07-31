import React from 'react'
import {withRouter, Link} from 'react-router-dom'

import AuthWidget from './auth/auth-widget'

const Navbar = () => (
  <nav>
    <div>
      <Link to="/">Home</Link>
      <Link to="/account">Account</Link>
      <Link to="/transactions">Transactions</Link>
    </div>
    <AuthWidget />
  </nav>
)

export default withRouter(Navbar)
