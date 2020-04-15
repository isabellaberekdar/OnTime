import axios from 'axios';

// ACTION TYPES
const LOG_IN_USER = 'LOG_IN_USER';
const LOG_OUT_USER = 'LOG_OUT_USER';
const REGISTER_USER = 'REGISTER_USER';

// ACTION CREATORS
const logInUser = userInfo => {
  return {
    type: LOG_IN_USER,
    payload: userInfo,
  };
};

// THUNK CREATORS
export const logInUserThunk = (email, password) => async dispatch => {
  try {
    const credentials = {
      email: email,
      password: password,
    };

    const { data } = await axios.post('/login', credentials);

    // incorrect credentials or server-side issue
    dispatch(logInUser(data));
  } catch (error) {
    console.log(error);
  }
};

// REDUCER
const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOG_IN_USER:
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
