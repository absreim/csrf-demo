import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import getBalance from '../../store/account'

class UnconnectedAccount extends Component{
  componentDidMount(){
    this.props.getBalance()
  }
  render(){
    return (
      <main>
        {
          this.props.user ?
          <Fragment>
            <p>Balance:&nbsp;{this.props.balance}</p>
            <button type="button" onClick={this.props.getBalance}>Refresh Balance</button>
          </Fragment> :
          <p>You must be logged in to view your balance.</p>
        }
      </main>
    )
  }
}

const mapStateToProps = state => ({
  balance: state.account.balance,
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  getBalance: () => dispatch(getBalance())
})

const Account = connect(mapStateToProps, mapDispatchToProps)(UnconnectedAccount)

export default Account
