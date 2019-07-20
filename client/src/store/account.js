import axios from 'axios'

const GOT_BALANCE = 'GOT_BALANCE'
const GOT_ERROR = 'GOT_ERROR'
const CLEAR_ERROR = 'CLEAR_ERROR'

const gotBalance = balance => (
  {
    type: GOT_BALANCE,
    balance
  }
)

const gotError = error => (
  {
    type: GOT_ERROR,
    error
  }
)

const clearError = () => (
  {
    type: CLEAR_ERROR
  }
)

export const getBalance = () => async dispatch => {
  try {
    dispatch(clearError())
    const {data} = await axios.get('/api/account/balance')
    dispatch(gotBalance(data.balance))
  }
  catch (err){
    dispatch(gotError(err))
  }
}

export const transfer = (recipientId, amount) => async dispatch => {
  try {
    dispatch(clearError())
    const {data} = await axios.post('/api/account/transfer', {
      recipientId,
      amount
    })
    dispatch(gotBalance(data.balance))
  }
  catch (err){
    dispatch(gotError(err))
  }
}

export const deposit = (recipientId, amount) => async dispatch => {
  try {
    dispatch(clearError())
    await axios.put('/api/account/deposit', {
      recipientId,
      amount
    })
  }
  catch (err){
    dispatch(gotError(err))
  }
}

export const withdraw = amount => async dispatch => {
  try {
    dispatch(clearError())
    const {data} = await axios.put('/api/account/withdraw', {
      amount
    })
    dispatch(gotBalance(data.balance))
  }
  catch (err){
    dispatch(gotError(err))
  }
}

// TODO: add transaction history in state and thunk to get transactions

const initialState = {
  balance: null,
  error: null
}

export default function(state = initialState, action){
  switch(action.type){
    case GOT_BALANCE:
      return {...state, balance: action.balance}
    case GOT_ERROR:
      return {...state, error: action.error}
    case CLEAR_ERROR:
      return {...state, error: null}
    default:
      return state
  }
}
