import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import { logInUserThunk } from "../store/utilities/users"

class Login extends React.Component {
  state = {
    email: "test@gmail.com",
    password: "password",
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

  logIn = async (email, password) => {
    const { logInUser } = this.props
    if (this.validEmail && this.validPassword) {
      logInUser(email, password)
    }
  }

  // If login is successful, redirect to homepage
  componentDidUpdate(prevProps, prevState) {
    const { navigation, successfulLogin } = this.props
    if (prevProps.successfulLogin != successfulLogin && successfulLogin === true) {
      navigation.navigate("Home")
      // clear error
    }
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
    logInUser: (email, password) => dispatch(logInUserThunk(email, password)),
  }
}

export default connect(mapState, mapDispatch)(Login)
