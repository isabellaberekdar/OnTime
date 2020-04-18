import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { connect } from "react-redux"
//import { registerUserThunk } from "../store/utilities/users"

class Register extends React.Component {
  state = {
    email: "test@gmail.com",
    password: "password",
    firstName: '', 
    lastName: ''
  }

  //TODO
  validEmail = (email) => {
    return true
  }

  //TODO
  validPassword = (password) => {
    return true
  }

  register = async (email, password) => {
    const { logInUser, navigation } = this.props
    if (this.validEmail && this.validPassword) {
      await registerUser(email, password)
      navigation.navigate("Home")
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

/* const mapState = (state) => {
  const  id = state?.userInfo?.id
  return {
    userId: id,
  }
} */

const mapDispatch = (dispatch) => {
  return {
    //register: (email, password) => dispatch(registerThunk(email, password)),
  }
}

export default connect(null, mapDispatch)(Register)
