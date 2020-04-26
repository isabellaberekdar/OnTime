import axios from "axios"
import {
  LOG_IN_USER,
  SET_EVENTS,
  EDIT_EVENT,
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
    default:
      return state
  }
}

export default eventsReducer
