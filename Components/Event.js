import React from "react"
import { StyleSheet, Text } from "react-native"
import { Button, Card } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { binaryToStringSchedule, convert24HourTime } from "../utilities"

const Event = (props) => {
  const {
    id,
    ownerId,
    eventName,
    startDate,
    endDate,
    repeatWeekly,
    weeklySchedule,
    time,
    locationName,
    lat,
    lng,
    code,
  } = props.event
  const { userId } = props
  const navigation = useNavigation()

  return (
    <Card style={styles.event} onPress={() => navigation.navigate("Event", props.event)}>
      <Card.Title title={eventName} />
      <Card.Content>
        <Text>{convert24HourTime(time)}</Text>
        <Text>{binaryToStringSchedule(weeklySchedule)}</Text>
      </Card.Content>
      <Card.Actions>
        {ownerId === userId && (
          <Button onPress={() => navigation.navigate("EditEvent", props.event)}>Edit Event</Button>
        )}
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  event: {
    marginVertical: "1%",
  },
})

export default Event
