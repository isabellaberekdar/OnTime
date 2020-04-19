import axios from "axios"

// ACTION TYPES
const LOG_IN_USER = "LOG_IN_USER"
const REGISTER_USER = "REGISTER_USER"
const LOG_ERROR = "LOG_ERROR"

// ACTION CREATORS
const logInUser = userInfo => {
  return {
    type: LOG_IN_USER,
    payload: userInfo,
  }
}

const logError = error => {
  return {
    type: LOG_ERROR,
    payload: error,
  }
}



// THUNK CREATORS
export const logInUserThunk = (email, password) => async dispatch => {
  try {
    const credentials = {
      email: email,
      password: password,
    }

    const { data } = await axios.post(
      "https://fair-hallway-265819.appspot.com/api/login",
      credentials
    )
    if (data.authError) {
      dispatch(logError(data.authError))
    } else if (data.error) {
      dispatch(logError(data.error))
    } else {
      console.log('logging in')
      dispatch(logInUser(data))
    }
  } catch (error) {
    //console.log(error)
  }
}

// REDUCER
const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOG_IN_USER:
      const { firstName, lastName } = action.payload.userInfo
      const { email, id } = action.payload.user
      return {
        ...state,
        firstName: firstName,
        lastName: lastName,
        email: email,
        id: id,
        error: null,
        successfulLogin: true
      }
    case LOG_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulLogin: false
      }

    default:
      return state
  }
}

export default reducer
