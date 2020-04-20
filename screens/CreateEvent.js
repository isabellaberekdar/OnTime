import React from "react"
import { View, StyleSheet, Text, TouchableNativeFeedbackBase } from "react-native"
import { Button, TextInput, Switch } from "react-native-paper"
import { connect } from "react-redux"
import { registerUserThunk, clearError } from "../store/utilities/users"
import { WeekdayPicker } from "../components"
import DateTimePicker from "@react-native-community/datetimepicker"

class CreateEvent extends React.Component {
  state = {
    eventName: "",
    startDate: "",
    endDate: "",
    startTime: "",
    eventLocation: "",
    privateEvent: false,
    repeatWeekly: false,
    showDateTimePicker: false,
    days: "0000000",
  }

  //TODO: validation
  create = () => {
    const { registerUser } = this.props
    if (true) {
      ///registerUser(email, password, firstName, lastName)
    }
  }

  // If registration is successful, redirect back to Start screen
  componentDidUpdate(prevProps) {
    const { navigation, successfulRegistration } = this.props
    if (
      prevProps.successfulRegistration != successfulRegistration &&
      successfulRegistration === true
    ) {
      navigation.navigate("Home")
    }
  }

  componentDidMount() {
    const { userId, navigation, clearError } = this.props
    clearError()
    if (userId) {
      navigation.navigate("Login")
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
      showDateTimePicker,
      startDate,
      endDate,
      startTime,
      days,
    } = this.state

    return (
      <View style={styles.container}>
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
        {/* <TextInput
          label='first name'
          value={firstName}
          onChangeText={firstName => this.setState({ firstName })}
          mode='outlined'
          style={styles.input}
        />
        <TextInput
          label='last name'
          value={lastName}
          onChangeText={lastName => this.setState({ lastName })}
          mode='outlined'
          style={styles.input}
        /> */}
        <Text>{this.props.error}</Text>
        {showDateTimePicker && (
          <DateTimePicker
            testID='dateTimePicker'
            timeZoneOffsetInMinutes={0}
            value={new Date(1598051730000)}
            mode={"time"}
            is24Hour={true}
            display='default'
            onChange={() => {}}
          />
        )}
        <Text>{!privateEvent ? "Private event" : "public event"}</Text>
        <Switch
          value={privateEvent}
          onValueChange={() => this.setState({ privateEvent: !privateEvent })}
        />
        <Text>{repeatWeekly ? "Repeating event" : "One-time event"}</Text>
        <Switch
          value={repeatWeekly}
          onValueChange={() => this.setState({ repeatWeekly: !repeatWeekly })}
        />
        <Button onPress={() => this.create()}>CreateEvent</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    width: "75%",
  },
  eventsList: {
    height: "93%",
  },
})

const mapState = state => {
  const error = state?.userInfo?.error
  const successfulRegistration = state?.userInfo?.successfulRegistration

  return {
    error: error,
    successfulRegistration: successfulRegistration,
  }
}

const mapDispatch = dispatch => {
  return {
    registerUser: (email, password, firstName, lastName) =>
      dispatch(registerUserThunk(email, password, firstName, lastName)),
    clearError: () => dispatch(clearError()),
  }
}

export default connect(mapState, mapDispatch)(CreateEvent)
