import React from "react"
import { View, FlatList, StyleSheet, Text } from "react-native"
import { Button, Searchbar } from "react-native-paper"
import { connect } from "react-redux"
import { Event } from "../components"
import { searchEventsThunk, clearError } from "../store/utilities/events"
class Search extends React.Component {
  state = {
    query: ""
  }

  componentDidMount() {
    this.props.clearError()
  }

/*   searchEvents = () => {
    console.log("Searching....")
    //this.props.search()
  } */
  render() {
    const { search, searchResults, navigation } = this.props
    const {query} = this.state
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.search}>Search</Text>
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={() => `${Math.floor(Math.random() * 1000000)}`}
            renderItem={event => <Event event={event.item} userId={id} />}
            style={styles.eventsList}
            showsVerticalScrollIndicator={false}
          />
        )}
        <Searchbar
          placeholder='Find events'
          onChangeText={query => this.setState({ query })}
          value={query}
          onIconPress={() => search(query)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingTop: "10%"
  },
  eventsList: {
    height: "93%",
    width: "100%"
  },
  text: {
    fontSize: 25
  }
})

const mapState = state => {
  const { events } = state

  return {
    searchResults: events.searchResults ?? []
  }
}

const mapDispatch = dispatch => {
  return {
    search: query => dispatch(searchEventsThunk(query)),
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(Search)
