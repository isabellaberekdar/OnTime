import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { Event } from '../Components';
import { connect } from 'react-redux';
import { getEventsThunk } from '../Store/utilities/events';

class Home extends React.Component {
  getEvents = async () => {};
  render() {
    const { events } = this.props;
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.welcomeText}>Welcome back, {'Name'}</Text>
        <Text style={styles.text}>Your Events:</Text>
        <Button onPress={() => navigation.navigate('CreateEvent')}>
          + Add Event
        </Button>
        <FlatList
          data={events}
          renderItem={event => <Event event={event.item} userId={1} />}
          keyExtractor={event => event.code}
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
        />
        <Button onPress={() => navigation.navigate('Search')}>
          Search Events
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  eventsList: {
    height: '93%',
    width: '100%',
  },
  text: {
    fontSize: 25,
    alignSelf: 'flex-start',
  },
  welcomeText: {
    fontSize: 25,
  },
});

const mapState = state => {
  const { events } = state;
  return {
    events: events.events,
  };
};

const mapDispatch = dispatch => {
  return {
    getEvents: () => dispatch(getEventsThunk()),
  };
};

export default connect(
  mapState,
  mapDispatch,
)(Home);
