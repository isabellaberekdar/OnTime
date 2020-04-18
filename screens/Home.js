import React from "react"
import { View, FlatList, StyleSheet, Text } from "react-native"
import { Button } from "react-native-paper"
import { Event } from "../components"
import { connect } from "react-redux"
import { getEventsThunk } from "../store/utilities/events"
import { PURGE } from "redux-persist"
const Home = (props, { navigation }) => {
  const { events, firstName, id } = props
  
  const logout = () => {
    const { dispatch, navigation } = props

    navigation.navigate("Login")
    dispatch({
      type: PURGE,
      key: "root",
      result: () => null, // Function expected on the submitted action.
    })
  }
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.welcomeText}>Welcome back, {firstName}</Text>
      <Text style={styles.text}>Your Events:</Text>
      <Button onPress={() => navigation.navigate("CreateEvent")}>+ Add Event</Button>
      {events ? (
        <FlatList
          data={events}
          renderItem={event => <Event event={event.item} userId={id} />}
          keyExtractor={event => event.code}
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text>You have no upcoming events.</Text>
      )}

      <Button onPress={() => /*  navigation.navigate("Search") */ logout()}>Search Events</Button>
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

const mapState = state => {
  let events,
    email,
    id,
    firstName,
    lastName = null
  if (state) {
    events = state.events.events
    firstName = state.userInfo.firstName
    id = state.userInfo.id
  }
  return {
    events: events,
    firstName: firstName,
    id: id,
  }
}

const mapDispatch = dispatch => {
  return {
    dispatch,
    /*  getEvents: () => dispatch(getEventsThunk()), */
  }
}

export default connect(mapState, mapDispatch)(Home)
