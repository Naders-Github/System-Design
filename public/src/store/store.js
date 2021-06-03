import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import reviewsReducer from '../reducers/reviewsReducer';
import productIdReducer from '../reducers/productIdReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    reviewsReducer,
    productIdReducer
  }),
  composeEnhancers(applyMiddleware(thunk)),
);

export default store;
