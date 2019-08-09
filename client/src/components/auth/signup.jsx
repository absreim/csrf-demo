import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import {signup} from '../../store/user'

class UnconnectedSignup extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      confirm: '',
      validationError: false
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
    const {username, password, confirm} = this.state
    if (password === confirm){
      this.setState({validationError: false})
      this.props.signup(username, password)
    }
    else {
      this.setState({validationError: true})
    }
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
            <p
              className="auth-widget-dropdown-message"
            >
              You have signed up as:
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
              <label htmlFor="confirm">Confirm Password</label>
              <input
                name="confirm" type="password" value={this.state.confirm}
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
  signup: (username, password) => dispatch(signup(username, password))
})

const Signup = connect(mapStateToProps, mapDispatchToProps)(UnconnectedSignup)

export default Signup
