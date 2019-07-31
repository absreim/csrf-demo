import axios from 'axios'

const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS'
const GOT_ERROR = 'GOT_ERROR'
const CLEAR_ERROR = 'CLEAR_ERROR'
const CLEAR_TRANSACTIONS = 'CLEAR_TRANSACTIONS'

const gotTransactions = transactions => ({
  type: GOT_TRANSACTIONS,
  transactions
})

const gotError = err => ({
  type: GOT_ERROR,
  err
})

const clearError = () => ({
  type: CLEAR_ERROR
})

export const clearTransactions = () => ({
  type: CLEAR_TRANSACTIONS
})

export const getTransactions = () => async dispatch => {
  try {
    dispatch(clearError())
    const {data} = await axios.get('/api/transactions')
    dispatch(gotTransactions(data))
  }
  catch (err){
    dispatch(gotError(err))
  }
}

const initialState = {
  transactions: null,
  error: null
}

export default function(state = initialState, action){
  switch (action.type){
    case GOT_TRANSACTIONS:
      return {...state, transactions: action.transactions}
    case GOT_ERROR:
      return {...state, error: action.error}
    case CLEAR_ERROR:
      return {...state, error: null}
    case CLEAR_TRANSACTIONS:
      return {...state, transactions: null}
    default:
      return state
  }
}
