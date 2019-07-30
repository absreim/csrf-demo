import React, {Component} from 'react'

class UnconnectedTransactions extends Component{
  componentDidMount(){
    if (this.props.user){
      this.props.getTransactions()
    }
  }
  render(){
    return (
      <main>
        <h1>Transaction History</h1>
      </main>
    )
  }
}
