import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import reviewsReducer from '../reducers/reviewsReducer';
import productsReducer from '../reducers/productsReducer';
import questionsReducer from '../reducers/questionsReducer';
import answersReducer from '../reducers/answersReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    reviewsReducer,
    productsReducer,
    questionsReducer,
    answersReducer
  }),
  composeEnhancers(applyMiddleware(thunk)),
);

export default store;
