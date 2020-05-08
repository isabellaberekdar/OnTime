import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button } from "react-native-paper"
import { connect } from "react-redux"
import { joinEventThunk, deleteEventThunk } from "../store/utilities/events"
import { binaryToStringSchedule, formatDateTimeEnglishEST } from "../utilities"
import Loading from "."
class Event extends React.Component {
  componentDidUpdate() {
    const { successfulJoin, successfulEventDeletion, navigation } = this.props
    if (successfulJoin === true || successfulEventDeletion === true) {
      navigation.navigate("Home")
    }
  }

  join = async () => {
    const { code } = this.props.route.params
    const { userId, joinEvent } = this.props

    const info = {
      userId: userId,
      code: code
    }

    joinEvent(info)
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
    const { userId, publicEvents, navigation, error } = this.props
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

    // get a set of ids of events the user is attending
    const attendingIds = new Set(publicEvents.map(event => event.id))

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{eventName}</Text>
        <Text style={styles.text}>Location:</Text>
        <Text style={styles.text}>{locationName}</Text>
        <Text style={styles.text}>Starts:</Text>
        <Text style={styles.text}>{formatDateTimeEnglishEST(startDate)}</Text>
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
        {userId != ownerId && !attendingIds.has(id) && (
          <Button onPress={() => this.join()}>Join Event</Button>
        )}
        {/* show delete button if the user is the event creator */}
        {userId == ownerId && <Button onPress={() => this.delete()}>Delete Event</Button>}
        <Text>{error}</Text>
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
    publicEvents: events.public
  }
}

const mapDispatch = dispatch => {
  return {
    joinEvent: info => dispatch(joinEventThunk(info)),
    deleteEvent: info => dispatch(deleteEventThunk(info))
  }
}

export default connect(mapState, mapDispatch)(Event)
