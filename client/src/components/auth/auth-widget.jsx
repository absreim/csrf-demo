import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import Login from './login'
import Signup from './signup'
import AuthWidgetIcon from './auth-widget-icon'
import {logout, me} from '../../store/user'

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
    this.navigateMain = this.navigateMain.bind(this)
    this.navigateLogin = this.navigateLogin.bind(this)
    this.navigateSignUp = this.navigateSignUp.bind(this)
    this.dismissForm = this.dismissForm.bind(this)
  }
  componentDidMount(){
    this.props.me()
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
    const {user} = this.props
    if (this.state.menuExpanded){
      let expandedAreaBody = null
      switch (this.state.activeSection){
        case LOGIN:
          expandedAreaBody = <Login dismissForm={this.dismissForm} />
          break
        case SIGNUP:
          expandedAreaBody = <Signup dismissForm={this.dismissForm} />
          break
        default: {
          expandedAreaBody = (
            <div>
              {
                user ?
                (
                  <Fragment>
                    <p>Logged in as:&nbsp;{user.username}</p>
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
      }
      let expandedAreaAddtlButtons = null
      if (this.state.activeSection !== MAINMENU){
        expandedAreaAddtlButtons = (
          <button type="button" onClick={this.navigateMain}>Back</button>
        )
      }
      expandedArea = (
        <div className="auth-widget-dropdown">
          <nav className="auth-widget-nav">
            {expandedAreaAddtlButtons}
            <button type="button" onClick={this.dismissForm}>Close</button>
          </nav>
          {expandedAreaBody}
        </div>
      )
    }
    let iconFigureClass = 'auth-widget-icon__figure '
    iconFigureClass += user ?
      'auth-widget-icon__figure--filled' :
      'auth-widget-icon__figure--hollow'
    return (
      <div>
        <AuthWidgetIcon
          outerClass="auth-widget-icon" headClass={iconFigureClass}
          bodyClass={iconFigureClass} clickHandler={this.toggleMenu}
        />
        {expandedArea}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  me: () => dispatch(me())
})

const AuthWidget = connect(mapStateToProps, mapDispatchToProps)(UnconnectedAuthWidget)

export default AuthWidget
