import { combineReducers, applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer } from "redux-persist"
import thunkMiddleware from "redux-thunk"
import { AsyncStorage } from "react-native"

import * as reducers from "../reducers"

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ['userInfo']
}
const rootReducer = combineReducers(reducers)

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware))

const store = createStore(persistedReducer, middleware)

export const persistor = persistStore(store)

export default store
