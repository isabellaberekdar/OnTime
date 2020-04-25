import React from "react"
import { View, StyleSheet, Text, TouchableNativeFeedbackBase } from "react-native"
import { Button, TextInput, Switch } from "react-native-paper"
import { connect } from "react-redux"
import { createEventThunk, clearError } from "../store/utilities/events"
import { WeekdayPicker } from "../components"
import DateTimePickerModal from "react-native-modal-datetime-picker"

class CreateEvent extends React.Component {
  state = {
    eventName: "birthday party",
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    eventLocation: "333 east 16th st",
    privateEvent: false,
    repeatWeekly: false,
    showStartDatePicker: false,
    showEndDatePicker: false,
    // start day picker on top with the current day highlighted (because current date is the default)
    // String format: Su Mo Tu We Th Fr Sa
    days:
      "0000000".substring(0, new Date(Date.now()).getDay()) +
      "1" +
      "0000000".substring(new Date(Date.now()).getDay() + 1)
  }

  componentDidMount() {
    this.props.clearError()
  }

  // If event created successfully, redirect back to Home screen
  componentDidUpdate(prevProps) {
    const { navigation, successfulEventCreation } = this.props
    if (
      prevProps.successfulEventCreation != successfulEventCreation &&
      successfulEventCreation === true
    ) {
      navigation.navigate("Home")
    }
  }

  //TODO: validation
  create = () => {
    if (true) {
      const { createEvent, id } = this.props
      const { eventLocation, days, startDate, endDate, eventName, repeatWeekly } = this.state
      // startDate is in format: 2020-04-23T22:05:43.170Z
      const start = startDate.toISOString().substring(0, 10)
      let end = !repeatWeekly ? start : endDate.toISOString().substring(0, 10)
      const time = startDate.toISOString().substring(11, 19)

      info = {
        ownerId: id,
        eventName: eventName,
        startDate: start,
        endDate: end,
        repeatWeekly: repeatWeekly,
        weeklySchedule: days,
        time: time,
        locationName: eventLocation
      }
      const eventInfo = {
        ownerId: id,
        eventName: eventName,
        startDate: start,
        endDate: end,
        repeatWeekly: repeatWeekly,
        weeklySchedule: days,
        time: time,
        locationName: eventLocation,
        lat: 1,
        lng: 1
      }

      createEvent(eventInfo)
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
    // Update the days string so that the new day is highlighted only
    let updatedDays = this.state.days
    let newDayString = "0000000"
    const dayIndex = date.getDay()
    updatedDays = newDayString.substring(0, dayIndex) + "1" + newDayString.substring(dayIndex + 1)
    this.setState({ startDate: date, showStartDatePicker: false, days: updatedDays })
  }

  render() {
    const {
      eventName,
      eventLocation,
      privateEvent,
      repeatWeekly,
      showStartDatePicker,
      showEndDatePicker,
      startDate,
      endDate,
      days
    } = this.state
    console.log("error?", this.props.error)
    return (
      <View style={styles.container}>
        {console.log(this.props.successfulEventCreation)}
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
        <Button onPress={() => this.setState({ showStartDatePicker: !showStartDatePicker })}>
          {`Start Date: ${startDate.toDateString()}`}
        </Button>
        {repeatWeekly && (
          <Button onPress={() => this.setState({ showEndDatePicker: !showEndDatePicker })}>
            {`End Date: ${endDate.toDateString()}`}
          </Button>
        )}
        {/* TODO: Dropdown?: alarm sound, vibration? */}
        <DateTimePickerModal
          isVisible={showStartDatePicker}
          onConfirm={date => this.setDate(date)}
          onCancel={() => this.setState({ showStartDatePicker: false })}
          minimumDate={new Date(Date.now())}
          value={new Date(Date.now())}
          mode={"datetime"}
        />
        <DateTimePickerModal
          isVisible={showEndDatePicker}
          onConfirm={date => this.setState({ endDate: date, showEndDatePicker: false })}
          onCancel={() => this.setState({ showEndDatePicker: false })}
          minimumDate={startDate}
          value={endDate}
        />
        <Text>{!privateEvent ? "Private Event" : "Public Event"}</Text>
        <Switch
          value={privateEvent}
          onValueChange={() => this.setState({ privateEvent: !privateEvent })}
        />
        <Text>{repeatWeekly ? "Repeating Event" : "One-Time Event"}</Text>
        <Switch
          value={repeatWeekly}
          onValueChange={() => this.setState({ repeatWeekly: !repeatWeekly })}
        />
        <Text>{this.props.error}</Text>
        <Button onPress={() => this.create()}>Create Event</Button>
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
  const id = state.userInfo
  const { error, successfulEventCreation } = state.events
  return {
    error: error,
    successfulEventCreation: successfulEventCreation,
    id: id
  }
}

const mapDispatch = dispatch => {
  return {
    createEvent: eventInfo => dispatch(createEventThunk(eventInfo)),
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(CreateEvent)
