import axios from "axios"
import {
  LOG_IN_USER,
  SET_EVENTS,
  CREATE_PUBLIC_EVENT,
  CREATE_PRIVATE_EVENT,
  JOIN_EVENT,
  EDIT_PUBLIC_EVENT,
  EDIT_PRIVATE_EVENT,
  SEARCH_EVENTS,
  DELETE_PRIVATE_EVENT,
  DELETE_PUBLIC_EVENT,
  DELETE_EVENT_ERROR,
  REMOVE_EVENT,
  REMOVE_EVENT_ERROR,
  CREATE_EVENT_ERROR,
  EDIT_EVENT_ERROR,
  JOIN_ERROR,
  SEARCH_ERROR,
  CLEAR_ERROR,
  EDIT_START_LOCATION,
  EDIT_START_LOCATION_ERROR,
  LEAVE_EVENT,
  LEAVE_EVENT_ERROR
} from "../../actionTypes"
import {ONTIME_API} from "react-native-dotenv"

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

const deletePrivateEvent = eventId => {
  return {
    type: DELETE_PRIVATE_EVENT,
    payload: eventId
  }
}

const deletePublicEvent = eventId => {
  return {
    type: DELETE_PUBLIC_EVENT,
    payload: eventId
  }
}

const deleteEventError = () => {
  return {
    type: DELETE_EVENT_ERROR,
    payload: "There was an error deleting the event."
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

const editStartLocationError = error => {
  return {
    payload: "There was an error updating your start location.",
    type: EDIT_START_LOCATION_ERROR
  }
}

const editStartLocation = () => {
  return {
    type: EDIT_START_LOCATION
  }
}

const leaveEvent = eventInfo => {
  return {
    payload: eventInfo,
    type: LEAVE_EVENT
  }
}

const leaveEventError = () => {
  return {
    payload: "There was an error when leaving the event.",
    type: LEAVE_EVENT_ERROR
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
      `${ONTIME_API}/api/events/${type}/create`,
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
        attendees: 1,
        startLat: eventInfo.startLat,
        startLng: eventInfo.startLng
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
      `${ONTIME_API}/api/events/${type}/edit`,
      eventInfo
    )

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
      `${ONTIME_API}/api/events/public/search`,
      query
    )

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
      `${ONTIME_API}/api/events/public/join`,
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

export const deleteEventThunk = info => async dispatch => {
  try {
    const type = info.privateEvent ? "private" : "public"
    const { data } = await axios.put(
      `${ONTIME_API}/api/events/${type}/delete`,
      info
    )

    info.privateEvent
      ? dispatch(deletePrivateEvent(info.eventId))
      : dispatch(deletePublicEvent(info.eventId))
  } catch (error) {
    console.log(error)
  }
}

export const editStartLocationThunk = info => async dispatch => {
  try {
    const { data } = await axios.put(
      `${ONTIME_API}/api/events/public/edit/start`,
      info
    )
    data.eventId ? dispatch(editStartLocation()) : dispatch(editStartLocationError())
  } catch (error) {
    console.log(error)
  }
}

export const leaveEventThunk = info => async dispatch => {
  try {
    const { data } = await axios.delete(
      `${ONTIME_API}/api/events/public/leave`,
      {data: info},
    )
    data.userId ? dispatch(leaveEvent(data)) : dispatch(leaveEventError())
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
  successfulEventDeletion: false,
  successfulEventEdit: false,
  successfulSearch: false,
  successfulJoin: false,
  successfulStartLocationEdit: false,
  successfulLeave: false
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
        return {
          ...event.event,
          startLat: event.user.startLat,
          startLng: event.user.startLng,
          privateEvent: false
        }
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
        successfulEventDeletion: false,
        successfulJoin: false,
        successfulStartLocationEdit: false,
        successfulLeave: false,
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
    case DELETE_EVENT_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulEventDeletion: false
      }
    case DELETE_PRIVATE_EVENT:
      return {
        ...state,
        error: null,
        successfulEventDeletion: true,
        // remove event from local events list
        private: state.private.filter(event => event.id != action.payload)
      }
    case DELETE_PUBLIC_EVENT:
      return {
        ...state,
        error: null,
        successfulEventDeletion: true,
        // remove event from local events list
        public: state.public.filter(event => event.id != action.payload)
      }

    case EDIT_START_LOCATION:
      return {
        ...state,
        error: null,
        successfulStartLocationEdit: true
        // update start lat and start lng locally?
      }
    case EDIT_START_LOCATION_ERROR:
      return {
        ...state,
        error: action.payload,
        successfulStartLocationEdit: false
      }

      case LEAVE_EVENT_ERROR:
        return {
          ...state,
          error: action.payload,
          successfulLeave: false,
        }
    case LEAVE_EVENT:
      return {
        ...state,
        error: null,
        successfulLeave: true,
        // remove event from local events list
        public: state.public.filter(event => event.id != action.payload.eventId)
      }
    default:
      return state
  }
}

export default eventsReducer
