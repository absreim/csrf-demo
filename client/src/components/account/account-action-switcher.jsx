import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import AccountDeposit from './account-deposit'

const NONE = 'NONE'
const DEPOSIT = 'DEPOSIT'
const WITHDRAW = 'WITHDRAW'
const TRANSFER = 'TRANSFER'

class UnconnectedAccountActionSwitcher extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedAction: NONE
    }
    this.navigateDeposit = this.navigateDeposit.bind(this)
    this.navigateWithdraw = this.navigateWithdraw.bind(this)
    this.navigateTransfer = this.navigateTransfer.bind(this)
  }
  navigateDeposit(){
    if (this.state.selectedAction !== DEPOSIT){
      this.setState({selectedAction: NONE})
    }
    else {
      this.setState({selectedAction: DEPOSIT})
    }
  }
  navigateWithdraw(){
    if (this.state.selectedAction !== WITHDRAW){
      this.setState({selectedAction: WITHDRAW})
    }
    else {
      this.setState({selectedAction: NONE})
    }
  }
  navigateTransfer(){
    if (this.state.selectedAction !== TRANSFER){
      this.setState({selectedAction: TRANSFER})
    }
    else {
      this.setState({selectedAction: NONE})
    }
  }
  render(){
    let addtlButtons = null
    if (this.props.user){
      addtlButtons = (
        <Fragment>
          <button type="button" onClick={this.navigateWithdraw}>Withdraw</button>
          <button type="button" onClick={this.navigateTransfer}>Transfer</button>
        </Fragment>
      )
    }

    let actionFormArea = null
    switch (this.state.selectedAction){
      case DEPOSIT:
        actionFormArea = <AccountDeposit />
        break
      default:
        actionFormArea = <p>Select an action above.</p>
    }

    return (
      <div>
        <nav>
          <button type="button" onClick={this.navigateDeposit}>Deposit</button>
          {addtlButtons}
        </nav>
        {actionFormArea}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.user
})

const AccountActionSwitcher = 
  connect(mapStateToProps)(UnconnectedAccountActionSwitcher)

export default AccountActionSwitcher
