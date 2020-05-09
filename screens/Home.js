import React from "react"
import { View, FlatList, StyleSheet, Text } from "react-native"
import { Button } from "react-native-paper"
import { connect } from "react-redux"
import { Event } from "../components"
import { logout } from "../store"

const Home = props => {
  const { publicEvents, privateEvents, firstName, id, navigation } = props

  const logout = () => {
    navigation.navigate("Start")
    props.logout()
  }

  let events = [...publicEvents, ...privateEvents]
  events = events.map(event => (event.user ? event.event : event))

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.welcomeText}>Welcome back, {firstName}</Text>
      <Text style={styles.text}>Your Events:</Text>
      <Button onPress={() => navigation.navigate("CreateEvent")}>+ Add Event</Button>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={() => `${Math.floor(Math.random() * 1000000)}`}
          renderItem={event => <Event event={event.item} userId={id} />}
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text>You have no upcoming events.</Text>
      )}

      <Button onPress={() => navigation.navigate("Search")}>Search Events</Button>
      <Button onPress={() => logout()}>logout</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingTop: "10%"
  },
  eventsList: {
    height: "93%",
    width: "100%"
  },
  text: {
    fontSize: 25,
    alignSelf: "flex-start"
  },
  welcomeText: {
    fontSize: 25
  }
})

const mapState = state => {
  const { events, userInfo } = state

  return {
    publicEvents: events.public ?? [],
    privateEvents: events.private ?? [],
    firstName: userInfo.firstName ?? "unknown",
    id: userInfo.id,
    error: userInfo.error
  }
}

const mapDispatch = dispatch => {
  return {
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(Home)
