import axios from "axios"

// ACTION TYPES
const LOG_IN_USER = "LOG_IN_USER"
const LOG_OUT_USER = "LOG_OUT_USER"
const REGISTER_USER = "REGISTER_USER"

// ACTION CREATORS
const logInUser = (userInfo) => {
  return {
    type: LOG_IN_USER,
    payload: userInfo,
  }
}

// THUNK CREATORS
export const logInUserThunk = (email, password) => async (dispatch) => {
  try {
    const credentials = {
      email: email,
      password: password,
    }

    const { data } = await axios.post(
      "https://fair-hallway-265819.appspot.com/api/login",
      credentials
    )
    /* const { firstName, lastName } = data.userInfo
    const { email, id } = data.user

    const userInfo = {
      firstname: firstName,
      lastName: lastname,
      email: email,
      id: id,
    } */
    // incorrect credentials or server-side issue
    dispatch(logInUser(data))
  } catch (error) {
    console.log(error)
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
      }
    default:
      return state
  }
}

export default reducer
