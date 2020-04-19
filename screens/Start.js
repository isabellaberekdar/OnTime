import React from "react"
import { View, StyleSheet } from "react-native"
import { Button } from "react-native-paper"

const Start = props => {
  const { navigation } = props
  return (
    <View style={styles.startContainer}>
      <Button onPress={() => navigation.navigate("Login")}>Login</Button>
      <Button onPress={() => navigation.navigate("Register")}>Register</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingTop: "10%",
  }
})

export default Start
