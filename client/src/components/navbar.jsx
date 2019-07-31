import React from 'react'
import {withRouter, NavLink} from 'react-router-dom'

import AuthWidget from './auth/auth-widget'

const Navbar = () => (
  <nav className="main-nav">
    <div className="main-nav-links">
      <NavLink
        to="/"
        activeClassName="main-nav-links__link--selected"
      >
        Home
      </NavLink>
      <NavLink
        to="/account"
        activeClassName="main-nav-links__link--selected"
      >
        Account
      </NavLink>
      <NavLink
        to="/transactions"
        activeClassName="main-nav-links__link--selected"
      >
        Transactions
      </NavLink>
    </div>
    <AuthWidget />
  </nav>
)

export default withRouter(Navbar)
