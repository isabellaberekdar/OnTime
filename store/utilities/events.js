import axios from "axios"
import {
  LOG_IN_USER,
  SET_EVENTS,
  EDIT_PUBLIC_EVENT,
  EDIT_PRIVATE_EVENT,
  EDIT_EVENT_ERROR,
  CREATE_PUBLIC_EVENT,
  CREATE_PRIVATE_EVENT,
  CREATE_EVENT_ERROR,
  CLEAR_ERROR
} from "../../actionTypes"

// ACTION CREATORS
const getEvents = events => {
  return {
    type: GET_EVENTS,
    payload: { public: events.public, private: events.private }
  }
}

const createPublicEvent = newEvent => {
  return {
    type: CREATE_PUBLIC_EVENT,
    payload: newEvent
  }
}

const createPrivateEvent = newEvent => {
  return {
    type: CREATE_PRIVATE_EVENT,
    payload: newEvent
  }
}

const editPublicEvent = event => {
  return {
    type: EDIT_PUBLIC_EVENT,
    payload:event
  }
}

const editPrivateEvent = event => {
  return {
    type: EDIT_PRIVATE_EVENT,
    payload: event
  }
}

const createEventError = () => {
  return {
    payload: "There was an error creating your event.",
    type: CREATE_EVENT_ERROR
  }
}

const editEventError = () => {
  return {
    payload: "There was an error editing your event.",
    type: EDIT_EVENT_ERROR
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
    //dispatch(getEvents({ public: publicEvents, private: privateEvents }))
  } catch (error) {
    console.log(error)
  }
}

export const createEventThunk = eventInfo => async dispatch => {
  try {
    const type = eventInfo.private ? "private" : "public"

    const { data } = await axios.post(
      `https://fair-hallway-265819.appspot.com/api/events/${type}/create`,
      eventInfo
    )

    if (!data.eventName) {
      dispatch(createEventError())
    } else {
      const newEvent = {
        id: data.id,
        endDate: data.endDate,
        eventName: data.eventName,
        lat: data.lat,
        lng: data.lng,
        locationName: data.locationName,
        ownerId: data.ownerId,
        repeatWeekly: data.repeatWeekly,
        startDate: data.startDate,
        time: data.time,
        weeklySchedule: data.weeklySchedule,
        ...(type === "private" && { code: data.code })
      }
      type === "public"
        ? dispatch(createPublicEvent(newEvent))
        : dispatch(createPrivateEvent(newEvent))
    }
  } catch (error) {
    console.log(error)
  }
}

export const editEventThunk = eventInfo => async dispatch => {
  /* const eventInfo = {
  {
    "ownerId": 1,
    "eventId": 27,
    "public": true
    "changes": {
        "locationName": "Baruch College Library",
        "lat": 40.7404,
        "lng": -73.9832
        ....
    }}}
*/
  try {
    const type = eventInfo.private ? "private" : "public"
    console.log('eventInfo b4 call', eventInfo)
    delete  eventInfo["private"];

    const { data } = await axios.put(
      `https://fair-hallway-265819.appspot.com/api/events/${type}/edit`,
      eventInfo
    )
    console.log(data)
    if (data.eventName) {
      dispatch(editEventError())
    } else {
      const newEvent = {
        id: data.id,
        endDate: data.endDate,
        eventName: data.eventName,
        lat: data.lat,
        lng: data.lng,
        locationName: data.locationName,
        ownerId: data.ownerId,
        repeatWeekly: data.repeatWeekly,
        startDate: data.startDate,
        time: data.time,
        weeklySchedule: data.weeklySchedule,
        ...(type === "private" && { code: data.code })
      }
      type === "private" ? dispatch(editPublicEvent(newEvent)) : dispatch(editPrivateEvent(newEvent))
    }
  } catch (error) {
    console.log(error)
  }
}

const initialState = {
  error: false,
  private: [],
  public: [],
  successfulEventCreation: false,
  successfulEventEdit: false
}

// REDUCER
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_USER:
    case SET_EVENTS:
      return {
        ...state,
        private: action.payload.events.private,
        public: action.payload.events.public
      }
    // add new event to the list of events in the store
    case CREATE_PUBLIC_EVENT:
      return {
        ...state,
        successfulEventCreation: true,
        public: [...state.public, action.payload]
      }
    case CREATE_PRIVATE_EVENT:
      return {
        ...state,
        successfulEventCreation: true,
        private: [...state.private, action.payload]
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
    case EDIT_PUBLIC_EVENT:
      console.log('&&&', action.payload)
      return {
        ...state,
        error: null,
        successfulEventEdit: true,
        public: state.public.map(event => (event.id === action.payload.id ? action.payload : event))
      }
    case EDIT_PRIVATE_EVENT:
      console.log('ZZZZ', action.payload)
      console.log(state.private.map(event =>
        event.id === action.payload.id ? action.payload : event))
        action.payload.id = 138
      return {
        ...state,
        error: null,
        successfulEventEdit: true,
        private: state.private.map(event =>
          event.id === action.payload.id ? action.payload : event
        )
      }
    default:
      return state
  }
}

export default eventsReducer
