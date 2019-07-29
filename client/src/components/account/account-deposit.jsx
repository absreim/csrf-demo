import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import {deposit} from '../../store/account'

class UnconnectedAccountDeposit extends Component {
  constructor(props){
    super(props)
    this.state = {
      recipientIsSelf: true,
      recipientId: '',
      amount: 0
    }
    this.handleSelectOtherRecipient =
      this.handleSelectOtherRecipient.bind(this)
    this.handleSelectSelfRecipient =
      this.handleSelectSelfRecipient.bind(this)
    this.handleRecipientIdChange =
      this.handleRecipientIdChange.bind(this)
    this.handleAmountChange =
      this.handleAmountChange.bind(this)
  }
  handleSelectSelfRecipient(){
    this.setState({
      recipientIsSelf: true
    })
  }
  handleSelectOtherRecipient(){
    this.setState({
      recipientIsSelf: false
    })
  }
  handleRecipientIdChange(event){
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
    let {amount, recipientId} = this.state
    if (recipientId.length === 0){
      recipientId = null
    }
    this.props.deposit(recipientId, amount)
    event.preventDefault()
  }
  render(){
    let selfRecipientInput = null
    let otherRecipientInput = null
    const {user} = this.props
    const {recipientId, recipientIsSelf, amount} = this.state
    if (user){
      if (recipientIsSelf) {
        selfRecipientInput =
          <input type="radio" name="recipient" id="self-recipient" checked />
        otherRecipientInput = (
          <input
            type="radio" name="recipient" id="other-recipient"
            onClick={this.handleSelectOtherRecipient}
          />
        )
      }
      else {
        selfRecipientInput = (
          <input
            type="radio" name="recipient" id="self-recipient"
            onClick={this.handleSelectSelfRecipient}
          />
        )
        otherRecipientInput =
          <input type="radio" name="recipient" id="other-recipient" checked />
      }
    }
    else {
      selfRecipientInput =
        <input type="radio" name="recipient" id="self-recipient" disabled />
      otherRecipientInput =
        <input type="radio" name="recipient" id="other-recipient" checked />
    }

    let recipientSpecifierInputArea = null
    if (!(user && recipientIsSelf)) {
      recipientSpecifierInputArea = (
        <Fragment>
          <label htmlFor="recipient-id">Recipient Id</label>
          <input
            type="number" id="recipient-id" value={recipientId}
            onChange={this.handleRecipientIdChange}
          />
        </Fragment>
      )
    }

    return (
      <form onSubmit={this.handleSubmit}>
        {selfRecipientInput}
        <label htmlFor="self-recipient">Self</label>
        {otherRecipientInput}
        <label htmlFor="other-recipient">Other</label>
        {recipientSpecifierInputArea}
        <label htmlFor="amount">Amount</label>
        <input
          type="number" id="amount" value={amount}
          onChange={this.handleAmountChange}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  deposit: (recipientId, amount) =>
    dispatch(deposit(recipientId, amount))
})

const AccountDeposit =
  connect(mapStateToProps, mapDispatchToProps)(UnconnectedAccountDeposit)

export default AccountDeposit
