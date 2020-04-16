import { combineReducers, applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import * as reducers from "../reducers";

const rootReducer = combineReducers(reducers);
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware)
);
const store = createStore(rootReducer, middleware);

export default store;
