import axios from "axios"
import events from "../../eventSampleData"

// ACTION TYPES
const GET_EVENTS = "GET_EVENTS"
const EDIT_EVENT = "EDIT_EVENT"
const CREATE_EVENT = "CREATE_EVENT"

// ACTION CREATORS
const getEvents = (eventsList) => {
  return {
    type: GET_EVENTS,
    payload: eventsList,
  }
}

// THUNK CREATORS
export const getEventsThunk = (userId) => async (dispatch) => {
  try {
    /*     
    const { data } = await axios.get(
      `/events/${userId}`
    );
    */
    // currently uses a hardcoded events list
    dispatch(getEvents(events))
  } catch (error) {
    //console.log(error)
  }
}

const initialState = {
  events: events,
}
// REDUCER
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.payload,
      }
    default:
      return state
  }
}

export default eventsReducer
