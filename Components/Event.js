import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';

const Event = props => {
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
  } = props.event;

  const { userId } = props.userId;
  return (
    <Card>
      <Card.Title title={eventName} />
      <Card.Content>
        <Text>{time}</Text>
        <Text>{weeklySchedule}</Text>
      </Card.Content>
      <Card.Actions>
        {ownerId === userId && <Button>Edit Event</Button>}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  event: {},
});

export default Event;
