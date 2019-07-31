import React, {Component} from 'react'
import {connect} from 'react-redux'

import {withdraw} from '../../store/account'

class UnconnectedAccountWithdraw extends Component{
  constructor(props){
    super(props)
    this.state = {
      amount: ''
    }
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleAmountChange(event){
    this.setState({
      amount: event.target.value
    })
  }
  handleSubmit(event){
    this.props.withdraw(this.state.amount)
    event.preventDefault()
  }
  render(){
    return (
      <form onSubmit={this.handleSubmit} className="account-form">
        <label htmlFor="amount">Amount</label>
        <input
          type="number" id="amount" name="amount"
          value={this.state.amount}
          onChange={this.handleAmountChange}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  withdraw: amount => dispatch(withdraw(amount))
})

const AccountWithdraw =
  connect(null, mapDispatchToProps)(UnconnectedAccountWithdraw)

export default AccountWithdraw
