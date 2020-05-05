import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper';

class ForgotPassword extends React.Component
{
    state =
    {
        email: ""
    }

    validateEmail = ( email ) =>
    {
        return true
    }



    render()
    {
        const { email } = this.state

        return (
            <View style={styles.container}>
                <TextInput
                    label="Email"
                    value={ email }
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    onChangeText={ email => this.setState({ email })}
                    style={ styles.input_email }
                    underlineColorAndroid="transparent"
                />

                <Button style={ styles.submit_email }>Submit</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    input_email:
    {
        width: "75%",
        borderRadius: 15,
        borderTopEndRadius: 15,
        borderTopLeftRadius: 15,
    },

    submit_email:
    {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 30
    }
})

export default ForgotPassword