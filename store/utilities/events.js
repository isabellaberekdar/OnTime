import axios from "axios"
import events from "../../eventSampleData"

// ACTION TYPES
const GET_EVENTS = "GET_EVENTS"
const EDIT_EVENT = "EDIT_EVENT"
const CREATE_EVENT = "CREATE_EVENT"
const EDIT_EVENT_ERROR = "EDIT_EVENT_ERROR"
const CREATE_EVENT_ERROR = "CREATE_EVENT_ERROR"
const CLEAR_ERROR = "CLEAR_ERROR"

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


const createEventError = () => {
  return {
    payload: "There was an error creating your event.",
    type: CREATE_EVENT_ERROR,
  }
}

const editEventError = () => {
  return {
    payload: "There was an error editing your event.",
    type: EDIT_EVENT_ERROR,
  }
}


export const clearError = () => {
  return {
    type: CLEAR_ERROR
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
      `https://fair-hallway-265819.appspot.com/api/events/${type}/create`,
      eventInfo
    )

    // TODO: handle errors
    data.eventName ? dispatch(createEvent(data)) : dispatch(createEventError())

    
  } catch (error) {
    console.log(error)
  }
}

const initialState = {
  error: false,
  events: events,
  successfulEventCreation: false,
  successfulEventEdit: false
}

// REDUCER
const eventsReducer = (state = initialState, action) => {
  console.log(action.type)
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

    case CREATE_EVENT_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulEventCreation: false
      }
    case EDIT_EVENT_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulEventEdit: false
      }
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
        successfulEventCreation: false,
        successfulEventEdit: false
      }
    default:
      return state
  }
}

export default eventsReducer
