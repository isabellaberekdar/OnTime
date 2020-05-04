import React from "react";
import axios from "axios";
import { View, StyleSheet, Text } from "react-native";
import { Button, TextInput, Switch } from "react-native-paper";
import { connect } from "react-redux";
import { createEventThunk, clearError } from "../store/utilities/events";
import { WeekdayPicker } from "../components";
import {
  formatDateEnglishEST,
  formatDateTimeEnglishEST,
  formatDateEST,
  formatTimeEST
} from "../utilities";
import DateTimePickerModal from "react-native-modal-datetime-picker";

class CreateEvent extends React.Component {
  state = {
    eventName: "",
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    eventStart: "",
    eventLocation: "",
    publicEvent: false,
    repeatWeekly: false,
    showStartDatePicker: false,
    showEndDatePicker: false,
    jsonResponse: [],
    // start day picker on top with the current day highlighted (because current date is the default)
    // String format: Su Mo Tu We Th Fr Sa
    days:
      "0000000".substring(0, new Date(Date.now()).getDay()) +
      "1" +
      "0000000".substring(new Date(Date.now()).getDay() + 1)
  };

  componentDidMount() {
    this.props.clearError();
  }

  // If event created successfully, redirect back to Home screen
  componentDidUpdate(prevProps) {
    const { navigation, successfulEventCreation } = this.props;
    if (
      prevProps.successfulEventCreation != successfulEventCreation &&
      successfulEventCreation === true
    ) {
      navigation.navigate("Home");
    }
  }

  //TODO: validation
  // event name not empty
  // event location not empty
  // start date must be before or equal to end date
  // valid location (must get coordinates)
  create = () => {
    if (true) {
      const { createEvent, userId } = this.props;
      const {
        eventLocation,
        eventStart,
        days,
        startDate,
        endDate,
        eventName,
        repeatWeekly,
        publicEvent
      } = this.state;

      let urlBeginning =
        "https://maps.googleapis.com/maps/api/directions/json?origin=";
      let key = "&key=AIzaSyCSr9dRzI9KFlxg8nzwaoYBFqFiIfgLQc0&mode=transit";

      let url =
        "urlBeginning" +
        eventStartLocation +
        "&destination=" +
        eventLocation +
        key;

      /*
      axios
        .get(url)
        .then(response => {
          if (urlBeginning !== "http://api.giphy.com/v1/gifs/random?") {
            this.setState({ jsonResponse: response.data.data });
          } else {
            this.setState({ jsonResponse: [response.data.data] });
          }
        })
        .catch(error => {
          this.setState({ jsonResponse: [] });
        });

        */

      const start = formatDateEST(startDate);
      const time = formatTimeEST(startDate);
      const end = !repeatWeekly ? start : formatDateEST(endDate);

      const eventInfo = {
        ownerId: userId,
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
      };

      createEvent(eventInfo);
    }
  };

  setDays = newDay => {
    const { days, startDate, endDate, repeatWeekly } = this.state;
    const daysList = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 };
    const dayIndex = daysList[newDay];

    // TODO: should also check for endDate if repeatWeekly is checked
    // can't remove day if it is the chosen start date (alarm must ring on that day)
    if (dayIndex != startDate.getDay()) {
      const newValue = days[dayIndex] == "0" ? "1" : "0";
      const newDaysString =
        days.substring(0, dayIndex) + newValue + days.substring(dayIndex + 1);
      this.setState({ days: newDaysString });
    }
  };

  setDate = date => {
    // Update the days string so that only the new day is highlighted
    let updatedDays = this.state.days;
    let newDayString = "0000000";
    const dayIndex = date.getDay();
    updatedDays =
      newDayString.substring(0, dayIndex) +
      "1" +
      newDayString.substring(dayIndex + 1);
    this.setState({
      startDate: date,
      showStartDatePicker: false,
      days: updatedDays
    });
  };

  render() {
    const {
      eventName,
      eventLocation,
      eventStart,
      publicEvent,
      repeatWeekly,
      showStartDatePicker,
      showEndDatePicker,
      startDate,
      endDate,
      days
    } = this.state;
    return (
      <View style={styles.container}>
        <WeekdayPicker daysString={days} onPress={this.setDays} />
        <TextInput
          label="Event Name"
          value={eventName}
          textContentType="name"
          onChangeText={eventName => this.setState({ eventName })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Event Starting Location"
          value={eventStart}
          textContentType="location"
          autoCapitalize="none"
          onChangeText={eventStart => this.setState({ eventStart })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Event Location"
          value={eventLocation}
          textContentType="location"
          autoCapitalize="none"
          onChangeText={eventLocation => this.setState({ eventLocation })}
          mode="outlined"
          style={styles.input}
        />
        <Button
          onPress={() =>
            this.setState({ showStartDatePicker: !showStartDatePicker })
          }
        >
          {`Starts: ${formatDateTimeEnglishEST(startDate)}`}
        </Button>
        {repeatWeekly && (
          <Button
            onPress={() =>
              this.setState({ showEndDatePicker: !showEndDatePicker })
            }
          >
            {`Ends: ${formatDateEnglishEST(endDate)}`}
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
          onConfirm={date =>
            this.setState({ endDate: date, showEndDatePicker: false })
          }
          onCancel={() => this.setState({ showEndDatePicker: false })}
          minimumDate={startDate}
          value={endDate}
        />
        <Text>{publicEvent ? "Public Event" : "Private Event"}</Text>
        <Switch
          value={publicEvent}
          onValueChange={() => this.setState({ publicEvent: !publicEvent })}
        />
        <Text>{repeatWeekly ? "Repeating Event" : "One-Time Event"}</Text>
        <Switch
          value={repeatWeekly}
          onValueChange={() => this.setState({ repeatWeekly: !repeatWeekly })}
        />
        <Text>{this.props.error}</Text>
        <Button onPress={() => this.create()}>Create Event</Button>
      </View>
    );
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
});

const mapState = state => {
  const { id } = state.userInfo;
  const { error, successfulEventCreation } = state.events;
  return {
    error: error,
    successfulEventCreation: successfulEventCreation,
    userId: id
  };
};

const mapDispatch = dispatch => {
  return {
    createEvent: eventInfo => dispatch(createEventThunk(eventInfo)),
    clearError: () => dispatch(clearError())
  };
};

export default connect(mapState, mapDispatch)(CreateEvent);
