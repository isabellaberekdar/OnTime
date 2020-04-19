import { combineReducers, applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer, persistCombineReducers, autoRehydrate } from "redux-persist"
import thunkMiddleware from "redux-thunk"
import { AsyncStorage } from "react-native"
import { PURGE } from "redux-persist"

import * as reducers from "../reducers"

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ['userInfo', 'events']
}

export const logout = () => {
  return {
    type: "USER_LOGGED_OUT",
  }
}

const appReducer = persistCombineReducers(persistConfig, reducers)
const rootReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGGED_OUT":
      return {}
  }

  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware))
const store = createStore(persistedReducer, middleware)
export const persistor = persistStore(store)

export default store
