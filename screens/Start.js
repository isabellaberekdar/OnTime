import React from "react"
import { View, FlatList, StyleSheet } from "react-native"
import { Button } from "react-native-paper"

const Start = (props) => {
  const {navigation} = props
  return (
    <View style={styles.homeContainer}>
      <Button onPress={() => navigation.navigate("Login")}>Login</Button>
      <Button onPress={() => navigation.navigate("Register")}>Register  </Button>
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

export default Start
