import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import gameReducer from './reducers/gameReducers';

const rootReducer = combineReducers({
  user: userReducer,
  game: gameReducer,
});

const store = createStore(rootReducer);

export default store;