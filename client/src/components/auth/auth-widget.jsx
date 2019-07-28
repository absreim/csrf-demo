import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import Login from './login'
import {logout} from '../../store/user'

const MAINMENU = 'MAINMENU'
const LOGIN = 'LOGIN'
const SIGNUP = 'SIGNUP'

class UnconnectedAuthWidget extends Component {
  constructor(props){
    super(props)
    this.state = {
      menuExpanded: false,
      activeSection: MAINMENU
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.navigateLogin = this.navigateLogin.bind(this)
    this.navigateSignUp = this.navigateSignUp.bind(this)
    this.dismissForm = this.dismissForm.bind(this)
  }
  toggleMenu(){
    this.setState(state => ({
      menuExpanded: !state.menuExpanded
    }))
  }
  navigateMain(){
    this.setState({activeSection: MAINMENU})
  }
  navigateLogin(){
    this.setState({activeSection: LOGIN})
  }
  navigateSignUp(){
    this.setState({activeSection: SIGNUP})
  }
  dismissForm(){
    this.setState({
      menuExpanded: false,
      activeSection: MAINMENU
    })
  }
  render(){
    let expandedArea = null
    if (this.state.menuExpanded){
      let expandedAreaBody = null
      switch (this.state.activeSection){
        case LOGIN:
          expandedAreaBody = <Login dismissForm={this.dismissForm} />
        default:
          const {user} = this.props
          expandedAreaBody = (
            <div className="auth-widget-menu-body">
              {
                user ?
                (
                  <Fragment>
                    <p>Logged in as:&nbsp;{user}</p>
                    <button type="button" onClick={this.props.logout}>Logout</button>
                  </Fragment>
                ) :
                (
                  <Fragment>
                    <button type="button" onClick={this.navigateLogin}>Login</button>
                    <button type="button" onClick={this.navigateSignUp}>Sign up</button>
                  </Fragment>
                )
              }
            </div>
          )
      }
      let expandedAreaAddtlButtons = null
      if (this.state.activeSection !== MAINMENU){
        expandedAreaAddtlButtons = (
          <button type="button" onClick={this.navigateMain}>Back</button>
        )
      }
      expandedArea = (
        <div>
          <div className="auth-widget-menu-nav">
            {expandedAreaAddtlButtons}
            <button type="button" onClick={this.dismissForm}>Close</button>
          </div>
          {expandedAreaBody}
        </div>
      )
    }
    return (
      <div>
        <button type="button" onClick={this.toggleMenu}>Auth</button>
        {expandedArea}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

const AuthWidget = connect(mapStateToProps, mapDispatchToProps)(UnconnectedAuthWidget)

export default AuthWidget
