import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import { registerUserThunk, clearError } from "../store/utilities/users"

class Register extends React.Component {
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  }

  //TODO
  validEmail = email => {
    return true
  }

  //TODO
  validPassword = password => {
    return true
  }

  register = (email, password, firstName, lastName) => {
    const { registerUser } = this.props
    if (this.validEmail && this.validPassword) {
      registerUser(email, password, firstName, lastName)
    }
  }

  // If registration is successful, redirect back to Start screen
  componentDidUpdate(prevProps) {
    const { navigation, successfulRegistration } = this.props
    if (
      prevProps.successfulRegistration != successfulRegistration &&
      successfulRegistration === true
    ) {
      navigation.navigate("Start")
    }
  }

  componentDidMount() {
    const { userId, navigation, clearError } = this.props
    clearError()
    if (userId) {
      navigation.navigate("Login")
    }
  }

  render() {
    const { email, password, firstName, lastName } = this.state
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
        <TextInput
          label='first name'
          value={firstName}
          onChangeText={firstName => this.setState({ firstName })}
          style={styles.input}
        />
        <TextInput
          label='last name'
          value={lastName}
          onChangeText={lastName => this.setState({ lastName })}
          style={styles.input}
        />
        <Text>{this.props.error}</Text>
        <Button onPress={() => this.register(email, password, firstName, lastName)}>
          Register
        </Button>
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
  const error = state?.userInfo?.error
  const successfulRegistration = state?.userInfo?.successfulRegistration

  return {
    error: error,
    successfulRegistration: successfulRegistration,
  }
}

const mapDispatch = dispatch => {
  return {
    registerUser: (email, password, firstName, lastName) =>
      dispatch(registerUserThunk(email, password, firstName, lastName)),
    clearError: () => dispatch(clearError()),
  }
}

export default connect(mapState, mapDispatch)(Register)
