import axios from 'axios'

const GOT_BALANCE = 'GOT_BALANCE'
const GOT_ERROR = 'GOT_ERROR'
const CLEAR_ERROR = 'CLEAR_ERROR'
const CLEAR_BALANCE = 'CLEAR_BALANCE'

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

export const clearError = () => (
  {
    type: CLEAR_ERROR
  }
)

export const clearBalance = () => ({
  type: CLEAR_BALANCE
})

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
    const {data} = await axios.post('/secured/account/transfer', {
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
    const bodyValues = {
      amount
    }
    if (recipientId){
      bodyValues.recipientId = recipientId
    }
    const {data} = await axios.put('/api/account/deposit', bodyValues)
    if (data.balance !== null && data.balance !== undefined){
      dispatch(gotBalance(data.balance))
    }
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

const initialState = {
  balance: null,
  error: null
}

export default function(state = initialState, action){
  switch (action.type){
    case GOT_BALANCE:
      return {...state, balance: action.balance}
    case GOT_ERROR:
      return {...state, error: action.error}
    case CLEAR_ERROR:
      return {...state, error: null}
    case CLEAR_BALANCE:
      return {...state, balance: null}
    default:
      return state
  }
}
