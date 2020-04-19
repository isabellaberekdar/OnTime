import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import { registerUserThunk } from "../store/utilities/users"

class Register extends React.Component {
  state = {
    email: "banana@gmail.com",
    password: "password",
    firstName: "apple",
    lastName: "banana",
    error: null,
  }

  //TODO
  validEmail = email => {
    return true
  }

  //TODO
  validPassword = password => {
    return true
  }

  register = async (email, password) => {
    const { registerUser } = this.props
    if (this.validEmail && this.validPassword) {
      registerUser(email, password)
    }
  }

  // If registration is successful, redirect to homepage
  componentDidUpdate(prevProps) {
    const { navigation, successfulRegistration } = this.props
    if (prevProps.successfulRegistration != successfulRegistration && successfulRegistration === true) {
      navigation.navigate("Home")
    }
  }

  componentDidMount() {
    const { userId, navigation } = this.props
    if (userId) {
      navigation.navigate("Login")
    }
  }

  render() {
    const { email, password, firstName, lastName, error } = this.state
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
          textContentType='firstName'
          onChangeText={firstName => this.setState({ firstName })}
          style={styles.input}
        />
        <TextInput
          label='lastName'
          value={lastName}
          textContentType='last name'
          onChangeText={lastName => this.setState({ lastName })}
          style={styles.input}
        />
        <Text>{error}</Text>
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
    registerUser: (email, password) => dispatch(registerUserThunk(email, password)),
  }
}

export default connect(mapState, mapDispatch)(Register)
