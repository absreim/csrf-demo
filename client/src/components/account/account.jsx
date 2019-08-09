import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import {getBalance, clearBalance} from '../../store/account'
import AccountActionSwitcher from './account-action-switcher'

class UnconnectedAccount extends Component{
  componentDidMount(){
    if (this.props.user){
      this.props.getBalance()
    }
    else {
      this.props.clearBalance()
    }
  }
  componentDidUpdate(prevProps){
    if (!prevProps.user && this.props.user){
      this.props.getBalance()
    }
    else if (prevProps.user && !this.props.user){
      this.props.clearBalance()
    }
  }
  render(){
    return (
      <main>
        <h1 className="main-title">Your Account</h1>
        <div className="account-balance-container">
          <h2>Balance</h2>
          {
            this.props.user ?
            <Fragment>
              <p>Balance:&nbsp;<b>{this.props.balance}</b></p>
              <button type="button" onClick={this.props.getBalance}>Refresh Balance</button>
            </Fragment> :
            <p>You must be logged in to view your balance.</p>
          }
        </div>
        <AccountActionSwitcher />
      </main>
    )
  }
}

const mapStateToProps = state => ({
  balance: state.account.balance,
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  getBalance: () => dispatch(getBalance()),
  clearBalance: () => dispatch(clearBalance())
})

const Account = connect(mapStateToProps, mapDispatchToProps)(UnconnectedAccount)

export default Account
