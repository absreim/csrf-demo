import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import AccountDeposit from './account-deposit'
import AccountTransfer from './account-transfer'
import AccountWithdraw from './account-withdraw'

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
    if (this.state.selectedAction === DEPOSIT){
      this.setState({selectedAction: NONE})
    }
    else {
      this.setState({selectedAction: DEPOSIT})
    }
  }
  navigateWithdraw(){
    if (this.state.selectedAction === WITHDRAW){
      this.setState({selectedAction: NONE})
    }
    else {
      this.setState({selectedAction: WITHDRAW})
    }
  }
  navigateTransfer(){
    if (this.state.selectedAction === TRANSFER){
      this.setState({selectedAction: NONE})
    }
    else {
      this.setState({selectedAction: TRANSFER})
    }
  }
  render(){

    let depositButtonClass = null
    let transferButtonClass = null
    let withdrawButtonClass = null

    let actionFormArea = null
    switch (this.state.selectedAction){
      case DEPOSIT:
        actionFormArea = <AccountDeposit />
        depositButtonClass = 'account-action-swticher-nav__button--selected'
        break
      case TRANSFER:
        actionFormArea = <AccountTransfer />
        transferButtonClass = 'account-action-swticher-nav__button--selected'
        break
      case WITHDRAW:
        actionFormArea = <AccountWithdraw />
        withdrawButtonClass = 'account-action-swticher-nav__button--selected'
        break
      default:
        actionFormArea = <p>Select an action above.</p>
    }

    let addtlButtons = null
    if (this.props.user){
      addtlButtons = (
        <Fragment>
          <button
            type="button" onClick={this.navigateWithdraw}
            className={withdrawButtonClass}
          >
            Withdraw
          </button>
          <button
            type="button" onClick={this.navigateTransfer}
            className={transferButtonClass}
          >
            Transfer
          </button>
        </Fragment>
      )
    }

    return (
      <div className="account-action-switcher">
        <h2>Actions</h2>
        <nav>
          <button
            type="button" onClick={this.navigateDeposit}
            className={depositButtonClass}
          >
            Deposit
          </button>
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
