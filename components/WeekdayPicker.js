import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Day from "./Day"

const WeekdayPicker = props => {
  let { daysString, onPress } = props
  const daysList = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 }
  return (
    <View style={styles.container}>
      {Object.keys(daysList).map(day => (
        <Day day={day} key={day} active={daysString[daysList[day]] == "1"} onPress={onPress} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    height: 30,
    marginTop: "30%",
    marginBottom: "30%",
  },
})

export default WeekdayPicker
