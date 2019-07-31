import React, {Component} from 'react'
import {connect} from 'react-redux'

import {transfer} from '../../store/account'

class UnconnectedAccountTransfer extends Component {
  constructor(props){
    super(props)
    this.state = {
      recipientId: '',
      amount: ''
    }
    this.handleRecipientChange = this.handleRecipientChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleRecipientChange(event){
    this.setState({
      recipientId: event.target.value
    })
  }
  handleAmountChange(event){
    this.setState({
      amount: event.target.value
    })
  }
  handleSubmit(event){
    const {recipientId, amount} = this.state
    this.props.transfer(recipientId, amount)
    event.preventDefault()
  }
  render(){
    return (
      <form onSubmit={this.handleSubmit} className="account-form">
        <label htmlFor="recipient-id">Recipient Id</label>
        <input
          type="number" id="recipient-id" name="recipient-id"
          value={this.state.recipientId} onChange={this.handleRecipientChange}
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="number" id="amount" name="amount"
          value={this.state.amount} onChange={this.handleAmountChange}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  transfer: (recipientId, amount) => dispatch(transfer(recipientId, amount))
})

const AccountTransfer =
  connect(null, mapDispatchToProps)(UnconnectedAccountTransfer)

export default AccountTransfer
