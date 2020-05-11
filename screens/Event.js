import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import {
  joinEventThunk,
  deleteEventThunk,
  editStartLocationThunk,
  clearError
} from "../store/utilities/events"
import {
  binaryToStringSchedule,
  formatDateEnglishEST,
  convert24HourTime,
  getCoordinates
} from "../utilities"
class Event extends React.Component {
  state = {
    eventStart: "",
    settingLocation: false,
    error: null,
    locationError: null
  }

  /* TODO: add error handling so that you can't submit with no event */

  componentDidUpdate() {
    const { successfulJoin, successfulEventDeletion, navigation } = this.props
    if (successfulJoin === true || successfulEventDeletion === true) {
      navigation.navigate("Home")
    }
  }

  componentDidMount() {
    this.props.clearError()
  }

  join = async () => {
    const { code } = this.props.route.params
    const { userId, joinEvent } = this.props
    const { eventStart } = this.state
    this.setState({ locationError: null })

    /* get coordinates from eventStart */
    const coordinates = await getCoordinates(eventStart, eventStart)
    if (coordinates) {
      const info = {
        userId: userId,
        code: code,
        startLat: coordinates.start.lat,
        startLng: coordinates.start.lng
      }
      joinEvent(info)
    } else {
      this.setState({ locationError: "The location that you have entered is invalid." })
    }
  }

  edit = async () => {
    const { code, id } = this.props.route.params
    const { userId, editStartLocation } = this.props
    const { eventStart } = this.state
    this.setState({ locationError: null })

    /* convert eventStart into lat and lng */

    /* get coordinates from eventStart */
    const coordinates = await getCoordinates(eventStart, eventStart)
    if (coordinates) {
      const info = {
        userId: userId,
        code: code,
        eventId: id,
        startLat: coordinates.start.lat,
        startLng: coordinates.start.lng
      }
      editStartLocation(info)
    } else {
      this.setState({ locationError: "The location that you have entered is invalid." })
    }
  }

  delete = async () => {
    const { code, id, privateEvent } = this.props.route.params
    const { userId, deleteEvent, navigation } = this.props

    const info = {
      code: code,
      eventId: id,
      privateEvent: privateEvent
    }

    deleteEvent(info)
  }

  render() {
    const { userId, publicEvents, navigation, successfulStartLocationEdit, error } = this.props
    const {
      code,
      endDate,
      eventName,
      id,
      locationName,
      ownerId,
      repeatWeekly,
      startDate,
      time,
      weeklySchedule,
      privateEvent,
      attendees
    } = this.props.route.params

    const { eventStart, settingLocation, locationError } = this.state
    // get a set of ids of events the user is attending
    const attendingIds = new Set(publicEvents.map(event => event.id))

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{eventName}</Text>
        <Text style={styles.text}>Location:</Text>
        <Text style={styles.text}>{locationName}</Text>
        <Text style={styles.text}>Starts:</Text>
        <Text style={styles.text}>{formatDateEnglishEST(startDate)}</Text>
        <Text style={styles.text}>at {convert24HourTime(time)}</Text>
        {repeatWeekly == 1 && (
          <>
            <Text style={styles.text}>{"Occurs weekly on:"}</Text>
            <Text style={styles.text}>{binaryToStringSchedule(weeklySchedule)}</Text>
          </>
        )}
        {!privateEvent && (
          <Text style={styles.text}>
            {attendees} {attendees > 1 ? " people are" : "person is"} attending this event
          </Text>
        )}
        {/* show join button if the event is not made by the user and the event is not on the user's list of events that they are attending */}
        {userId != ownerId && !attendingIds.has(id) && !this.state.settingLocation && (
          <Button onPress={() => this.setState({ settingLocation: true })}>Join Event</Button>
        )}
        {settingLocation && !attendingIds.has(id) && (
          <>
            <TextInput
              label='Event Starting Location'
              value={eventStart}
              textContentType='location'
              autoCapitalize='none'
              onChangeText={eventStart => this.setState({ eventStart })}
              mode='outlined'
              style={styles.input}
            />
            <Button onPress={() => this.join()}>Join Event</Button>
          </>
        )}

        {/* user can edit start location for an event they have already joined */}
        {userId != ownerId && attendingIds.has(id) && !this.state.settingLocation && (
          <Button onPress={() => this.setState({ settingLocation: true })}>
            Change Start Location
          </Button>
        )}
        {settingLocation && attendingIds.has(id) && !successfulStartLocationEdit && (
          <>
            <TextInput
              label='New Start Location'
              value={eventStart}
              textContentType='location'
              autoCapitalize='none'
              onChangeText={eventStart => this.setState({ eventStart })}
              mode='outlined'
              style={styles.input}
            />
            <Button onPress={() => this.edit()}>Update Start Location</Button>
          </>
        )}
        {successfulStartLocationEdit && <Text>Your start location has been updated.</Text>}

        {/* show delete button if the user is the event creator */}
        {userId == ownerId && <Button onPress={() => this.delete()}>Delete Event</Button>}
        <Text>{error}</Text>
        <Text>{locationError}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: "5%",
    paddingTop: "10%"
  },
  text: {
    fontSize: 20
  },
  headerText: {
    fontSize: 25
  },
  input: {
    width: "75%"
  }
})

const mapState = state => {
  const { events, userInfo } = state

  return {
    firstName: userInfo.firstName ?? "unknown",
    userId: userInfo.id,
    error: events.error,
    successfulJoin: events.successfulJoin,
    successfulEventDeletion: events.successfulEventDeletion,
    successfulStartLocationEdit: events.successfulStartLocationEdit,
    publicEvents: events.public
  }
}

const mapDispatch = dispatch => {
  return {
    joinEvent: info => dispatch(joinEventThunk(info)),
    deleteEvent: info => dispatch(deleteEventThunk(info)),
    editStartLocation: info => dispatch(editStartLocationThunk(info)),
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(Event)
