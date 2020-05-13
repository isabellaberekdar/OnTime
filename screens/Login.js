import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import { logInUserThunk, clearError } from "../store/utilities/users"
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions' 

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
    const pushToken = await this.generateToken()
    const { logInUser } = this.props
    if (this.validEmail && this.validPassword) {
      logInUser(email, password, pushToken)
    }
  }

  // If login is successful, redirect to homepage
  componentDidUpdate(prevProps) {
    const { navigation, successfulLogin } = this.props
    if (prevProps.successfulLogin != successfulLogin && successfulLogin === true) {
      navigation.navigate("Home")
    }
  }

  componentDidMount() {
    this.props.clearError()
  }

  // Notification Functions:
  generateToken = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync()
    return token
  }

  render() {
    const { email, password } = this.state

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
    justifyContent: "center"
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
  const successfulLogin = state?.userInfo?.successfulLogin

  return {
    userId: id,
    error: error,
    successfulLogin: successfulLogin,
  }
}

const mapDispatch = dispatch => {
  return {
    logInUser: (email, password, pushToken) => dispatch(logInUserThunk(email, password, pushToken)),
    clearError: () => dispatch(clearError()),
  }
}

export default connect(mapState, mapDispatch)(Login)
