import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'

import {getTransactions, clearTransactions} from '../store/transactions'

class UnconnectedTransactions extends Component{
  componentDidMount(){
    if (this.props.user){
      this.props.getTransactions()
    }
    else {
      this.props.clearTransactions()
    }
  }
  componentDidUpdate(prevProps){
    if (!prevProps.user && this.props.user){
      this.props.getTransactions()
    }
    else if (prevProps.user && !this.props.user) {
      this.props.clearTransactions()
    }
  }
  render(){
    const {user, transactions} = this.props
    return (
      <main>
        <h1 className="main-title">Transaction History</h1>
        {
          user ?
          (
            <Fragment>
              {
                transactions ?
                (
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transactions.map(txn => {
                          const {id, from, to, type, amount} = txn
                          return (
                            <tr key={id}>
                              <td>{from}</td>
                              <td>{to}</td>
                              <td>{type}</td>
                              <td>{amount}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                ) :
                <p>Data has not been loaded from the server.</p>
              }
              <button
                className="transactions-refresh-button"
                type="button"
                onClick={this.props.getTransactions}
              >
                Refresh Data
              </button>
            </Fragment>
          ) :
          <p>You must be logged in to view your transaction history.</p>
        }
      </main>
    )
  }
}

const mapStateToProps = state => ({
  transactions: state.transactions.transactions,
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  getTransactions: () => dispatch(getTransactions()),
  clearTransactions: () => dispatch(clearTransactions())
})

const Transactions =
  connect(
    mapStateToProps, mapDispatchToProps
  )(
    UnconnectedTransactions
  )

export default Transactions
