import React from "react"
import axios from "axios"
import { View, StyleSheet, Text, TouchableNativeFeedbackBase } from "react-native"
import { Button, TextInput, Switch } from "react-native-paper"
import { editEventThunk, editStartLocationThunk, clearError } from "../store/utilities/events"
import { connect } from "react-redux"
import { WeekdayPicker } from "../components"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import {
  formatDateEnglishEST,
  formatDateTimeEnglishEST,
  formatDateEST,
  formatTimeEST,
  getUTCDate,
  getCoordinates
} from "../utilities"
class EditEvent extends React.Component {
  constructor(props) {
    super(props)

    const {
      code,
      endDate,
      eventName,
      id,
      lat,
      lng,
      locationName,
      ownerId,
      repeatWeekly,
      startDate,
      time,
      weeklySchedule,
      privateEvent
    } = props.route.params
    this.state = {
      eventName: eventName,
      startDate: getUTCDate(startDate, time),
      endDate: getUTCDate(endDate, time),
      eventLocation: locationName,
      publicEvent: !privateEvent,
      repeatWeekly: repeatWeekly == 0 ? false : true,
      showStartDatePicker: false,
      showEndDatePicker: false,
      eventStart: "",
      days: weeklySchedule,
      locationError: null
    }
  }

  componentDidMount() {
    this.props.clearError()
  }

  // If event edited successfully, redirect back to Home screen
  componentDidUpdate(prevProps) {
    const { navigation, successfulEventEdit } = this.props
    if (prevProps.successfulEventEdit != successfulEventEdit && successfulEventEdit === true) {
      navigation.navigate("Home")
    }
  }

  //TODO: validation
  edit = async () => {
    if (true) {
      const { editEvent, userId, editStartLocation } = this.props
      const { code, id, privateEvent } = this.props.route.params

      const {
        eventLocation,
        days,
        startDate,
        endDate,
        eventName,
        repeatWeekly,
        publicEvent,
        eventStart,
        locationError
      } = this.state

      // startDate and endDate are in format: 2020-04-23T22:05:43.170Z
      const start = formatDateEST(startDate)
      const time = formatTimeEST(startDate)
      const end = !repeatWeekly ? start : formatDateEST(endDate)

      /* edit start location (only if something is entered into the field) */
      let startLat, startLng, coordinates
      const newStart = eventStart != ""
      if (newStart) {
        /* convert start location into coordinates here */
        coordinates = await getCoordinates(eventStart, eventLocation)
        if (!coordinates) {
          this.setState({ locationError: "Invalid location." })
        }
      }

      /* if event is public a separate call is required to set a new location */
      if (!privateEvent && newStart && coordinates) {
        const info = {
          userId: userId,
          eventId: id,
          startLat: coordinates.start.lat,
          startLng: coordinates.start.lng
        }
        editStartLocation(info)
      }
      /* if no new start location or new start location and valid location entered by user, update event */
      if ((newStart && coordinates) || !newStart) {
        const eventInfo = {
          ownerId: userId,
          eventId: id,
          public: publicEvent,
          changes: {
            eventName: eventName,
            startDate: start,
            endDate: end,
            repeatWeekly: repeatWeekly,
            weeklySchedule: days,
            time: time,
            locationName: eventLocation,
            lat: coordinates.end.lat,
            lng: coordinates.end.lng,
            ...(privateEvent && newStart && { startLat: coordinates.start?.lat }),
            ...(privateEvent && newStart && { startLng: coordinates.start?.lng })
          }
        }
        editEvent(eventInfo)
      }
    }
  }

  setDays = newDay => {
    const { days, startDate, endDate, repeatWeekly } = this.state
    const daysList = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 }
    const dayIndex = daysList[newDay]

    // TODO: should also check for endDay if repeatWeekly is checked
    // can't remove day if it is the chosen start date (alarm must ring on that day)
    if (dayIndex != startDate.getDay()) {
      const newValue = days[dayIndex] == "0" ? "1" : "0"
      const newDaysString = days.substring(0, dayIndex) + newValue + days.substring(dayIndex + 1)
      this.setState({ days: newDaysString })
    }
  }

  setDate = date => {
    // Update the days string so that only the new day is highlighted
    let updatedDays = this.state.days
    let newDayString = "0000000"
    const dayIndex = date.getDay()
    updatedDays = newDayString.substring(0, dayIndex) + "1" + newDayString.substring(dayIndex + 1)
    this.setState({
      startDate: date,
      showStartDatePicker: false,
      days: updatedDays
    })
  }

  render() {
    const {
      eventName,
      eventLocation,
      publicEvent,
      repeatWeekly,
      showStartDatePicker,
      showEndDatePicker,
      startDate,
      endDate,
      eventStart,
      days,
      locationError
    } = this.state
    const { error } = this.props
    return (
      <View style={styles.container}>
        <WeekdayPicker daysString={days} onPress={this.setDays} />
        <TextInput
          label='Event Name'
          value={eventName}
          textContentType='name'
          onChangeText={eventName => this.setState({ eventName })}
          mode='outlined'
          style={styles.input}
        />
        <TextInput
          label='Event Location'
          value={eventLocation}
          textContentType='location'
          autoCapitalize='none'
          onChangeText={eventLocation => this.setState({ eventLocation })}
          mode='outlined'
          style={styles.input}
        />
        <TextInput
          label='Change Starting Location'
          value={eventStart}
          textContentType='location'
          autoCapitalize='none'
          onChangeText={eventStart => this.setState({ eventStart })}
          mode='outlined'
          style={styles.input}
        />
        <Button onPress={() => this.setState({ showStartDatePicker: !showStartDatePicker })}>
          {`Start Date: ${formatDateTimeEnglishEST(startDate)}`}
        </Button>
        {repeatWeekly && (
          <Button onPress={() => this.setState({ showEndDatePicker: !showEndDatePicker })}>
            {`Ends: ${formatDateEnglishEST(endDate)}`}
          </Button>
        )}
        {/* TODO: Dropdown?: alarm sound, vibration? */}
        <DateTimePickerModal
          isVisible={showStartDatePicker}
          onConfirm={date => this.setDate(date)}
          onCancel={() => this.setState({ showStartDatePicker: false })}
          minimumDate={new Date(Date.now())}
          value={startDate}
          mode={"datetime"}
        />
        <DateTimePickerModal
          isVisible={showEndDatePicker}
          onConfirm={date => this.setState({ endDate: date, showEndDatePicker: false })}
          onCancel={() => this.setState({ showEndDatePicker: false })}
          minimumDate={startDate}
          value={endDate}
        />
        <Text>{repeatWeekly ? "Repeating Event" : "One-Time Event"}</Text>
        <Switch
          value={repeatWeekly}
          onValueChange={() => this.setState({ repeatWeekly: !repeatWeekly })}
        />
        <Text>{error}</Text>
        <Text>{locationError}</Text>
        <Button onPress={() => this.edit()}>Edit Event</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  input: {
    width: "75%"
  },
  eventsList: {
    height: "93%"
  }
})

const mapState = state => {
  const { id } = state.userInfo
  const { error, successfulEventEdit } = state.events
  return {
    error: error,
    successfulEventEdit: successfulEventEdit,
    userId: id
  }
}

const mapDispatch = dispatch => {
  return {
    editEvent: eventInfo => dispatch(editEventThunk(eventInfo)),
    clearError: () => dispatch(clearError()),
    editStartLocation: info => dispatch(editStartLocationThunk(info))
  }
}

export default connect(mapState, mapDispatch)(EditEvent)
