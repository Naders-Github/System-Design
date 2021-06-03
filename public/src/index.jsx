import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './router/AppRouter.jsx';
import { Provider } from 'react-redux';
import store from './store/store.js';

ReactDOM.render(
  <Provider store={store}>
    <AppRouter/>
  </Provider>,
  document.getElementById('app')
);