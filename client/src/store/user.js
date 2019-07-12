import axios from 'axios'

const GOT_USER = 'GOT_USER'
const REMOVE_USER = 'REMOVE_USER'

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

export const me = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/auth/status')
    dispatch(gotUser(data))
  }
  catch (err) {
    console.error(err)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/api/auth/logout')
    dispatch(removeUser())
  }
  catch (err) {
    console.error(err)
  }
}

export const login = (username, password) => async dispatch => {
  try {
    const {data} = await axios.post('/api/auth/login', {
      username,
      password
    })
    dispatch(gotUser(data))
  }
  catch (err) {
    console.error(err)
  }
}

export const signup = (username, password) => async dispatch => {
  try {
    const {data} = await axios.post('/api/auth/create', {
      username,
      password
    })
    dispatch(gotUser(data))
  }
  catch (err) {
    console.error(err)
  }
}

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_USER:
      return action.user
    case REMOVE_USER:
      return initialState
    default:
      return state
  }
}
