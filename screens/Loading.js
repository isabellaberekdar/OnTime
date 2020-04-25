import React from "react"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator } from "react-native-paper"

const Loading = props => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} size='large' />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingTop: "10%"
  }
})

export default Loading
