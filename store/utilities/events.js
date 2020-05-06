import axios from "axios"
import {
  LOG_IN_USER,
  SET_EVENTS,
  EDIT_PUBLIC_EVENT,
  EDIT_PRIVATE_EVENT,
  SEARCH_EVENTS,
  JOIN_EVENT,
  EDIT_EVENT_ERROR,
  CREATE_PUBLIC_EVENT,
  CREATE_PRIVATE_EVENT,
  CREATE_EVENT_ERROR,
  JOIN_ERROR,
  SEARCH_ERROR,
  CLEAR_ERROR
} from "../../actionTypes"

// ACTION CREATORS
const getEvents = events => {
  return {
    type: GET_EVENTS,
    payload: { public: events.public, private: events.private }
  }
}

const joinEvent = updatedEvent => {
  return {
    type: JOIN_EVENT,
    payload: updatedEvent
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
    payload: event
  }
}

const editPrivateEvent = event => {
  return {
    type: EDIT_PRIVATE_EVENT,
    payload: event
  }
}

const searchEvents = searchResults => {
  return {
    payload: searchResults,
    type: SEARCH_EVENTS
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

const searchError = error => {
  return {
    payload: error,
    type: SEARCH_ERROR
  }
}

const joinEventError = error => {
  return {
    payload: error,
    type: JOIN_ERROR
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
      `https://avian-infusion-276423.ue.r.appspot.com/api/events/${type}/create`,
      eventInfo
    )

    if (data.eventName == undefined) {
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
        code: data.code,
        privateEvent: type == "private",
        attendees: 1
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
  try {
    const type = eventInfo.public == true ? "public" : "private"
    delete eventInfo["public"]

    const { data } = await axios.put(
      `https://avian-infusion-276423.ue.r.appspot.com/api/events/${type}/edit`,
      eventInfo
    )

    //TODO: handle notifications

    if (!data.eventName) {
      dispatch(editEventError())
    } else {
      const editedEvent = {
        ...data,
        startDate: eventInfo.changes.startDate,
        endDate: eventInfo.changes.endDate,
        privateEvent: type == "private"
      }

      // remove the notification object that came from the response object
      delete editedEvent["notification"]
      type === "public"
        ? dispatch(editPublicEvent(editedEvent))
        : dispatch(editPrivateEvent(editedEvent))
    }
  } catch (error) {
    console.log(error)
  }
}

export const searchEventsThunk = query => async dispatch => {
  try {
    const { data } = await axios.put(
      `https://avian-infusion-276423.ue.r.appspot.com/api/events/public/search`,
      query
    )
    console.log(data)
    if (data.error) {
      dispatch(searchError("There was an error while searching."))
    }

    const results = data.event_public

    results.length == 0
      ? dispatch(searchError("There were no events found matching your query."))
      : dispatch(searchEvents(data.event_public))
  } catch (error) {
    console.log(error)
  }
}

export const joinEventThunk = info => async dispatch => {
  try {
    const { data } = await axios.post(
      "https://avian-infusion-276423.ue.r.appspot.com/api/events/public/join",
      info
    )
    if (data.event) {
      const updatedEvent = {
        ...data.event,
        attendees: data.event.attendees + 1
      }
      dispatch(joinEvent(updatedEvent))
    } else {
      dispatch(joinEventError("There was an error joining the event."))
    }
  } catch (error) {
    console.log(error)
  }
}

// REDUCER
const initialState = {
  private: [],
  public: [],
  searchResults: [],
  error: false,
  successfulEventCreation: false,
  successfulEventEdit: false,
  successfulSearch: false,
  successfulJoin: false
}

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_USER:
    case SET_EVENTS:
      // add a key into each event object that states whether or not the event is private
      const privateEvents = action.payload.events.private.map(event => {
        return { ...event, privateEvent: true }
      })
      const publicEvents = action.payload.events.public.map(event => {
        return { ...event, privateEvent: false }
      })
      return {
        ...state,
        private: privateEvents,
        public: publicEvents
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
    case SEARCH_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulSearch: false
      }
    case JOIN_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulJoin: false
      }
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
        successfulEventCreation: false,
        successfulEventEdit: false,
        successfulSearch: false,
        searchResults: []
      }
    case EDIT_PUBLIC_EVENT:
      return {
        ...state,
        error: null,
        successfulEventEdit: true,
        public: state.public.map(event => (event.id === action.payload.id ? action.payload : event))
      }
    case EDIT_PRIVATE_EVENT:
      return {
        ...state,
        error: null,
        successfulEventEdit: true,
        private: state.private.map(event =>
          event.id === action.payload.id ? action.payload : event
        )
      }
    case SEARCH_EVENTS:
      return {
        ...state,
        error: null,
        successfulSearch: true,
        searchResults: action.payload
      }
    case JOIN_EVENT:
      return {
        ...state,
        error: null,
        successfulJoin: true,
        // add event to local events list
        public: [...state.public, action.payload]
      }
    default:
      return state
  }
}

export default eventsReducer
