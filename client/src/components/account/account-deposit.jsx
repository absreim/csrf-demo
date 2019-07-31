import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import {deposit} from '../../store/account'

class UnconnectedAccountDeposit extends Component {
  constructor(props){
    super(props)
    this.state = {
      recipientIsSelf: true,
      recipientId: '',
      amount: ''
    }
    this.handleRadioGroupChange =
      this.handleRadioGroupChange.bind(this)
    this.handleRecipientIdChange =
      this.handleRecipientIdChange.bind(this)
    this.handleAmountChange =
      this.handleAmountChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleRadioGroupChange(event){
    if (this.state.recipientIsSelf && event.target.value === 'other'){
      this.setState({
        recipientIsSelf: false
      })
    }
    else if (!this.state.recipientIsSelf && event.target.value === 'self'){
      this.setState({
        recipientIsSelf: true
      })
    }
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
    const {user} = this.props
    const {recipientId, recipientIsSelf, amount} = this.state

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
      <form onSubmit={this.handleSubmit} className="account-form">
        <div className="radio-group">
          <div className="radio-group-options">
            <input
              type="radio" name="recipient" value="self"
              id="self-recipient" disabled={!user}
              checked={Boolean(user && recipientIsSelf)}
              onChange={this.handleRadioGroupChange}
            />
            <label htmlFor="self-recipient">Self</label>
            <input
              type="radio" name="recipient" value="other"
              id="other-recipient"
              checked={!user || !recipientIsSelf}
              onChange={this.handleRadioGroupChange}
            />
            <label htmlFor="other-recipient">Other</label>
          </div>
          {recipientSpecifierInputArea}
        </div>
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
