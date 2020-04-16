import React from "react"
import { View, FlatList, StyleSheet, Text } from "react-native"
import { Button } from "react-native-paper"
import { Event } from "../components"
import { connect } from "react-redux"
import { getEventsThunk } from "../store/utilities/events"
import { binaryToStringSchedule } from "../utilities"

const Home = (props, {navigation}) => {
  const { events, firstName, id } = props
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.welcomeText}>Welcome back, {firstName}</Text>
      <Text style={styles.text}>Your Events:</Text>
      <Button onPress={() => navigation.navigate("CreateEvent")}>+ Add Event</Button>
      <FlatList
        data={events}
        renderItem={(event) => <Event event={event.item} userId={id} />}
        keyExtractor={(event) => event.code}
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
      />
      <Button onPress={() => navigation.navigate("Search")}>Search Events</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingTop: "10%",
  },
  eventsList: {
    height: "93%",
    width: "100%",
  },
  text: {
    fontSize: 25,
    alignSelf: "flex-start",
  },
  welcomeText: {
    fontSize: 25,
  },
})

const mapState = (state) => {
  const { events } = state.events
  const { email, id, firstName, lastName } = state.userInfo
  return {
    events: events,
    email: email,
    id: id,
    firstName: firstName,
    lastName: lastName,
  }
}

const mapDispatch = (dispatch) => {
  return {
    getEvents: () => dispatch(getEventsThunk()),
  }
}

export default connect(mapState, mapDispatch)(Home)
