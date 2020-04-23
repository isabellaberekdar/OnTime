import axios from "axios"
import events from "../../eventSampleData"

// ACTION TYPES
const GET_EVENTS = "GET_EVENTS"
const EDIT_EVENT = "EDIT_EVENT"
const CREATE_EVENT = "CREATE_EVENT"

// ACTION CREATORS
const getEvents = eventsList => {
  return {
    type: GET_EVENTS,
    payload: eventsList
  }
}

const createEvent = newEvent => {
  return {
    type: CREATE_EVENT,
    payload: newEvent
  }
}

// THUNK CREATORS
export const getEventsThunk = userId => async dispatch => {
  try {
    /*     
    const { data } = await axios.get(
      `/events/${userId}`
    );
    */
    // currently uses a hardcoded events list
    dispatch(getEvents(events))
  } catch (error) {
    console.log(error)
  }
}

export const createEventThunk = eventInfo => async dispatch => {
  try {
    const type = eventInfo.public ? "public" : "private"
    const { data } = await axios.post(
      `https://fair-hallway-265819.appspot.com/api/events/${type}`,
      eventsInfo
    )
    console.log("[Thunk]  new event: ", data)
    // handle errors
    dispatch(createEvent(data))
  } catch (error) {
    console.log(error)
  }
}

const initialState = {
  events: events,
  successfulEventCreation: null
}

// REDUCER
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.payload
      }

    // add new event to the list of events in the store
    case CREATE_EVENT:
      return {
        ...state,
        successfulEventCreation: true,
        events: [...events, action.payload]
      }
    default:
      return state
  }
}

export default eventsReducer
