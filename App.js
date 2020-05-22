import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

import { Notifications as ExpoNotificationSystem } from "expo";
import { Audio } from "expo-av";

import {
  Home,
  Login,
  Register,
  Start,
  CreateEvent,
  EditEvent,
  Event,
  ForgotPassword,
  Notifications,
  Search,
  Loading,
  PublicFilter,
  PrivateFilter
} from "./screens";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const navigationOption = {
  colors: {
    primary: "white",
    background: "white",
    card: "#65509f",
    text: "white",
    border: "green"
  }
};

function DrawerMenu() {
  return (
    <Drawer.Navigator initialRouteName={"Home"} style={styles.container}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Public" component={PublicFilter} />
      <Drawer.Screen name="Private" component={PrivateFilter} />
      <Drawer.Screen name="Change Password" component={ForgotPassword} />
    </Drawer.Navigator>
  );
}

const App = props => {
  const handleExpoNotification = async expoNotification => {
    const soundObject = new Audio.Sound();
    try {
      if (expoNotification.data.status) {
        await soundObject.loadAsync(
          require("./assets/sounds/event-passed.mp3")
        );
      } else {
        await soundObject.loadAsync(
          require("./assets/sounds/event-failed.mp3")
        );
      }
      await soundObject.playAsync();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ExpoNotificationSystem.addListener(handleExpoNotification);
  });

  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={
          <View>
            <Loading />
          </View>
        }
      >
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={"Start"}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="Home" children={DrawerMenu} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="CreateEvent" component={CreateEvent} />
            <Stack.Screen name="EditEvent" component={EditEvent} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Event" component={Event} />
            {/*
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Notifications" component={Notifications} />
            */}
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B33FF"
  }
});

export default App;
