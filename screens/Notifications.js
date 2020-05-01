// All temporary code. I need something in here so I can link screen to Side menu without giving error.

import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class Notifications extends Component
{
    render()
    {
        return (
            <View style={styles.container}>
                <Text> Notification Screen </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        alignItems: "center"
    }
})