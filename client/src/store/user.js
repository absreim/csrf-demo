import axios from 'axios'

const GOT_USER = 'GOT_USER'
const REMOVE_USER = 'REMOVE_USER'
const GOT_ERROR = 'GOT_ERROR'
const CLEAR_ERROR = 'CLEAR_ERROR'

const gotUser = user => {
  return {
    type: GOT_USER,
    user
  }
}

const removeUser = () => {
  return {
    type: REMOVE_USER
  }
}

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

export const me = () => async dispatch => {
  try {
    dispatch(clearError())
    const {data} = await axios.get('/auth/status')
    if (data.username){
      dispatch(gotUser(data))
    }
    else {
      dispatch(removeUser())
    }
  }
  catch (err) {
    dispatch(gotError(err))
  }
}

export const logout = () => async dispatch => {
  try {
    dispatch(clearError())
    await axios.post('/auth/logout')
    dispatch(removeUser())
  }
  catch (err) {
    dispatch(gotError(err))
  }
}

export const login = (username, password) => async dispatch => {
  try {
    dispatch(clearError())
    const {data} = await axios.post('/auth/login', {
      username,
      password
    })
    dispatch(gotUser(data))
  }
  catch (err) {
    dispatch(gotError(err))
  }
}

export const signup = (username, password) => async dispatch => {
  try {
    dispatch(clearError())
    const {data} = await axios.post('/auth/create', {
      username,
      password
    })
    dispatch(gotUser(data))
  }
  catch (err) {
    dispatch(gotError(err))
  }
}

const initialState = {
  user: null,
  error: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_USER:
      return {...state, user: action.user}
    case REMOVE_USER:
      return {...state, user: null}
    case GOT_ERROR:
      return {...state, error: action.error}
    case CLEAR_ERROR:
      return {...state, error: null}
    default:
      return state
  }
}
