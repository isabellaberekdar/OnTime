import { combineReducers, applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistCombineReducers,  } from "redux-persist"
import { AsyncStorage } from "react-native"
import { PURGE } from "redux-persist"
import thunkMiddleware from "redux-thunk"

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
    result: () => null, 
  }
}

const rootReducer = persistCombineReducers(persistConfig, reducers)
const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware))
const store = createStore(rootReducer, middleware)
export const persistor = persistStore(store)

export default store
