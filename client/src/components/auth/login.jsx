import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import {login} from '../../store/user'

class UnconnectedLogin extends Component{
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleInputChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event){
    const {username, password} = this.state
    this.props.login(username, password)
    event.preventDefault()
  }
  render(){

    let errorArea = null
    const errorObj = this.props.error
    if (errorObj){
      let errorMessage = errorObj.message
      if (errorObj.response.status === 401){
        errorMessage = 'Invalid username and/or password.'
      }
      errorArea = <p className="signup-form-error">{errorMessage}</p>
    }

    const {user} = this.props

    return (
      <div>
        {
          user ?
          <Fragment>
            <p
              className="auth-widget-dropdown-message"
            >
              You have logged in as:
            </p>
            <p><b>{user.username}</b></p>
            <button type="button" onClick={this.props.dismissForm}>OK</button>
          </Fragment> :
          <Fragment>
            <form onSubmit={this.handleSubmit} className="auth-form">
              <label htmlFor="username">Username</label>
              <input
                name="username" type="text" value={this.state.username}
                onChange={this.handleInputChange}
              />
              <label htmlFor="password">Password</label>
              <input
                name="password" type="password" value={this.state.password}
                onChange={this.handleInputChange}
              />
              <input type="submit" />
            </form>
            {errorArea}
          </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  error: state.user.error
})

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(login(username, password))
})

const Login = connect(mapStateToProps, mapDispatchToProps)(UnconnectedLogin)

export default Login
