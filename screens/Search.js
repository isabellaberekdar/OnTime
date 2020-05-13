import React from "react"
import { View, FlatList, StyleSheet, Text } from "react-native"
import { searchEventsThunk, clearError } from "../store/utilities/events"
import { Searchbar } from "react-native-paper"
import { connect } from "react-redux"
import { Event } from "../components"
class Search extends React.Component {
  state = {
    query: ""
  }

  componentDidMount() {
    this.props.clearError()
  }

  searchEvents = query => {
    const searchQuery = {
      eventName: this.state.query
    }
    this.props.search(searchQuery)
  }
  render() {
    const { searchResults, error, id } = this.props
    const { query } = this.state
    return (
      <View style={styles.container}>
        <Searchbar
          placeholder='Find events'
          onChangeText={query => this.setState({ query })}
          value={query}
          onIconPress={() => this.searchEvents(query)}
        />
        {searchResults.length > 0 && !error && (
          <FlatList
            data={searchResults}
            keyExtractor={() => `${Math.floor(Math.random() * 1000000)}`}
            renderItem={event => <Event event={event.item} userId={id} />}
            style={styles.eventsList}
            showsVerticalScrollIndicator={false}
          />
        )}
        <Text>{error}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingTop: "15%",
    paddingBottom: "5%"
  },
  eventsList: {
    marginTop: "5%",
    height: "93%",
    width: "100%"
  },
  text: {
    fontSize: 25
  }
})

const mapState = state => {
  const { events, userInfo } = state

  return {
    searchResults: events.searchResults ?? [],
    successfulSearch: events.successfulSearch,
    error: events.error,
    id: userInfo.id
  }
}

const mapDispatch = dispatch => {
  return {
    search: query => dispatch(searchEventsThunk(query)),
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(Search)
