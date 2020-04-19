import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import { logInUserThunk } from "../store/utilities/users"

class Login extends React.Component {
  state = {
    email: "",
    password: "",
  }

  //TODO
  validEmail = email => {
    return true
  }

  //TODO
  validPassword = password => {
    return true
  }

  logIn = async (email, password) => {
    const { logInUser, navigation, error } = this.props
    if (this.validEmail && this.validPassword) {
      const login = await logInUser(email, password)
      //console.log(error)
      navigation.navigate("Home")
    }
  }

  // TODO: add a loading screen while redux store loads, so logged in users don't see the login screen
  componentDidMount() {
    const { userId, navigation } = this.props
    if (userId) {
      navigation.navigate("Home")
    }
  }

  render() {
    const { email, password } = this.state
    //console.log(this.props.error)
    return (
      <View style={styles.container}>
        <TextInput
          label='email'
          value={email}
          textContentType='emailAddress'
          autoCapitalize='none'
          onChangeText={email => this.setState({ email })}
          style={styles.input}
        />
        <TextInput
          label='password'
          value={password}
          textContentType='password'
          autoCapitalize='none'
          onChangeText={password => this.setState({ password })}
          secureTextEntry
          style={styles.input}
        />
        <Text>{this.props.error}</Text>
        <Button onPress={() => this.logIn(email, password)}>Log in</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    width: "75%",
  },
  eventsList: {
    height: "93%",
  },
})

const mapState = state => {
  const id = state?.userInfo?.id
  const error = state?.userInfo?.error
  return {
    userId: id,
    error: error,
  }
}

const mapDispatch = dispatch => {
  return {
    logInUser: (email, password) => dispatch(logInUserThunk(email, password)),
  }
}

export default connect(mapState, mapDispatch)(Login)
