import axios from "axios"
import {
  LOG_IN_USER,
  REGISTER_USER,
  LOGIN_ERROR,
  REGISTRATION_ERROR,
  CLEAR_ERROR
} from "../../actionTypes"

// ACTION CREATORS
const logInUser = userInfo => {
  return {
    type: LOG_IN_USER,
    payload: userInfo
  }
}

const registerUser = () => {
  return {
    type: REGISTER_USER
  }
}

const loginError = error => {
  return {
    type: LOGIN_ERROR,
    payload: error
  }
}

const registrationError = error => {
  return {
    type: REGISTRATION_ERROR,
    payload: error
  }
}

export const clearError = () => {
  return {
    type: CLEAR_ERROR
  }
}

// THUNK CREATORS
export const logInUserThunk = (email, password) => async dispatch => {
  try {
    const credentials = {
      email: email,
      password: password
    }

    const { data } = await axios.post(
      "https://avian-infusion-276423.ue.r.appspot.com/api/login",
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
    console.log(error)
  }
}

export const registerUserThunk = (email, password, firstName, lastName) => async dispatch => {
  try {
    const info = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    }

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const { data } = await axios.post(
      "https://avian-infusion-276423.ue.r.appspot.com/api/register",
      info,
      config
    )

    if (data.error) {
      dispatch(registrationError(data.error))
    } else if (data.duplicateUserError) {
      dispatch(registrationError(data.duplicateUserError))
    } else if (data.firstName) {
      dispatch(registerUser(data))
    }
  } catch (error) {
    console.log(error)
  }
}

const initialState = {
  error: null,
  successfulLogin: false,
  successfulRegistration: false
}
// REDUCER
const reducer = (state = initialState, action) => {
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
    case REGISTER_USER:
      return {
        ...state,
        error: null,
        successfulRegistration: true
      }
    case LOGIN_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulLogin: false
      }
    case REGISTRATION_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulRegistration: false
      }
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
        successfulLogin: false,
        successfulRegistration: false
      }
    default:
      return state
  }
}

export default reducer
