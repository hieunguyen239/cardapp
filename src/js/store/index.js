import { createStore, applyMiddleware } from 'redux';
import rootReducer from "../reducers/index";
import thunk from 'redux-thunk';

function configureStore() {  
    return createStore(
      rootReducer,
      applyMiddleware(thunk)
    );
  }
const initialState = {}
const store = configureStore(rootReducer, initialState);

export default store;
