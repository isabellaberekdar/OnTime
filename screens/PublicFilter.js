import React from "react"
import { View, FlatList, StyleSheet, Text } from "react-native"
import { Button } from "react-native-paper"
import { connect } from "react-redux"
import { Event } from "../components"

const PublicFilter = props => {
  const { publicEvents, privateEvents, firstName, id, navigation } = props

  let events = [...publicEvents]

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.header}>Your Public Events:</Text>
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
  },
  header: {
    fontSize: 25,
    textAlign: "center",
    paddingTop: "10%",
    paddingBottom: "10%",
    color: "#7B33FF"
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
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(PublicFilter)
