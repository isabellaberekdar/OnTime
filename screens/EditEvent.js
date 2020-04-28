import React from "react"
import { View, StyleSheet, Text, TouchableNativeFeedbackBase } from "react-native"
import { Button, TextInput, Switch } from "react-native-paper"
import { editEventThunk, clearError } from "../store/utilities/events"
import { connect } from "react-redux"
import { WeekdayPicker } from "../components"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import moment from "moment"

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
      weeklySchedule
    } = props.route.params

    this.state = {
      eventName: eventName,
      startDate: moment(`${startDate} ${time}`, "YYYY-MM-DD hh:mm A").toDate(),
      endDate: moment(`${endDate} ${time}`, "YYYY-MM-DD hh:mm A").toDate(),
      eventLocation: locationName,
      publicEvent: code === undefined,
      repeatWeekly: repeatWeekly,
      showStartDatePicker: false,
      showEndDatePicker: false,
      days: weeklySchedule
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
edit = () => {
  if (true) {
    const { editEvent, userId } = this.props
    const {
      eventLocation,
      days,
      startDate,
      endDate,
      eventName,
      repeatWeekly,
      publicEvent
    } = this.state

    // startDate is in format: 2020-04-23T22:05:43.170Z
    // date/time in backend will be in UTC
    const start = startDate.toISOString().substring(0, 10)
    let end = !repeatWeekly ? start : endDate.toISOString().substring(0, 10)
    const time = startDate.toISOString().substring(11, 19)
    
    const eventInfo = {
      ownerId: userId,
      eventId: this.props.route.params.id,
      changes: {
        eventName: eventName,
        startDate: start,
        endDate: end,
        repeatWeekly: repeatWeekly,
        weeklySchedule: days,
        time: time,
        locationName: eventLocation,
        private: !publicEvent,
        lat: 1,
        lng: 1
      }
    }

    editEvent(eventInfo)
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
    this.setState({ startDate: date, showStartDatePicker: false, days: updatedDays })
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
      days
    } = this.state

    const gmtStartDateTime = moment.utc(startDate)
    const localStartDateTime = gmtStartDateTime.local().format('YYYY-MMM-DD h:mm A');

    const gmtEndDateTime = moment.utc(endDate)
    const localEndDateTime = gmtEndDateTime.local().format('YYYY-MMM-DD h:mm A');

    console.log('*', localStartDateTime)

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
        <Button onPress={() => this.setState({ showStartDatePicker: !showStartDatePicker })}>
          {`Start Date: ${localStartDateTime}`}
        </Button>
        {repeatWeekly && (
          <Button onPress={() => this.setState({ showEndDatePicker: !showEndDatePicker })}>
            {`End Date: ${localEndDateTime}`}
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
         {/*
        <Text>{publicEvent ? "Public Event" : "Private Event"}</Text>
               
          <Switch
            value={publicEvent}
            onValueChange={() => this.setState({ publicEvent: !publicEvent })}
          /> 
        */}
        <Text>{repeatWeekly ? "Repeating Event" : "One-Time Event"}</Text>
        <Switch
          value={repeatWeekly}
          onValueChange={() => this.setState({ repeatWeekly: !repeatWeekly })}
        />
        <Text>{this.props.error}</Text>
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
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(EditEvent)
