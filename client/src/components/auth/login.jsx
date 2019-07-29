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
    if (this.state.validationError){
      errorArea = <p className="signup-form-error">Passwords must match.</p>
    }
    else {
      const ajaxError = this.props.error
      if (ajaxError){
        errorArea = <p className="signup-form-error">{ajaxError.message}</p>
      }
    }

    const {user} = this.props

    return (
      <div>
        {
          user ?
          <Fragment>
            <p>You are successfully logged in as&nbsp;<b>{user.username}</b></p>
            <button type="button" onClick={this.props.dismissForm}>OK</button>
          </Fragment> :
          <Fragment>
            <form onSubmit={this.handleSubmit}>
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
