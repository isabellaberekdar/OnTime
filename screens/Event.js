import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, IconButton, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import {
  joinEventThunk,
  deleteEventThunk,
  editStartLocationThunk,
  leaveEventThunk,
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
    const { successfulJoin, successfulEventDeletion, successfulLeave, navigation } = this.props
    if (successfulJoin === true || successfulEventDeletion === true || successfulLeave) {
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
    const { deleteEvent } = this.props

    const info = {
      code: code,
      eventId: id,
      privateEvent: privateEvent
    }

    deleteEvent(info)
  }

  leave = async () => {
    const { id } = this.props.route.params
    const { userId, leaveEvent } = this.props

    const info = {
      userId: userId,
      eventId: id
    }

    leaveEvent(info)
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
      <View style={styles.eventContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{eventName}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.rowsContainer}>
            <View style={styles.row}>
              <IconButton icon='map-marker' size={30} />
              <Text style={styles.text}>{locationName}</Text>
            </View>
            <View style={styles.row}>
              <IconButton icon='calendar' size={30} />
              <Text style={styles.text}>{formatDateEnglishEST(startDate)}</Text>
            </View>
            {repeatWeekly == 1 && (
              <View style={styles.row}>
                <IconButton icon='calendar' size={30} />
                <Text style={styles.text}>{binaryToStringSchedule(weeklySchedule)}</Text>
              </View>
            )}
            <View style={styles.row}>
              <IconButton icon='clock' size={30} />
              <Text style={styles.text}>{convert24HourTime(time)}</Text>
            </View>

            {!privateEvent && (
              <View style={styles.row}>
                <IconButton icon='account' size={30} />
                <Text style={styles.text}>
                  {attendees} {attendees > 1 ? " people are" : "person is"} attending this event
                </Text>
              </View>
            )}
          </View>

          {/* show join button if the event is not made by the user and the event is not on the user's list of events that they are attending */}
          {userId != ownerId && !attendingIds.has(id) && !this.state.settingLocation && (
            <Button style={styles.button} onPress={() => this.setState({ settingLocation: true })}>Join Event</Button>
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
              <Button style={styles.button} onPress={() => this.join()}>Join Event</Button>
            </>
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
              <Button style={styles.button} onPress={() => this.edit()}>Update Start Location</Button>
            </>
          )}
          {successfulStartLocationEdit && <Text>Your start location has been updated.</Text>}
          {/* user can edit start location for an event they have already joined, or they can leave that event */}
          {userId != ownerId && attendingIds.has(id) && (
            <>
              {!this.state.settingLocation && (
                <Button style={styles.button} onPress={() => this.setState({ settingLocation: true })}>
                  Change Start Location
                </Button>
              )}
              <Button style={styles.button} onPress={() => this.leave()}>Leave Event</Button>
            </>
          )}
          {/* show delete button if the user is the event creator */}
          {userId == ownerId && <Button style={styles.button} onPress={() => this.delete()}>Delete Event</Button>}
          <Text>{error}</Text>
          <Text>{locationError}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    textAlign: "center",
    marginTop: "10%"
  },
  header: {
    backgroundColor: "#b8d9cb",
    height: "18%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: "2%"
  },
  text: {
    fontSize: 17
  },
  headerText: {
    fontSize: 30
  },
  input: {
    width: "75%"
  },
  row: {
    flexDirection: "row",
    margin: 1,
    alignItems: "center"
  },
  rowsContainer: {
    alignItems: "flex-start"
  },
  eventContainer: {
    flex: 1
  },
  button: {marginTop: '5%'}
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
    successfulLeave: events.successfulLeave,
    publicEvents: events.public
  }
}

const mapDispatch = dispatch => {
  return {
    joinEvent: info => dispatch(joinEventThunk(info)),
    deleteEvent: info => dispatch(deleteEventThunk(info)),
    editStartLocation: info => dispatch(editStartLocationThunk(info)),
    leaveEvent: info => dispatch(leaveEventThunk(info)),
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(Event)
