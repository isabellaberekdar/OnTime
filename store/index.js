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
  whitelist: ["userInfo", "events"],
}

export const logout = () => {
  return {
    type: PURGE,
    key: "root",
    result: () => null, // Function expected on the submitted action.
  }
}

const rootReducer = persistCombineReducers(persistConfig, reducers)
const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware))
const store = createStore(rootReducer, middleware)
export const persistor = persistStore(store)

export default store
