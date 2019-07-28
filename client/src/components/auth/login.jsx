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
  handleSubmit(){
    const {username, password} = this.state
    this.props.login(username, password)
  }
  render(){
    const user = this.props
    return (
      <div>
        {
          user ?
          <Fragment>
            <p>You are successfully logged in as&nbsp;<b>{user.username}</b></p>
            <button type="button" onClick={this.props.dismissForm}>OK</button>
          </Fragment> :
          <form onSubmit={this.handleSubmit}>
            <input
              name="username" type="text" value={this.state.username}
              onChange={this.handleInputChange}
            />
            <label htmlFor="username">Username</label>
            <input
              name="password" type="password" value={this.state.password}
              onChange={this.handleInputChange}
            />
            <label htmlFor="password">Password</label>
            <input type="submit" />
          </form>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(login(username, password))
})

const Login = connect(mapStateToProps, mapDispatchToProps)(UnconnectedLogin)

export default Login
