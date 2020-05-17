import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import { logInUserThunk, clearError } from "../store/utilities/users"
import axios from "axios"
import { Notifications } from "expo"
import * as Permissions from "expo-permissions"
import Constants from "expo-constants"

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    userToken: "",
    verifying: false,
    successfulVerification: false,
    verificationError: null
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
    const { logInUser } = this.props
    const pushToken = await this.generateToken()
    console.log(pushToken)
    if (this.validEmail && this.validPassword) {
      logInUser(email, password, pushToken)
    }
  }

  verifyUser = async () => {
    const { userToken, verificationError } = this.state
    const { usersInfoId } = this.props

    const info = {
      usersInfoId,
      userToken
    }

    const { data } = await axios.post(
      "https://avian-infusion-276423.ue.r.appspot.com/api/login/authenticate",
      info
    )

    this.setState(
      data.success ? { successfulVerification: true } : { verificationError: data.error }
    )
  }
  // Notification Functions:
  generateToken = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      return null
    }

    const token = await Notifications.getExpoPushTokenAsync()
    return token
  }

  // If login is successful, redirect to homepage
  componentDidUpdate(prevProps, prevState) {
    const { navigation, successfulLogin } = this.props
    if (
      prevState.successfulVerification != this.state.successfulVerification &&
      this.state.successfulVerification === true
    ) {
      navigation.navigate("Home")
    }

    // transition to verification
    if (prevProps.successfulLogin != successfulLogin && successfulLogin === true) {
      this.setState({ verifying: true })
    }
  }

  componentDidMount() {
    this.props.clearError()
  }

  render() {
    const { email, password, verifying, userToken, verificationError } = this.state

    return (
      <View style={styles.container}>
        {!verifying ? (
          <>
            <TextInput
              label='Email'
              value={email}
              textContentType='emailAddress'
              autoCapitalize='none'
              onChangeText={email => this.setState({ email })}
              style={styles.input}
            />
            <TextInput
              label='Password'
              value={password}
              textContentType='password'
              autoCapitalize='none'
              onChangeText={password => this.setState({ password })}
              secureTextEntry
              style={styles.input}
            />
            <Text>{this.props.error}</Text>
            <Button onPress={() => this.logIn(email, password)}>Log in</Button>
          </>
        ) : (
          <>
            <Text style={styles.text}>
              We have sent a one-time verification token to your email. Enter the token below to
              finish logging in.
            </Text>
            <TextInput
              label='Auth Token'
              value={userToken}
              autoCapitalize='none'
              keyboardType={"numeric"}
              onChangeText={userToken => this.setState({ userToken })}
              style={styles.input}
            />
            <Text>{verificationError}</Text>
            <Button onPress={() => this.verifyUser()}>Check Token</Button>
          </>
        )}
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
    width: "75%"
  },
  eventsList: {
    height: "93%"
  },
  text: {
    margin: "4%"
  }
})

const mapState = state => {
  const id = state?.userInfo?.id
  const error = state?.userInfo?.error
  const successfulLogin = state?.userInfo?.successfulLogin
  const usersInfoId = state?.userInfo?.usersInfoId
  return {
    userId: id,
    usersInfoId: usersInfoId,
    error: error,
    successfulLogin: successfulLogin
  }
}

const mapDispatch = dispatch => {
  return {
    logInUser: (email, password, pushToken) => dispatch(logInUserThunk(email, password, pushToken)),
    clearError: () => dispatch(clearError())
  }
}

export default connect(mapState, mapDispatch)(Login)
