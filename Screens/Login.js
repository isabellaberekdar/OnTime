import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
import { logInUserThunk } from "../store/utilities/users"

class Login extends React.Component {
  state = {
    email: "test@gmail.com",
    password: "password",
  }

  //TODO
  validEmail = (email) => {
    return true
  }

  //TODO
  validPassword = (password) => {
    return true
  }

  logIn = (email, password) => {
    const { logInUser, navigation } = this.props
    if (this.validEmail && this.validPassword) {
      logInUser(email, password)
      navigation.navigate("Home")
    }
  }

  render() {
    const { userId, navigation } = this.props
    const { email, password } = this.state

    if (userId) {
      navigation.navigate('Home')
    }

    return (
      <View style={styles.container}>
        <TextInput
          label='email'
          value={email}
          textContentType='emailAddress'
          autoCapitalize='none'
          onChangeText={(email) => this.setState({ email })}
          style={styles.input}
        />
        <TextInput
          label='password'
          value={password}
          textContentType='password'
          autoCapitalize='none'
          onChangeText={(password) => this.setState({ password })}
          secureTextEntry
          style={styles.input}
        />
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

const mapState = (state) => {
  const { id } = state.userInfo
  return {
    userId: id,
  }
}

const mapDispatch = (dispatch) => {
  return {
    logInUser: (email, password) => dispatch(logInUserThunk(email, password)),
  }
}

export default connect(mapState, mapDispatch)(Login)
