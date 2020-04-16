import "react-native-gesture-handler"
import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { Provider } from "react-redux"
import store, { persistor } from "./store"
import { PersistGate } from "redux-persist/integration/react"
import {
  Home,
  Login,
  Register,
  CreateEvent,
  EditEvent,
  Event,
  ForgotPassword,
  Invitations,
  Notifications,
} from "./screens"

const Stack = createStackNavigator()

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Login' component={Login} />
            {/*  
            <Stack.Screen name="Register" component={Register} /> 
            <Stack.Screen name="CreateEvent" component={CreateEvent} /> 
            <Stack.Screen name="EditEvent" component={EditEvent} /> 
            <Stack.Screen name="Event" component={Event} /> 
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> 
            <Stack.Screen name="Invitations" component={Invitations} /> 
            <Stack.Screen name="Notifications" component={Notifications} />  
            <Stack.Screen name="Search" component={Search} />      
            */}
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App
