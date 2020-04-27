import React from "react"
import { View, StyleSheet, Text, TouchableNativeFeedbackBase } from "react-native"
import { Button, TextInput, Switch } from "react-native-paper"
import { editEventThunk, clearError } from "../store/utilities/events"
import { connect } from "react-redux"
import { WeekdayPicker } from "../components"
import DateTimePickerModal from "react-native-modal-datetime-picker"

/* Note: this is copied from CreateEvent, edit is not implemented yet */

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
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
        <Text>{publicEvent ? "Public Event" : "Private Event"}</Text>
        {/*        
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
