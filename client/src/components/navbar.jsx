import React from 'react'
import {withRouter, Link} from 'react-router-dom'

const Navbar = () => (
  <div>
    <Link to="/">Home</Link>
    <Link to="/account">Account</Link>
  </div>
)

export default withRouter(Navbar)
