import React from "react"
import { Text, TouchableOpacity, StyleSheet } from "react-native"
import { Button } from "react-native-paper"

const Day = props => {
  const { day, onPress, active } = props
 
  return (
    <TouchableOpacity style={[styles.day, active ? styles.active : styles.inactive]} onPress={() => onPress(day)}>
      <Text>{day}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  day: {
    height: 40,
    width: 40,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  active: {
    backgroundColor: "#b8d9cb",
  },
  inactive: {
    
  },
})

export default Day
