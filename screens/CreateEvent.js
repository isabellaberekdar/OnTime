import React from "react"
import { View, StyleSheet, Text, TouchableNativeFeedbackBase } from "react-native"
import { Button, TextInput, Switch } from "react-native-paper"
import { connect } from "react-redux"
import { createEventThunk, clearError } from "../store/utilities/users"
import { WeekdayPicker } from "../components"
import DateTimePickerModal from "react-native-modal-datetime-picker"

class CreateEvent extends React.Component {
  state = {
    eventName: "",
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    eventLocation: "",
    privateEvent: false,
    repeatWeekly: false,
    showStartDatePicker: false,
    showEndDatePicker: false,
    showStartTimePicker: false,
    days: "0000000" // Su Mo Tu We Th Fr Sa
  }

  componentDidMount() {
    const { clearError } = this.props
    clearError()
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
    const { createEvent } = this.props
    if (true) {
      const eventInfo = {}
      // 2020-04-23T22:05:43.170Z
      // separate start time and start date here
      createEvent(eventInfo)
    }
  }

  setDays = newDay => {
    const { days } = this.state
    const daysList = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 }
    const dayIndex = daysList[newDay]
    const newValue = days[dayIndex] == "0" ? "1" : "0"
    const newDaysString = days.substring(0, dayIndex) + newValue + days.substring(dayIndex + 1)
    this.setState({ days: newDaysString })
  }

  render() {
    const {
      eventName,
      eventLocation,
      privateEvent,
      repeatWeekly,
      showStartDatePicker,
      showEndDatePicker,
      showStartTimePicker,
      startDate,
      endDate,
      startTime,
      days
    } = this.state

    return (
      <View style={styles.container}>
        {console.log(startDate, showStartDatePicker)}
        <WeekdayPicker daysString={days} onPress={this.setDays} />
        <TextInput
          label='event name'
          value={eventName}
          textContentType='name'
          onChangeText={eventName => this.setState({ eventName })}
          mode='outlined'
          style={styles.input}
        />
        <TextInput
          label='event location'
          value={eventLocation}
          textContentType='location'
          autoCapitalize='none'
          onChangeText={eventLocation => this.setState({ eventLocation })}
          secureTextEntry
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
        <Button onPress={() => this.setState({ showStartTimePicker: !showStartTimePicker })}>
          {`Start Time: ${startTime}`}
        </Button>
        {/*<TextInput
          label='last name'
          value={lastName}
          onChangeText={lastName => this.setState({ lastName })}
          mode='outlined'
          style={styles.input}
        /> */}
        <Text>{this.props.error}</Text>
        <DateTimePickerModal
          isVisible={showStartDatePicker}
          onConfirm={date => this.setState({ startDate: date, showStartDatePicker: false })}
          onCancel={() => this.setState({ showStartDatePicker: false })}
          minimumDate={new Date(Date.now())}
          value={new Date(Date.now())}
          mode={'datetime'}
        />
        <DateTimePickerModal
          isVisible={showEndDatePicker}
          onConfirm={date => this.setState({ endDate: date, showEndDatePicker: false })}
          onCancel={() => this.setState({ showEndDatePicker: false })}
          minimumDate={startDate}
          value={endDate}
        />
{/*         <DateTimePickerModal
          isVisible={showStartTimePicker}
          onConfirm={date => this.setState({ startTime: date, showStartTimePicker: false })}
          onCancel={() => this.setState({ showStartTimePicker: false })}
          value={startTime}
          mode={'time'}
          is24Hour
        /> */}
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
  const error = state?.userInfo?.error
  const successfulEventCreation = state?.userInfo?.successfulEventCreation

  return {
    error: error,
    successfulEventCreation: successfulEventCreation
  }
}

const mapDispatch = dispatch => {
  return {
    createEvent: eventInfo => dispatch(createEventThunk(eventInfo)),
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(CreateEvent)
