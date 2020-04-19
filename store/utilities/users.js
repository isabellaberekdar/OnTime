import axios from "axios"

// ACTION TYPES
const LOG_IN_USER = "LOG_IN_USER"
const REGISTER_USER = "REGISTER_USER"
const LOGIN_ERROR = "LOGIN_ERROR"
const REGISTRATION_ERROR = "REGISTRATION_ERROR"

// ACTION CREATORS
const logInUser = userInfo => {
  return {
    type: LOG_IN_USER,
    payload: userInfo,
  }
}

const registerUser = () => {
  return {
    type: REGISTER_USER,
  }
}

const loginError = error => {
  return {
    type: LOGIN_ERROR,
    payload: error,
  }
}

const registrationError = error => {
  return {
    type: REGISTRATION_ERROR,
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
      dispatch(loginError(data.authError))
    } else if (data.error) {
      dispatch(loginError(data.error))
    } else {
      dispatch(logInUser(data))
    }
  } catch (error) {
    //console.log(error)
  }
}

export const registerUserThunk = (email, password, firstName, lastName) => async dispatch => {
  try {
    const info = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    }

    const { data } = await axios.post("https://fair-hallway-265819.appspot.com/api/register", info)
    
    if (data.error) {
      dispatch(registrationError(data.error))
    } else if (data.duplicateUserError) {
      dispatch(registrationError(data.duplicateUserError))
    } else {
      dispatch(registerUser(data))
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
        successfulLogin: true,
      }
    case REGISTER_USER:
      return {
        ...state,
        error: null,
        successfulRegistration: true,
      }
    case LOGIN_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulLogin: false,
      }
    case REGISTRATION_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulRegistration: false,
      }
    default:
      return state
  }
}

export default reducer
