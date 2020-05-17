import React, { Component } from "react"
import { Text, View, StyleSheet } from "react-native"
import { TextInput, Button } from "react-native-paper"

import axios from "axios"

class ForgotPassword extends React.Component {
  state = {
    email: "",
    password: "",
    new_password: ""
  }

  on_password_change = password => {
    this.setState({ password })
  }

  on_new_pass_change = new_password => {
    this.setState({ new_password })
  }

  post_password_to_backend = async () => {
    const { email, password, new_password } = this.state

    const back_end_url = "https://avian-infusion-276423.ue.r.appspot.com/api/account/edit/password"

    if (new_password == "") {
      alert("Password Empty")
      return
    } else {
      await axios.put(back_end_url, this.state)
      await this.props.navigation.navigate("Home")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          label='Enter Email'
          autoCapitalize='none'
          onChangeText={email => this.setState({ email })}
          style={styles.input_password}
        />

        <TextInput
          label='Old Password'
          autoCapitalize='none'
          onChangeText={this.on_password_change}
          secureTextEntry={true}
          style={styles.input_password}
        />

        <TextInput
          label='New Password'
          autoCapitalize='none'
          onChangeText={this.on_new_pass_change}
          secureTextEntry={true}
          style={styles.input_password}
        />

        <Button style={styles.submit_fields} onPress={this.post_password_to_backend}>
          Submit
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  input_password: {
    width: "75%",
    borderRadius: 15,
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15
  },

  submit_fields: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30
  }
})

export default ForgotPassword
