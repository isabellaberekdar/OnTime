import React from "react"
import { View, StyleSheet } from "react-native"
import { Button } from "react-native-paper"
import { connect } from "react-redux"

const Start = props => {
  const { navigation, userLoggedIn } = props

  if (userLoggedIn) {
    navigation.navigate("Home")
  }

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
    paddingTop: "10%"
  }
})

const mapState = state => {
  const authenticated = state?.userInfo?.authenticated
  return {
    userLoggedIn: authenticated
  }
}

export default connect(mapState)(Start)
